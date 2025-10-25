"use client";

import { useRef, useState, useEffect } from "react";

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
  const [isPaused, setIsPaused] = useState(false);
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");

  const [currentSign, setCurrentSign] = useState<string>("Waiting...");
  const [currentConfidence, setCurrentConfidence] = useState<string>("");
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
  const [videoWidth, setVideoWidth] = useState(640);
  const [videoHeight, setVideoHeight] = useState(480);
  const [isMobile, setIsMobile] = useState(false);
  const frameCountRef = useRef(0);
  const fpsTimeRef = useRef(Date.now());
  const processingRef = useRef(false);
  const lastAddedSignRef = useRef<string>("");
  const lastTranscriptTimeRef = useRef<number>(0);

  // Check backend connection and responsive
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 5000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const checkBackendConnection = async () => {
    try {
      const res = await fetch("http://localhost:8000/health");
      if (res.ok) {
        setBackendStatus("connected");
      } else {
        setBackendStatus("error");
      }
    } catch (_err) {
      setBackendStatus("error");
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            setVideoWidth(videoRef.current.videoWidth);
            setVideoHeight(videoRef.current.videoHeight);
          }
        };

        setIsRunning(true);
        setIsPaused(false);
        lastAddedSignRef.current = "";
        lastTranscriptTimeRef.current = 0;
        startDetection();
      }
    } catch (err) {
      alert("Cannot access camera: " + err);
    }
  };

  const pauseDetection = () => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    setIsPaused(true);
  };

  const resumeDetection = () => {
    setIsPaused(false);
    startDetection();
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
    setIsPaused(false);
    setCurrentSign("Camera stopped");
    setCurrentConfidence("");
    setHandBoundingBox(null);
    setHandDetected(false);
    lastAddedSignRef.current = "";
    lastTranscriptTimeRef.current = 0;
  };

  const captureAndSendFrame = async () => {
    if (!videoRef.current || !canvasRef.current || processingRef.current)
      return;

    processingRef.current = true;
    frameCountRef.current++;

    const ctx = canvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });
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
        canvasRef.current!.toBlob(
          (blob) => {
            resolve(blob as Blob);
          },
          "image/jpeg",
          0.85
        );
      });

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      const endTime = performance.now();
      setInferenceTime(Math.round(endTime - startTime));

      if (!res.ok) throw new Error("Prediction failed");

      const data = await res.json();

      const now = Date.now();
      if (now - fpsTimeRef.current > 500) {
        setFps(
          Math.round(
            (frameCountRef.current * 1000) / (now - fpsTimeRef.current)
          )
        );
        frameCountRef.current = 0;
        fpsTimeRef.current = now;
      }

      if (data.hand_detected && data.bounding_box) {
        const { x_min, y_min, x_max, y_max } = data.bounding_box;

        const videoElement = videoRef.current;
        if (!videoElement) {
          processingRef.current = false;
          return;
        }

        const displayWidth = videoElement.clientWidth;
        const displayHeight = videoElement.clientHeight;
        const actualWidth = videoElement.videoWidth;
        const actualHeight = videoElement.videoHeight;

        const scaleX = displayWidth / actualWidth;
        const scaleY = displayHeight / actualHeight;

        const scaledWidth = (x_max - x_min) * scaleX;
        const scaledHeight = (y_max - y_min) * scaleY;

        const mirroredX = (actualWidth - x_max) * scaleX;
        const scaledY = y_min * scaleY;

        setHandBoundingBox({
          x: mirroredX,
          y: scaledY,
          width: scaledWidth,
          height: scaledHeight,
        });
        setHandDetected(true);

        if (data.real_time_prediction) {
          const timestamp = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });

          const confidence = Math.round(data.real_time_confidence * 100);

          setCurrentSign(data.real_time_prediction);
          setCurrentConfidence(`${confidence}% • ${timestamp}`);
        }

        if (data.should_add_to_transcript && data.stable_prediction) {
          const currentTime = Date.now();
          const timeSinceLastTranscript =
            currentTime - lastTranscriptTimeRef.current;

          if (timeSinceLastTranscript >= 1500) {
            if (data.stable_prediction !== lastAddedSignRef.current) {
              const timestamp = new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              });

              const confidence = Math.round(data.stable_confidence * 100);

              // ADD TO END - bagong letters sa dulo ng array
              setHistory((prev) => [
                ...prev.slice(0, 49),
                {
                  sign: data.stable_prediction,
                  confidence,
                  time: timestamp,
                },
              ]);

              lastAddedSignRef.current = data.stable_prediction;
              lastTranscriptTimeRef.current = currentTime;

              setTimeout(() => {
                lastAddedSignRef.current = "";
              }, 3000);
            }
          }
        }
      } else {
        setHandBoundingBox(null);
        setHandDetected(false);
        setCurrentSign("Waiting...");
        setCurrentConfidence("");
        lastAddedSignRef.current = "";
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      setHandBoundingBox(null);
      setHandDetected(false);
    } finally {
      processingRef.current = false;
    }
  };

  const startDetection = () => {
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    frameIntervalRef.current = setInterval(captureAndSendFrame, 50);
  };

  const clearHistory = async () => {
    setHistory([]);
    setCurrentSign("Waiting...");
    setCurrentConfidence("");
    lastAddedSignRef.current = "";
    lastTranscriptTimeRef.current = 0;

    try {
      await fetch("http://localhost:8000/reset_buffer", {
        method: "POST",
      });
    } catch (err) {
      console.error("Failed to reset buffer:", err);
    }
  };

  const exportTranscript = () => {
    const transcript = history.map((h) => h.sign).join(" ");
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(transcript)}`
    );
    element.setAttribute(
      "download",
      `sign_transcript_${new Date().toISOString().split("T")[0]}.txt`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copySign = (sign: string) => {
    navigator.clipboard.writeText(sign);
  };

  const statusColor =
    backendStatus === "connected"
      ? "#10b981"
      : backendStatus === "error"
        ? "#ef4444"
        : "#f59e0b";

  const statusText =
    backendStatus === "connected"
      ? "Backend Connected"
      : backendStatus === "error"
        ? "Backend Offline"
        : "Checking...";

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        minHeight: "100vh",
        color: "#fff",
        padding: isMobile ? "15px" : "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "25px" : "40px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "1.8rem" : "2.5rem",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            🤟 Fast Sign Recognition
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: isMobile ? "0.9rem" : "1.1rem",
            }}
          >
            Real-time ASL Detection with INSTANT Hand Tracking
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? "15px" : "0",
            marginBottom: isMobile ? "20px" : "30px",
            padding: isMobile ? "15px" : "15px 20px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: statusColor,
                animation: "pulse 2s infinite",
              }}
            />
            <span style={{ fontSize: "0.95rem", color: "#cbd5e1" }}>
              {statusText}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: isMobile ? "15px" : "20px",
              fontSize: "0.9rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span style={{ color: "#94a3b8" }}>FPS:</span>{" "}
              <span style={{ color: "#10b981", fontWeight: "bold" }}>
                {fps}
              </span>
            </div>
            <div>
              <span style={{ color: "#94a3b8" }}>Latency:</span>{" "}
              <span style={{ color: "#10b981", fontWeight: "bold" }}>
                {inferenceTime}ms
              </span>
            </div>
            {handDetected && (
              <div>
                <span style={{ color: "#94a3b8" }}>Hand:</span>{" "}
                <span style={{ color: "#10b981", fontWeight: "bold" }}>
                  ✓ Tracking
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "25px",
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                background: "#000",
                border: "2px solid #667eea",
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "20px",
                position: "relative",
                aspectRatio: "4/3",
                boxShadow: "0 0 30px rgba(102, 126, 234, 0.3)",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  transform: "scaleX(-1)",
                  objectFit: "cover",
                }}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />

              {handBoundingBox && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      left: `${handBoundingBox.x}px`,
                      top: `${handBoundingBox.y}px`,
                      width: `${handBoundingBox.width}px`,
                      height: `${handBoundingBox.height}px`,
                      border: "4px solid #10b981",
                      boxShadow:
                        "0 0 30px rgba(16, 185, 129, 0.9), inset 0 0 20px rgba(16, 185, 129, 0.4)",
                      borderRadius: "16px",
                      pointerEvents: "none",
                      animation: "smoothPulse 1.5s ease-in-out infinite",
                      transition: "all 0.05s linear",
                    }}
                  >
                    {currentSign !== "Waiting..." &&
                      currentSign !== "Uncertain" && (
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "rgba(16, 185, 129, 0.95)",
                            color: "#fff",
                            padding: isMobile ? "10px 16px" : "12px 20px",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            fontSize: isMobile ? "1.1rem" : "1.4rem",
                            textAlign: "center",
                            boxShadow: "0 4px 20px rgba(16, 185, 129, 0.8)",
                            backdropFilter: "blur(8px)",
                            border: "2px solid rgba(255, 255, 255, 0.3)",
                            animation: "fadeInScale 0.3s ease-out",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {currentSign}
                        </div>
                      )}
                  </div>

                  {[0, 1, 2, 3].map((corner) => {
                    const positions = [
                      { x: handBoundingBox.x - 8, y: handBoundingBox.y - 8 },
                      {
                        x: handBoundingBox.x + handBoundingBox.width - 8,
                        y: handBoundingBox.y - 8,
                      },
                      {
                        x: handBoundingBox.x - 8,
                        y: handBoundingBox.y + handBoundingBox.height - 8,
                      },
                      {
                        x: handBoundingBox.x + handBoundingBox.width - 8,
                        y: handBoundingBox.y + handBoundingBox.height - 8,
                      },
                    ];
                    const pos = positions[corner];

                    return (
                      <div
                        key={corner}
                        style={{
                          position: "absolute",
                          left: `${pos.x}px`,
                          top: `${pos.y}px`,
                          width: "16px",
                          height: "16px",
                          background: "#10b981",
                          borderRadius: "4px",
                          boxShadow: "0 0 15px rgba(16, 185, 129, 1)",
                          zIndex: 11,
                          transition: "all 0.05s linear",
                        }}
                      />
                    );
                  })}
                </>
              )}

              {isRunning && !isPaused && (
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "rgba(239, 68, 68, 0.9)",
                    padding: "6px 12px",
                    borderRadius: "16px",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "#fff",
                      borderRadius: "50%",
                      animation: "pulse 1s infinite",
                    }}
                  />
                  LIVE
                </div>
              )}

              {isPaused && (
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "rgba(245, 158, 11, 0.9)",
                    padding: "6px 12px",
                    borderRadius: "16px",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                  }}
                >
                  ⏸ PAUSED
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                flexWrap: isMobile ? "wrap" : "nowrap",
              }}
            >
              {!isRunning ? (
                <button
                  onClick={startCamera}
                  disabled={backendStatus === "error"}
                  style={{
                    flex: 1,
                    minWidth: isMobile ? "100%" : "auto",
                    padding: "12px 20px",
                    background:
                      backendStatus === "error"
                        ? "#64748b"
                        : "linear-gradient(135deg, #10b981, #059669)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor:
                      backendStatus === "error" ? "not-allowed" : "pointer",
                    fontSize: "1rem",
                  }}
                >
                  ▶ Start Detection
                </button>
              ) : (
                <>
                  {!isPaused ? (
                    <button
                      onClick={pauseDetection}
                      style={{
                        flex: 1,
                        minWidth: isMobile ? "calc(50% - 5px)" : "auto",
                        padding: "12px 20px",
                        background: "linear-gradient(135deg, #f59e0b, #d97706)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                    >
                      ⏸ Pause
                    </button>
                  ) : (
                    <button
                      onClick={resumeDetection}
                      style={{
                        flex: 1,
                        minWidth: isMobile ? "calc(50% - 5px)" : "auto",
                        padding: "12px 20px",
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                    >
                      ▶ Resume
                    </button>
                  )}
                  <button
                    onClick={stopCamera}
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "calc(50% - 5px)" : "auto",
                      padding: "12px 20px",
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    ⏹ Stop
                  </button>
                </>
              )}
            </div>

            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
                border: "1px solid #667eea",
                borderRadius: "12px",
                padding: isMobile ? "20px" : "30px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "10px",
                }}
              >
                Real-time Detection
              </div>
              <div
                style={{
                  fontSize: isMobile ? "2rem" : "3rem",
                  fontWeight: "bold",
                  color: currentSign === "Uncertain" ? "#f59e0b" : "#667eea",
                  marginBottom: "10px",
                  transition: "color 0.3s ease",
                }}
              >
                {currentSign}
              </div>
              {currentConfidence && (
                <div style={{ fontSize: "0.95rem", color: "#10b981" }}>
                  {currentConfidence}
                </div>
              )}
              {handDetected && currentSign === "Uncertain" && (
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#f59e0b",
                    marginTop: "8px",
                  }}
                >
                  Hold steady for better detection...
                </div>
              )}
            </div>
          </div>

          <div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                style={{
                  width: "100%",
                  marginBottom: "15px",
                  padding: "12px 20px",
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                🗑️ Clear All History
              </button>
            )}

            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  color: "#667eea",
                  fontSize: "1.05rem",
                  marginBottom: "15px",
                  fontWeight: "600",
                }}
              >
                📋 Stable Transcript (1.5s Delay)
              </h3>
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  borderLeft: "3px solid #667eea",
                  padding: "15px",
                  borderRadius: "8px",
                  minHeight: "80px",
                  maxHeight: "120px",
                  overflowY: "auto",
                  fontFamily: "monospace",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                }}
              >
                {history.length > 0 ? (
                  <span>{history.map((h) => h.sign).join(" ")}</span>
                ) : (
                  <span style={{ color: "#64748b", fontStyle: "italic" }}>
                    Signs will appear here after stable detection
                  </span>
                )}
              </div>
              {history.length > 0 && (
                <button
                  onClick={exportTranscript}
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    padding: "10px",
                    background: "#667eea",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                  }}
                >
                  📥 Export Transcript
                </button>
              )}
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  color: "#667eea",
                  fontSize: "1.05rem",
                  marginBottom: "15px",
                  fontWeight: "600",
                }}
              >
                🕐 Detection History
              </h3>
              <div
                style={{
                  maxHeight: isMobile ? "300px" : "400px",
                  overflowY: "auto",
                }}
              >
                {history.length > 0 ? (
                  history.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => copySign(item.sign)}
                      style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        borderLeft: "3px solid #667eea",
                        padding: "12px",
                        marginBottom: "8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255, 255, 255, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255, 255, 255, 0.08)";
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                          {item.sign}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                          {item.time}
                        </div>
                      </div>
                      <span
                        style={{
                          background: "#667eea",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}
                      >
                        {item.confidence}%
                      </span>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#64748b",
                      padding: "20px",
                      fontStyle: "italic",
                    }}
                  >
                    No stable detections yet
                  </div>
                )}
              </div>
              {history.length > 0 && (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "15px",
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                  }}
                >
                  Total Signs: {history.length}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            paddingTop: "30px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Built with React • Real-time ASL Recognition
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes smoothPulse {
          0% {
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.9), inset 0 0 20px rgba(16, 185, 129, 0.4);
          }
          50% {
            box-shadow: 0 0 45px rgba(16, 185, 129, 1), inset 0 0 30px rgba(16, 185, 129, 0.5);
          }
          100% {
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.9), inset 0 0 20px rgba(16, 185, 129, 0.4);
          }
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        * { 
          box-sizing: border-box; 
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.7);
        }
      `}</style>
    </div>
  );
}
