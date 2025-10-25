"use client";
import Image from "next/image";
import image from "../../../public/image/background1.png";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ background: "#0f1117", minHeight: "100vh" }}>
      {/* Hero Section - Compact Version */}
      <section
        className="position-relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a1f35 0%, #2d3561 50%, #1a1f35 100%)",
          paddingTop: "2.5rem",
          paddingBottom: "2.5rem",
        }}
      >
        {/* Animated Background Elements */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "250px",
            height: "250px",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            width: "250px",
            height: "250px",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(80px)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            {/* TEXT AREA */}
            <div className="col-lg-7 col-md-6 mb-3 mb-md-0">
              {/* Badge */}
              <div
                className="mb-2"
                style={{ animation: "slideInLeft 0.6s ease-out" }}
              >
                <span
                  style={{
                    background: "rgba(139, 92, 246, 0.2)",
                    color: "#c4b5fd",
                    padding: "0.4rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    border: "2px solid rgba(139, 92, 246, 0.3)",
                    letterSpacing: "0.5px",
                    display: "inline-block",
                  }}
                >
                  🌟 Welcome to eSIGN Mo
                </span>
              </div>

              {/* Main Heading */}
              <h1
                className="fw-bold mb-2"
                style={{
                  fontSize: "clamp(1.75rem, 4.5vw, 2.8rem)",
                  lineHeight: "1.2",
                  color: "white",
                  textShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
                  animation: "slideInLeft 0.6s ease-out 0.1s backwards",
                }}
              >
                A Place Where{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Everyone Understands
                </span>
              </h1>

              {/* Description */}
              <p
                className="mb-3"
                style={{
                  fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: "1.5",
                  maxWidth: "550px",
                  animation: "slideInLeft 0.6s ease-out 0.2s backwards",
                }}
              >
                Master ASL and FSL through interactive games, practice with
                challenging tests, or use real-time speech-to-sign translation
              </p>

              {/* Feature Tags */}
              <div
                className="d-flex flex-wrap gap-2 mb-3"
                style={{
                  animation: "slideInLeft 0.6s ease-out 0.3s backwards",
                }}
              >
                <span
                  style={{
                    background: "rgba(124, 58, 237, 0.15)",
                    color: "#c4b5fd",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                  }}
                >
                  ✋ Sign
                </span>
                <span
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    color: "#93c5fd",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  }}
                >
                  🎙️Speech
                </span>
                <span
                  style={{
                    background: "rgba(236, 72, 153, 0.15)",
                    color: "#f9a8d4",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    border: "1px solid rgba(236, 72, 153, 0.3)",
                  }}
                >
                  🧠 Test
                </span>
                <span
                  style={{
                    background: "rgba(34, 197, 94, 0.15)",
                    color: "#86efac",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                  }}
                >
                  📘 Learn
                </span>
              </div>

              {/* CTA Buttons */}
              <div
                className="d-flex flex-wrap gap-2 mb-3"
                style={{
                  animation: "slideInLeft 0.6s ease-out 0.4s backwards",
                }}
              >
                <a
                  href="/asl"
                  className="btn cta-primary"
                  style={{
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
                    color: "white",
                    border: "none",
                    padding: "0.7rem 2rem",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    borderRadius: "10px",
                    boxShadow: "0 6px 20px rgba(139, 92, 246, 0.4)",
                    transition: "all 0.3s ease",
                    letterSpacing: "0.3px",
                  }}
                >
                  🚀 Start Learning
                </a>
                {/* <button
                  className="btn cta-secondary"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "white",
                    border: "2px solid rgba(139, 92, 246, 0.3)",
                    padding: "0.7rem 2rem",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    borderRadius: "10px",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    letterSpacing: "0.3px",
                  }}
                >
                  📖 View Demo
                </button> */}
              </div>

              {/* Stats */}
              {/* <div
                className="d-flex flex-wrap gap-3"
                style={{
                  animation: "slideInLeft 0.6s ease-out 0.5s backwards",
                }}
              >
                <div>
                  <div
                    className="fw-bold mb-1"
                    style={{
                      fontSize: "1.5rem",
                      background:
                        "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    1000+
                  </div>
                  <div
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.8rem",
                    }}
                  >
                    Active Learners
                  </div>
                </div>
                <div>
                  <div
                    className="fw-bold mb-1"
                    style={{
                      fontSize: "1.5rem",
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    500+
                  </div>
                  <div
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.8rem",
                    }}
                  >
                    Sign Words
                  </div>
                </div>
                <div>
                  <div
                    className="fw-bold mb-1"
                    style={{
                      fontSize: "1.5rem",
                      background:
                        "linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    95%
                  </div>
                  <div
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.8rem",
                    }}
                  >
                    Success Rate
                  </div>
                </div>
              </div> */}
            </div>

            {/* IMAGE AREA */}
            <div className="col-lg-5 col-md-6 text-center position-relative">
              {/* Glowing circle behind image */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "320px",
                  height: "320px",
                  background:
                    "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
                  borderRadius: "50%",
                  filter: "blur(60px)",
                  animation: "pulse 3s ease-in-out infinite",
                }}
              />

              {/* Decorative rings */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "360px",
                  height: "360px",
                  border: "2px solid rgba(139, 92, 246, 0.2)",
                  borderRadius: "50%",
                  animation: "rotate 20s linear infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "400px",
                  height: "400px",
                  border: "2px solid rgba(236, 72, 153, 0.15)",
                  borderRadius: "50%",
                  animation: "rotate 30s linear infinite reverse",
                }}
              />

              <div
                className="position-relative"
                style={{
                  animation: "fadeInScale 0.8s ease-out 0.3s backwards",
                  zIndex: 2,
                }}
              >
                <Image
                  src={image}
                  alt="Sign Language"
                  width={380}
                  className="img-fluid"
                  style={{
                    filter: "drop-shadow(0 15px 30px rgba(139, 92, 246, 0.3))",
                    animation: "float 6s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Smaller */}
        <div
          className="position-absolute bottom-0 start-50 translate-middle-x pb-3 d-none d-md-block"
          style={{
            animation: "bounce 2s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "40px",
              border: "2px solid rgba(139, 92, 246, 0.5)",
              borderRadius: "15px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "8px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                borderRadius: "2px",
                position: "absolute",
                top: "6px",
                left: "50%",
                transform: "translateX(-50%)",
                animation: "scrollDot 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section Preview */}
      <section className="py-4" style={{ background: "#0f1117" }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2
              className="fw-bold mb-2"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: "white",
              }}
            >
              Why Choose{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                eSIGN Mo?
              </span>
            </h2>
            <p
              style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.95rem" }}
            >
              The most comprehensive sign language learning platform
            </p>
          </div>

          <div className="row g-3">
            {/* Feature Card 1 */}
            <div className="col-lg-4 col-md-6">
              <div
                className="feature-card"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
                  border: "2px solid rgba(124, 58, 237, 0.2)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  height: "100%",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    boxShadow: "0 6px 16px rgba(139, 92, 246, 0.3)",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>🎮</span>
                </div>
                <h5
                  className="fw-bold mb-2"
                  style={{ color: "white", fontSize: "1.1rem" }}
                >
                  Gamified Learning
                </h5>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: "1.6",
                    fontSize: "0.9rem",
                    marginBottom: 0,
                  }}
                >
                  Learn through fun, interactive games and challenges that keep
                  you engaged and motivated
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="col-lg-4 col-md-6">
              <div
                className="feature-card"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)",
                  border: "2px solid rgba(59, 130, 246, 0.2)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  height: "100%",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    boxShadow: "0 6px 16px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>⚡</span>
                </div>
                <h5
                  className="fw-bold mb-2"
                  style={{ color: "white", fontSize: "1.1rem" }}
                >
                  Real-Time Translation
                </h5>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: "1.6",
                    fontSize: "0.9rem",
                    marginBottom: 0,
                  }}
                >
                  Instant speech-to-sign and sign-to-text conversion powered by
                  advanced AI technology
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="col-lg-4 col-md-6">
              <div
                className="feature-card"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)",
                  border: "2px solid rgba(236, 72, 153, 0.2)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  height: "100%",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background:
                      "linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    boxShadow: "0 6px 16px rgba(236, 72, 153, 0.3)",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>📊</span>
                </div>
                <h5
                  className="fw-bold mb-2"
                  style={{ color: "white", fontSize: "1.1rem" }}
                >
                  Track Progress
                </h5>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: "1.6",
                    fontSize: "0.9rem",
                    marginBottom: 0,
                  }}
                >
                  Monitor your learning journey with detailed analytics and
                  personalized feedback
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(139, 92, 246, 0.6) !important;
        }

        .cta-secondary:hover {
          background: rgba(139, 92, 246, 0.2) !important;
          border-color: rgba(139, 92, 246, 0.5) !important;
          transform: translateY(-2px);
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(139, 92, 246, 0.3);
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes rotate {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, -8px);
          }
        }

        @keyframes scrollDot {
          0%,
          100% {
            top: 6px;
            opacity: 1;
          }
          50% {
            top: 20px;
            opacity: 0.5;
          }
        }

        @media (max-width: 768px) {
          .cta-primary,
          .cta-secondary {
            padding: 0.6rem 1.5rem !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
}
