"""
ai.py — Fixed ASL/FSL Recognition Backend API (224x224 Compatible)
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import mediapipe as mp
import os
from io import BytesIO
from PIL import Image
from datetime import datetime
import uvicorn
import time
from collections import deque

# ===== FIXED CONFIG =====
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "checkpoint_model.keras")
CLASS_NAMES_PATH = os.path.join(MODELS_DIR, "class_names.txt")

# CRITICAL FIX: Changed to 224 to match model training
IMG_SIZE = 224  # ✅ Fixed from 160 to 224
CONFIDENCE_THRESHOLD = 0.60
STABLE_CONFIDENCE_THRESHOLD = 0.70
MAX_HANDS = 1
BUFFER_SIZE = 5  # For stable predictions

os.makedirs(MODELS_DIR, exist_ok=True)

# ===== APP INIT =====
app = FastAPI(
    title="ASL/FSL Recognition API",
    version="3.0",
    description="Real-time Sign Language Recognition API - Fixed 224x224"
)

# ===== CORS MIDDLEWARE =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== LOAD MODEL =====
model = None
try:
    if os.path.exists(MODEL_PATH):
        model = load_model(MODEL_PATH)
        print("[✅] Model loaded successfully")
        print(f"    Input size: {IMG_SIZE}x{IMG_SIZE}")
        print(f"    Model input shape: {model.input_shape}")
    else:
        print(f"[⚠️] Model not found at {MODEL_PATH}")
except Exception as e:
    print(f"[❌] Error loading model: {e}")
    model = None

# ===== LOAD CLASS NAMES =====
CLASS_NAMES = []
try:
    if os.path.exists(CLASS_NAMES_PATH):
        with open(CLASS_NAMES_PATH, "r") as f:
            CLASS_NAMES = [line.strip() for line in f.readlines() if line.strip()]
        print(f"[✅] Loaded {len(CLASS_NAMES)} classes")
        print(f"    Classes: {', '.join(CLASS_NAMES[:10])}...")
    else:
        print(f"[⚠️] Class names not found at {CLASS_NAMES_PATH}")
except Exception as e:
    print(f"[❌] Error loading classes: {e}")
    CLASS_NAMES = []

# ===== MEDIAPIPE HAND DETECTOR =====
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=MAX_HANDS,
    min_detection_confidence=0.6,  # Increased for better detection
    min_tracking_confidence=0.5
)

# ===== PREDICTION BUFFER (For Stability) =====
prediction_buffer = deque(maxlen=BUFFER_SIZE)

# ===== UTILITY FUNCTIONS =====
def preprocess_hand_roi(hand_roi: np.ndarray) -> np.ndarray:
    """
    Preprocess hand ROI to 224x224 (FIXED)
    Maintains aspect ratio with padding
    """
    try:
        h, w = hand_roi.shape[:2]
        
        # Calculate padding to make square
        if h > w:
            target_size = h
            pad_w = (h - w) // 2
            pad_h = 0
        else:
            target_size = w
            pad_h = (w - h) // 2
            pad_w = 0
        
        # Add padding to make square
        padded = cv2.copyMakeBorder(
            hand_roi,
            pad_h, pad_h, pad_w, pad_w,
            cv2.BORDER_CONSTANT,
            value=(0, 0, 0)
        )
        
        # Resize to 224x224 (CRITICAL FIX)
        roi_resized = cv2.resize(padded, (IMG_SIZE, IMG_SIZE), interpolation=cv2.INTER_AREA)
        
        # Preprocess for MobileNetV2
        roi_processed = preprocess_input(roi_resized.astype(np.float32))
        
        return np.expand_dims(roi_processed, axis=0)
    
    except Exception as e:
        raise ValueError(f"Preprocessing failed: {e}")

def extract_hand_region(frame: np.ndarray, hand_landmarks) -> tuple:
    """
    Extract hand region with improved bounding box
    """
    h, w = frame.shape[:2]
    
    # Get all landmark coordinates
    x_coords = [lm.x * w for lm in hand_landmarks.landmark]
    y_coords = [lm.y * h for lm in hand_landmarks.landmark]
    
    # Calculate bounding box with margin
    margin = 30  # Increased margin for better hand capture
    x_min = max(0, int(min(x_coords) - margin))
    y_min = max(0, int(min(y_coords) - margin))
    x_max = min(w, int(max(x_coords) + margin))
    y_max = min(h, int(max(y_coords) + margin))
    
    # Extract ROI
    hand_roi = frame[y_min:y_max, x_min:x_max]
    
    return hand_roi, (x_min, y_min, x_max, y_max)

def get_prediction(hand_roi: np.ndarray) -> dict:
    """
    Get sign prediction with confidence
    """
    if model is None:
        raise RuntimeError("Model not loaded")
    
    if hand_roi.size == 0:
        raise ValueError("Invalid hand region")
    
    # Preprocess (now correctly 224x224)
    roi_input = preprocess_hand_roi(hand_roi)
    
    # Predict
    predictions = model.predict(roi_input, verbose=0)[0]
    
    # Get top prediction
    pred_index = np.argmax(predictions)
    confidence = float(predictions[pred_index])
    pred_class = CLASS_NAMES[pred_index] if pred_index < len(CLASS_NAMES) else "Unknown"
    
    # Get top 3 predictions for debugging
    top_3_indices = np.argsort(predictions)[-3:][::-1]
    top_3 = [
        {
            "class": CLASS_NAMES[i] if i < len(CLASS_NAMES) else "Unknown",
            "confidence": float(predictions[i])
        }
        for i in top_3_indices
    ]
    
    return {
        "class": pred_class,
        "confidence": confidence,
        "index": int(pred_index),
        "top_3": top_3
    }

def get_stable_prediction():
    """
    Get stable prediction from buffer (majority voting)
    """
    if len(prediction_buffer) < 3:
        return None, 0.0
    
    # Count occurrences
    from collections import Counter
    predictions = [p["class"] for p in prediction_buffer]
    counter = Counter(predictions)
    
    most_common = counter.most_common(1)[0]
    pred_class = most_common[0]
    count = most_common[1]
    
    # Calculate average confidence for this class
    confidences = [p["confidence"] for p in prediction_buffer if p["class"] == pred_class]
    avg_confidence = np.mean(confidences)
    
    # Require at least 3 out of 5 frames with same prediction
    if count >= 3 and avg_confidence >= STABLE_CONFIDENCE_THRESHOLD:
        return pred_class, avg_confidence
    
    return None, 0.0

# ===== API ROUTES =====
@app.get("/")
def home():
    """API status"""
    return {
        "message": "🤟 ASL/FSL Recognition API (Fixed 224x224)",
        "version": "3.0",
        "model": "✅ Loaded" if model else "❌ Not loaded",
        "classes": len(CLASS_NAMES),
        "img_size": f"{IMG_SIZE}x{IMG_SIZE}",
        "model_input": str(model.input_shape) if model else "N/A",
        "status": "Fixed and Ready"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "classes_loaded": len(CLASS_NAMES) > 0,
        "num_classes": len(CLASS_NAMES),
        "img_size": IMG_SIZE,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/classes")
def get_classes():
    """Get all available sign classes"""
    if not CLASS_NAMES:
        raise HTTPException(status_code=503, detail="Classes not loaded")
    
    return {
        "total_classes": len(CLASS_NAMES),
        "classes": CLASS_NAMES
    }

@app.post("/reset_buffer")
def reset_buffer():
    """Reset prediction buffer"""
    prediction_buffer.clear()
    return {"status": "Buffer cleared"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Sign prediction endpoint with stable detection
    Returns: real-time + stable predictions
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if not CLASS_NAMES:
        raise HTTPException(status_code=503, detail="Classes not loaded")
    
    start_time = time.time()
    
    try:
        # Read image
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty file")
        
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        frame = np.array(image)
        
        # Detect hands
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        results = hands.process(frame_rgb)
        
        if not results.multi_hand_landmarks:
            # No hand detected - clear buffer
            prediction_buffer.clear()
            return {
                "hand_detected": False,
                "real_time_prediction": None,
                "real_time_confidence": 0.0,
                "stable_prediction": None,
                "stable_confidence": 0.0,
                "should_add_to_transcript": False,
                "bounding_box": None,
                "inference_time": round((time.time() - start_time) * 1000, 2)
            }
        
        # Extract hand region
        hand_landmarks = results.multi_hand_landmarks[0]
        hand_roi, bbox = extract_hand_region(frame, hand_landmarks)
        
        if hand_roi.size == 0:
            prediction_buffer.clear()
            return {
                "hand_detected": True,
                "real_time_prediction": "Invalid hand",
                "real_time_confidence": 0.0,
                "stable_prediction": None,
                "stable_confidence": 0.0,
                "should_add_to_transcript": False,
                "bounding_box": {
                    "x_min": bbox[0],
                    "y_min": bbox[1],
                    "x_max": bbox[2],
                    "y_max": bbox[3]
                },
                "inference_time": round((time.time() - start_time) * 1000, 2)
            }
        
        # Get prediction
        pred_result = get_prediction(hand_roi)
        confidence = pred_result["confidence"]
        pred_class = pred_result["class"]
        
        # Real-time prediction (immediate feedback)
        real_time_pred = pred_class if confidence >= CONFIDENCE_THRESHOLD else "Uncertain"
        
        # Add to buffer
        prediction_buffer.append({
            "class": pred_class,
            "confidence": confidence
        })
        
        # Get stable prediction
        stable_pred, stable_conf = get_stable_prediction()
        
        return {
            "hand_detected": True,
            "real_time_prediction": real_time_pred,
            "real_time_confidence": confidence,
            "stable_prediction": stable_pred,
            "stable_confidence": stable_conf,
            "should_add_to_transcript": stable_pred is not None,
            "bounding_box": {
                "x_min": bbox[0],
                "y_min": bbox[1],
                "x_max": bbox[2],
                "y_max": bbox[3]
            },
            "top_3_predictions": pred_result["top_3"],
            "timestamp": datetime.now().isoformat(),
            "inference_time": round((time.time() - start_time) * 1000, 2),
            "buffer_size": len(prediction_buffer)
        }
    
    except HTTPException as http_e:
        raise http_e
    except Exception as e:
        print(f"[❌] Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# ===== RUN =====
if __name__ == "__main__":
    print("\n" + "="*60)
    print("🤟 ASL/FSL Recognition Backend API (FIXED)")
    print("="*60)
    print("🚀 Starting on http://localhost:8000")
    print(f"📊 Model Input: {IMG_SIZE}x{IMG_SIZE} (Fixed!)")
    print(f"📚 Classes: {len(CLASS_NAMES)}")
    print(f"🎯 Confidence Threshold: {CONFIDENCE_THRESHOLD}")
    print(f"✅ Stable Threshold: {STABLE_CONFIDENCE_THRESHOLD}")
    print("📖 Docs: http://localhost:8000/docs")
    print("="*60 + "\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )