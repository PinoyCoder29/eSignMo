"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Bird {
  x: number;
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  gap: number;
  passed: boolean;
}

interface SoundRef {
  play: () => void;
}

export default function FlappyBird() {
  const [bird, setBird] = useState<Bird>({ x: 100, y: 250, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const gameLoopRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const jumpSoundRef = useRef<SoundRef | null>(null);
  const hitSoundRef = useRef<SoundRef | null>(null);
  const scoreSoundRef = useRef<SoundRef | null>(null);

  const GRAVITY = 0.5;
  const JUMP_STRENGTH = -10;
  const BIRD_SIZE = 40;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 180;
  const PIPE_SPEED = 3;

  // Responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const maxWidth = Math.min(window.innerWidth - 20, 800);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
      setDimensions({ width: maxWidth, height: maxHeight });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Initialize sounds
  useEffect(() => {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;

    const createJumpSound = () => {
      if (!audioContextRef.current) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 400;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    };

    const createHitSound = () => {
      if (!audioContextRef.current) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 100;
      oscillator.type = "sawtooth";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    const createScoreSound = () => {
      if (!audioContextRef.current) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.15
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    };

    jumpSoundRef.current = { play: createJumpSound };
    hitSoundRef.current = { play: createHitSound };
    scoreSoundRef.current = { play: createScoreSound };
  }, []);

  useEffect(() => {
    const savedHighScore = window.__flappyBirdHighScore;
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      window.__flappyBirdHighScore = score.toString();
    }
  }, [score, highScore]);

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      jumpSoundRef.current?.play();
      return;
    }
    if (gameOver) return;

    jumpSoundRef.current?.play();
    setBird((prev) => ({ ...prev, velocity: JUMP_STRENGTH }));
  }, [gameStarted, gameOver]);

  const checkCollision = useCallback(
    (currentBird: Bird, currentPipes: Pipe[]): boolean => {
      if (currentBird.y < 0 || currentBird.y + BIRD_SIZE > dimensions.height) {
        return true;
      }

      for (const pipe of currentPipes) {
        if (
          currentBird.x + BIRD_SIZE > pipe.x &&
          currentBird.x < pipe.x + PIPE_WIDTH
        ) {
          if (
            currentBird.y < pipe.topHeight ||
            currentBird.y + BIRD_SIZE > pipe.topHeight + PIPE_GAP
          ) {
            return true;
          }
        }
      }

      return false;
    },
    [dimensions.height]
  );

  const resetGame = useCallback(() => {
    setBird({ x: 100, y: dimensions.height / 2 - 50, velocity: 0 });
    setPipes([]);
    setScore(0);
    setGameStarted(false);
    setGameOver(false);
  }, [dimensions.height]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      setBird((prev) => {
        const newVelocity = prev.velocity + GRAVITY;
        const newY = prev.y + newVelocity;
        return { ...prev, y: newY, velocity: newVelocity };
      });

      setPipes((prev) => {
        let newPipes = prev.map((pipe) => ({
          ...pipe,
          x: pipe.x - PIPE_SPEED,
        }));

        newPipes = newPipes.filter((pipe) => pipe.x + PIPE_WIDTH > 0);

        if (
          newPipes.length === 0 ||
          newPipes[newPipes.length - 1].x < dimensions.width - 300
        ) {
          const topHeight =
            Math.random() * (dimensions.height - PIPE_GAP - 100) + 50;
          newPipes.push({
            x: dimensions.width,
            topHeight,
            gap: PIPE_GAP,
            passed: false,
          });
        }

        newPipes.forEach((pipe) => {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 100) {
            pipe.passed = true;
            scoreSoundRef.current?.play();
            setScore((s) => s + 1);
          }
        });

        return newPipes;
      });

      setBird((currentBird) => {
        setPipes((currentPipes) => {
          if (checkCollision(currentBird, currentPipes)) {
            hitSoundRef.current?.play();
            setGameOver(true);
          }
          return currentPipes;
        });
        return currentBird;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, dimensions, checkCollision]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump]);

  // Touch event handler
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      jump();
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      return () => canvas.removeEventListener("touchstart", handleTouchStart);
    }
  }, [jump]);

  const scaleFactor = Math.min(dimensions.width / 800, dimensions.height / 600);
  const birdSizeScaled = BIRD_SIZE * scaleFactor;
  const pipeWidthScaled = PIPE_WIDTH * scaleFactor;

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark p-2">
      <div className="text-center w-100" style={{ maxWidth: "820px" }}>
        <div className="card bg-secondary shadow-lg">
          <div className="card-header bg-primary text-white py-2">
            <div className="row align-items-center g-2">
              <div className="col-4">
                <div className="d-flex align-items-center justify-content-start gap-1">
                  <span style={{ fontSize: "clamp(12px, 3vw, 20px)" }}>🏆</span>
                  <span
                    className="fw-bold"
                    style={{ fontSize: "clamp(10px, 2.5vw, 16px)" }}
                  >
                    High: {highScore}
                  </span>
                </div>
              </div>
              <div className="col-4">
                <h3
                  className="mb-0 fw-bold"
                  style={{ fontSize: "clamp(14px, 4vw, 24px)" }}
                >
                  🐦 Flappy Bird
                </h3>
              </div>
              <div className="col-4">
                <div className="d-flex align-items-center justify-content-end gap-1">
                  <span style={{ fontSize: "clamp(12px, 3vw, 20px)" }}>⭐</span>
                  <span
                    className="fw-bold"
                    style={{ fontSize: "clamp(10px, 2.5vw, 16px)" }}
                  >
                    Score: {score}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <div
              ref={canvasRef}
              onClick={jump}
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                position: "relative",
                background:
                  "linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)",
                cursor: "pointer",
                overflow: "hidden",
                touchAction: "none",
                margin: "0 auto",
              }}
            >
              {/* Clouds */}
              <div
                style={{
                  position: "absolute",
                  top: `${50 * scaleFactor}px`,
                  left: "10%",
                  fontSize: `${40 * scaleFactor}px`,
                  opacity: 0.7,
                }}
              >
                ☁️
              </div>
              <div
                style={{
                  position: "absolute",
                  top: `${120 * scaleFactor}px`,
                  right: "15%",
                  fontSize: `${50 * scaleFactor}px`,
                  opacity: 0.7,
                }}
              >
                ☁️
              </div>

              {/* Bird */}
              <div
                style={{
                  position: "absolute",
                  left: `${bird.x * scaleFactor}px`,
                  top: `${bird.y * scaleFactor}px`,
                  width: `${birdSizeScaled}px`,
                  height: `${birdSizeScaled}px`,
                  fontSize: `${40 * scaleFactor}px`,
                  transform: `rotate(${Math.min(Math.max(bird.velocity * 3, -30), 90)}deg)`,
                  transition: "transform 0.1s",
                }}
              >
                🐦
              </div>

              {/* Pipes */}
              {pipes.map((pipe, index) => (
                <div key={index}>
                  {/* Top Pipe */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${pipe.x * scaleFactor}px`,
                      top: 0,
                      width: `${pipeWidthScaled}px`,
                      height: `${pipe.topHeight * scaleFactor}px`,
                      background: "linear-gradient(to right, #2ecc71, #27ae60)",
                      borderRadius: "0 0 10px 10px",
                      borderWidth: "3px",
                      borderStyle: "solid",
                      borderColor: "#229954",
                      boxShadow: "inset 0 -5px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        bottom: `${-20 * scaleFactor}px`,
                        left: `${-5 * scaleFactor}px`,
                        width: `${pipeWidthScaled + 10 * scaleFactor}px`,
                        height: `${30 * scaleFactor}px`,
                        background:
                          "linear-gradient(to right, #27ae60, #229954)",
                        borderRadius: "5px",
                      }}
                    />
                  </div>

                  {/* Bottom Pipe */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${pipe.x * scaleFactor}px`,
                      top: `${(pipe.topHeight + PIPE_GAP) * scaleFactor}px`,
                      width: `${pipeWidthScaled}px`,
                      height: `${(dimensions.height / scaleFactor - pipe.topHeight - PIPE_GAP) * scaleFactor}px`,
                      background: "linear-gradient(to right, #2ecc71, #27ae60)",
                      borderRadius: "10px 10px 0 0",
                      borderWidth: "3px",
                      borderStyle: "solid",
                      borderColor: "#229954",
                      boxShadow: "inset 0 5px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: `${-20 * scaleFactor}px`,
                        left: `${-5 * scaleFactor}px`,
                        width: `${pipeWidthScaled + 10 * scaleFactor}px`,
                        height: `${30 * scaleFactor}px`,
                        background:
                          "linear-gradient(to right, #27ae60, #229954)",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Ground */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: `${50 * scaleFactor}px`,
                  background: "linear-gradient(to bottom, #8B4513, #654321)",
                  borderTopWidth: "3px",
                  borderTopStyle: "solid",
                  borderTopColor: "#A0522D",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${10 * scaleFactor}px`,
                    background:
                      "repeating-linear-gradient(90deg, #228B22, #228B22 20px, #32CD32 20px, #32CD32 40px)",
                  }}
                />
              </div>

              {/* Start Screen */}
              {!gameStarted && !gameOver && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    background: "rgba(0, 0, 0, 0.8)",
                    padding: `${30 * scaleFactor}px ${50 * scaleFactor}px`,
                    borderRadius: "20px",
                    color: "white",
                    maxWidth: "90%",
                  }}
                >
                  <h2
                    className="mb-3 fw-bold"
                    style={{ fontSize: "clamp(18px, 5vw, 32px)" }}
                  >
                    🐦 Flappy Bird
                  </h2>
                  <p
                    className="mb-3"
                    style={{ fontSize: "clamp(12px, 3vw, 20px)" }}
                  >
                    Tap o Press SPACE para Jump
                  </p>
                  <button
                    className="btn btn-warning btn-lg fw-bold"
                    onClick={jump}
                    style={{ fontSize: "clamp(14px, 3.5vw, 18px)" }}
                  >
                    🎮 Simulan ang Laro
                  </button>
                </div>
              )}

              {/* Game Over Screen */}
              {gameOver && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    background: "rgba(0, 0, 0, 0.9)",
                    padding: `${40 * scaleFactor}px ${60 * scaleFactor}px`,
                    borderRadius: "20px",
                    color: "white",
                    maxWidth: "90%",
                  }}
                >
                  <h2
                    className="mb-3 fw-bold text-danger"
                    style={{ fontSize: "clamp(18px, 5vw, 32px)" }}
                  >
                    💀 Game Over!
                  </h2>
                  <div className="mb-4">
                    <div
                      className="mb-2"
                      style={{ fontSize: "clamp(14px, 4vw, 24px)" }}
                    >
                      <span className="badge bg-warning text-dark">
                        Score: {score}
                      </span>
                    </div>
                    <div style={{ fontSize: "clamp(12px, 3.5vw, 20px)" }}>
                      <span className="badge bg-success">
                        Best: {highScore}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-success btn-lg fw-bold"
                    onClick={resetGame}
                    style={{ fontSize: "clamp(14px, 3.5vw, 18px)" }}
                  >
                    🔄 Maglaro Ulit
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="card-footer bg-dark text-white py-2">
            <div className="row text-center g-1">
              <div className="col-6">
                <small style={{ fontSize: "clamp(8px, 2vw, 12px)" }}>
                  🖱️ Click o 👆 Tap para jump
                </small>
              </div>
              <div className="col-6">
                <small style={{ fontSize: "clamp(8px, 2vw, 12px)" }}>
                  Iwasan ang pipes! 🚀
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 text-white">
          <small
            className="text-muted"
            style={{ fontSize: "clamp(8px, 2vw, 12px)" }}
          >
            Made with TypeScript, React & Bootstrap
          </small>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css");

        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          overflow: hidden;
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }

        .card {
          border: none;
          border-radius: 15px;
          overflow: hidden;
        }

        .btn {
          transition: transform 0.2s;
        }

        .btn:hover {
          transform: scale(1.05);
        }

        .btn:active {
          transform: scale(0.95);
        }

        @media (max-width: 768px) {
          .card-header {
            padding: 0.5rem !important;
          }

          .card-footer {
            padding: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

declare global {
  interface Window {
    __flappyBirdHighScore?: string;
  }
}
