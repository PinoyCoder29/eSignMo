'use client';

import { useRef, useState, useEffect } from 'react';

interface HistoryItem {
  sign: string;
  confidence: number;
  time: string;
}

export default function SignLanguageRecognition() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [currentSign, setCurrentSign] = useState<string>('Waiting...');
  const [currentConfidence, setCurrentConfidence] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [handBoundingBox, setHandBoundingBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [fps, setFps] = useState(0);
  const [inferenceTime, setInferenceTime] = useState(0);
  const [handDetected, setHandDetected] = useState(false);
  const frameCountRef = useRef(0);
  const fpsTimeRef = useRef(Date.now());
  const processingRef = useRef(false);

  // Check backend connection
  useEffect(() => {
    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendConnection = async () => {
    try {
      const res = await fetch('http://localhost:8000/health');
      if (res.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch (err) {
      setBackendStatus('error');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsRunning(true);
        startDetection();
      }
    } catch (err) {
      alert('Please allow webcam access');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
    }
    setIsRunning(false);
    setCurrentSign('Camera stopped');
    setCurrentConfidence('');
    setHandBoundingBox(null);
    setHandDetected(false);
  };

  const captureAndSendFrame = async () => {
    if (!videoRef.current || !canvasRef.current || processingRef.current) return;

    processingRef.current = true;
    frameCountRef.current++;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      processingRef.current = false;
      return;
    }

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    try {
      const startTime = performance.now();

      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((blob) => {
          resolve(blob as Blob);
        }, 'image/jpeg', 0.75);
      });

      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');

      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      const endTime = performance.now();
      setInferenceTime(Math.round(endTime - startTime));

      if (!res.ok) throw new Error('Prediction failed');

      const data = await res.json();

      // Update FPS every 0.5s
      const now = Date.now();
      if (now - fpsTimeRef.current > 500) {
        setFps(Math.round((frameCountRef.current * 1000) / (now - fpsTimeRef.current)));
        frameCountRef.current = 0;
        fpsTimeRef.current = now;
      }

      // Always update bounding box if hand is detected
      if (data.bounding_box) {
        const { x_min, y_min, x_max, y_max } = data.bounding_box;
        const width = x_max - x_min;
        const height = y_max - y_min;

        setHandBoundingBox({
          x: x_min,
          y: y_min,
          width: width,
          height: height,
        });
        setHandDetected(true);

        // Update prediction
        if (data.prediction && data.prediction !== 'No hand detected') {
          const timestamp = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });

          const confidence = Math.round(data.confidence * 100);

          setCurrentSign(data.prediction);
          setCurrentConfidence(`${confidence}% • ${timestamp}`);

          // Only add to history if confident (not Uncertain)
          if (data.prediction !== 'Uncertain') {
            setHistory((prev) => [
              { sign: data.prediction, confidence, time: timestamp },
              ...prev.slice(0, 49),
            ]);
          }
        } else {
          setCurrentSign('Uncertain');
          setCurrentConfidence('');
        }
      } else {
        // No hand detected
        setHandBoundingBox(null);
        setHandDetected(false);
        setCurrentSign('Waiting...');
        setCurrentConfidence('');
      }
    } catch (err) {
      console.error('Error:', err);
      setHandBoundingBox(null);
      setHandDetected(false);
    } finally {
      processingRef.current = false;
    }
  };

  const startDetection = () => {
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    frameIntervalRef.current = setInterval(captureAndSendFrame, 300);
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentSign('Waiting...');
    setCurrentConfidence('');
    setHandBoundingBox(null);
    setHandDetected(false);
  };

  const exportTranscript = () => {
    const transcript = history.map((h) => h.sign).join(' ');
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(transcript)}`);
    element.setAttribute('download', `sign_transcript_${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copySign = (sign: string) => {
    navigator.clipboard.writeText(sign);
  };

  const statusColor =
    backendStatus === 'connected'
      ? '#10b981'
      : backendStatus === 'error'
        ? '#ef4444'
        : '#f59e0b';

  const statusText =
    backendStatus === 'connected'
      ? 'Backend Connected'
      : backendStatus === 'error'
        ? 'Backend Offline'
        : 'Checking...';

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        minHeight: '100vh',
        color: '#fff',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
            🤟 Fast Sign Recognition
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Real-time ASL Detection with Adaptive Hand Tracking</p>
        </div>

        {/* Status Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            padding: '15px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: statusColor,
                animation: 'pulse 2s infinite',
              }}
            />
            <span style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>{statusText}</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: '#94a3b8' }}>FPS:</span> <span style={{ color: '#10b981', fontWeight: 'bold' }}>{fps}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Latency:</span> <span style={{ color: '#10b981', fontWeight: 'bold' }}>{inferenceTime}ms</span>
            </div>
            {handDetected && (
              <div>
                <span style={{ color: '#94a3b8' }}>Hand:</span> <span style={{ color: '#10b981', fontWeight: 'bold' }}>Detected</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', alignItems: 'start' }}>
          {/* Left: Camera Feed */}
          <div>
            {/* Video with Adaptive Bounding Box */}
            <div
              style={{
                background: '#000',
                border: '2px solid #667eea',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '20px',
                position: 'relative',
                aspectRatio: '4/3',
                boxShadow: '0 0 30px rgba(102, 126, 234, 0.3)',
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  transform: 'scaleX(-1)',
                  objectFit: 'cover',
                }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Adaptive Hand Bounding Box - Follows Hand */}
              {handBoundingBox && (
                <>
                  {/* Square Box Around Hand */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${handBoundingBox.x}px`,
                      top: `${handBoundingBox.y}px`,
                      width: `${handBoundingBox.width}px`,
                      height: `${handBoundingBox.height}px`,
                      border: '3px solid #10b981',
                      boxShadow: '0 0 25px rgba(16, 185, 129, 0.8), inset 0 0 15px rgba(16, 185, 129, 0.3)',
                      borderRadius: '12px',
                      pointerEvents: 'none',
                      animation: 'boundingBoxPulse 0.6s ease-in-out infinite',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Label Inside Square */}
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.95)',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        textAlign: 'center',
                        boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)',
                        backdropFilter: 'blur(5px)',
                      }}
                    >
                      {currentSign !== 'Waiting...' ? currentSign : ''}
                    </div>
                  </div>

                  {/* Corner Markers for Better Visibility */}
                  {[0, 1, 2, 3].map((corner) => {
                    const positions = [
                      { x: handBoundingBox.x, y: handBoundingBox.y }, // top-left
                      { x: handBoundingBox.x + handBoundingBox.width, y: handBoundingBox.y }, // top-right
                      { x: handBoundingBox.x, y: handBoundingBox.y + handBoundingBox.height }, // bottom-left
                      { x: handBoundingBox.x + handBoundingBox.width, y: handBoundingBox.y + handBoundingBox.height }, // bottom-right
                    ];
                    const pos = positions[corner];
                    const offsetX = corner === 1 || corner === 3 ? -6 : 0;
                    const offsetY = corner === 2 || corner === 3 ? -6 : 0;

                    return (
                      <div
                        key={corner}
                        style={{
                          position: 'absolute',
                          left: `${pos.x + offsetX}px`,
                          top: `${pos.y + offsetY}px`,
                          width: '14px',
                          height: '14px',
                          background: '#10b981',
                          borderRadius: '3px',
                          boxShadow: '0 0 10px rgba(16, 185, 129, 0.9)',
                          zIndex: 11,
                        }}
                      />
                    );
                  })}
                </>
              )}

              {/* LIVE Indicator */}
              {isRunning && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(239, 68, 68, 0.9)',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      background: '#fff',
                      borderRadius: '50%',
                      animation: 'pulse 1s infinite',
                    }}
                  />
                  LIVE
                </div>
              )}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {!isRunning ? (
                <button
                  onClick={startCamera}
                  disabled={backendStatus === 'error'}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: backendStatus === 'error' ? '#64748b' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: backendStatus === 'error' ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  ▶ Start
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  ⏹ Stop
                </button>
              )}

              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  style={{
                    padding: '12px 20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  🔄 Clear
                </button>
              )}
            </div>

            {/* Detection Display */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                border: '1px solid #667eea',
                borderRadius: '12px',
                padding: '30px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                Current Detection
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
                {currentSign}
              </div>
              {currentConfidence && (
                <div style={{ fontSize: '0.95rem', color: '#10b981' }}>{currentConfidence}</div>
              )}
            </div>
          </div>

          {/* Right: History */}
          <div>
            {/* Transcript */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ color: '#667eea', fontSize: '1.05rem', marginBottom: '15px', fontWeight: '600' }}>
                📋 Transcript
              </h3>
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderLeft: '3px solid #667eea',
                  padding: '15px',
                  borderRadius: '8px',
                  minHeight: '80px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                }}
              >
                {history.length > 0 ? (
                  <span>{history.map((h) => h.sign).join(' ')}</span>
                ) : (
                  <span style={{ color: '#64748b', fontStyle: 'italic' }}>No detections yet</span>
                )}
              </div>
              {history.length > 0 && (
                <button
                  onClick={exportTranscript}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '10px',
                    background: '#667eea',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  📥 Export
                </button>
              )}
            </div>

            {/* History List */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3 style={{ color: '#667eea', fontSize: '1.05rem', marginBottom: '15px', fontWeight: '600' }}>
                🕐 History
              </h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {history.length > 0 ? (
                  history.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => copySign(item.sign)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderLeft: '3px solid #667eea',
                        padding: '12px',
                        marginBottom: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.sign}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.time}</div>
                      </div>
                      <span
                        style={{
                          background: '#667eea',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                        }}
                      >
                        {item.confidence}%
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', color: '#64748b', padding: '20px', fontStyle: 'italic' }}>
                    No detections yet
                  </div>
                )}
              </div>
              {history.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.85rem', color: '#94a3b8' }}>
                  Total: {history.length}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.9rem' }}>
          💡 Ang square ay sumusunod sa kamay mo - ang detected letter ay lalabas sa loob ng square
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes boundingBoxPulse {
          0% {
            box-shadow: 0 0 25px rgba(16, 185, 129, 0.8), inset 0 0 15px rgba(16, 185, 129, 0.3);
          }
          50% {
            box-shadow: 0 0 35px rgba(16, 185, 129, 1), inset 0 0 20px rgba(16, 185, 129, 0.4);
          }
          100% {
            box-shadow: 0 0 25px rgba(16, 185, 129, 0.8), inset 0 0 15px rgba(16, 185, 129, 0.3);
          }
        }
        
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}