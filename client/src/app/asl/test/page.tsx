"use client";
import Link from "next/link";

export default function Test() {
  return (
    <div className="min-vh-100" style={{ background: "#0f1117" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1f35 0%, #2d3561 100%)",
          padding: "1.4rem 0 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Elements */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "250px",
            height: "250px",
            background: "rgba(139, 92, 246, 0.2)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "200px",
            height: "200px",
            background: "rgba(59, 130, 246, 0.2)",
            borderRadius: "50%",
            filter: "blur(70px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "300px",
            height: "300px",
            background: "rgba(236, 72, 153, 0.15)",
            borderRadius: "50%",
            filter: "blur(90px)",
          }}
        />

        <div
          className="container"
          style={{ maxWidth: "1140px", position: "relative" }}
        >
          <div
            className="row align-items-center"
            style={{ marginBottom: "-25px" }}
          >
            <div className="col-lg-8">
              <div className="mb-2">
                <span
                  className="badge"
                  style={{
                    background: "rgba(139, 92, 246, 0.25)",
                    color: "#c4b5fd",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "25px",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    border: "1px solid rgba(139, 92, 246, 0.5)",
                    letterSpacing: "0.5px",
                  }}
                >
                  🎮 LEVEL UP YOUR SKILLS
                </span>
              </div>
              <h1
                className=" fw-bold text-white mb-2  "
                style={{
                  letterSpacing: "-1px",
                  lineHeight: "0.8",
                  textShadow: "0 2px 20px rgba(139, 92, 246, 0.3)",
                }}
              >
                ASL Test Arena
              </h1>
              <p
                className="fs-5  mb-0"
                style={{
                  maxWidth: "600px",
                  color: "rgba(255, 255, 255, 0.85)",
                  lineHeight: "1.5",
                }}
              >
                Choose your challenge and master American Sign Language through
                fun, interactive games!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-4">
        <div className="container" style={{ maxWidth: "1140px" }}>
          {/* Core Challenges */}
          <div className="mb-5">
            <div className="d-flex align-items-center mb-4">
              <div
                style={{
                  width: "5px",
                  height: "32px",
                  background:
                    "linear-gradient(180deg, #8b5cf6 0%, #ec4899 100%)",
                  borderRadius: "3px",
                  marginRight: "15px",
                }}
              />
              <h2 className="h4 fw-bold text-white mb-0">
                Choose Your Game Mode
              </h2>
            </div>
            <div className="row g-4">
              {/* ABC Challenge - Purple/Violet */}
              <div className="col-lg-6">
                <div
                  className="card border-0 h-100 game-card"
                  style={{
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #14e722ff 0%, #a855f7 100%)",
                    boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      right: "-40px",
                      width: "150px",
                      height: "150px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    className="card-body p-4"
                    style={{ position: "relative" }}
                  >
                    <div className="d-flex align-items-start">
                      <div
                        className="me-3"
                        style={{
                          width: "64px",
                          height: "64px",
                          background: "rgba(255, 255, 255, 0.25)",
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 7V4h16v3" />
                          <path d="M9 20h6" />
                          <path d="M12 4v16" />
                        </svg>
                      </div>
                      <div className="flex-grow-1">
                        <span
                          style={{
                            display: "inline-block",
                            background: "rgba(255, 255, 255, 0.95)",
                            color: "#10B981",
                            padding: "0.4rem 1rem",
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            letterSpacing: "0.5px",
                            marginBottom: "0.75rem",
                          }}
                        >
                          EASY
                        </span>

                        <h5
                          className="fw-bold mb-2 text-white"
                          style={{ fontSize: "1.25rem" }}
                        >
                          ABC Challenge
                        </h5>
                        <p
                          className="mb-3"
                          style={{
                            fontSize: "0.95rem",
                            lineHeight: "1.6",
                            color: "rgba(255, 255, 255, 0.9)",
                          }}
                        >
                          Master the ASL alphabet and level up your
                          fingerspelling skills
                        </p>
                        <Link
                          href="/asl/test/letterChallenge"
                          className="btn btn-sm game-btn"
                          style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            color: "#7c3aed",
                            border: "none",
                            padding: "0.7rem 1.8rem",
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            borderRadius: "10px",
                            letterSpacing: "0.3px",
                          }}
                        >
                          START GAME →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Word Power - Blue */}
              <div className="col-lg-6">
                <div
                  className="card border-0 h-100 game-card"
                  style={{
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #f47a00ff 0%, #3b82f6 100%)",
                    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      right: "-40px",
                      width: "150px",
                      height: "150px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    className="card-body p-4"
                    style={{ position: "relative" }}
                  >
                    <div className="d-flex align-items-start">
                      <div
                        className="me-3"
                        style={{
                          width: "64px",
                          height: "64px",
                          background: "rgba(255, 255, 255, 0.25)",
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                      </div>
                      <div className="flex-grow-1">
                        <span
                          style={{
                            display: "inline-block",
                            background: "rgba(255, 255, 255, 0.95)",
                            color: "#d68717ff",
                            padding: "0.4rem 1rem",
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            letterSpacing: "0.5px",
                            marginBottom: "0.75rem",
                          }}
                        >
                          MEDIUM
                        </span>
                        <h5
                          className="fw-bold mb-2 text-white"
                          style={{ fontSize: "1.25rem" }}
                        >
                          Word Power
                        </h5>
                        <p
                          className="mb-3"
                          style={{
                            fontSize: "0.95rem",
                            lineHeight: "1.6",
                            color: "rgba(255, 255, 255, 0.9)",
                          }}
                        >
                          Expand your vocabulary with everyday ASL words and
                          signs
                        </p>
                        <Link
                          href="/asl/test/wordChallenge"
                          className="btn btn-sm game-btn"
                          style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            color: "#2563eb",
                            border: "none",
                            padding: "0.7rem 1.8rem",
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            borderRadius: "10px",
                            letterSpacing: "0.3px",
                          }}
                        >
                          START GAME →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Numbers Game - Orange */}
              <div className="col-lg-6">
                <div
                  className="card border-0 h-100 game-card"
                  style={{
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #ff0a0aff 0%, #a48282ff 100%)",
                    boxShadow: "0 8px 24px rgba(234, 88, 12, 0.4)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      right: "-40px",
                      width: "150px",
                      height: "150px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    className="card-body p-4"
                    style={{ position: "relative" }}
                  >
                    <div className="d-flex align-items-start">
                      <div
                        className="me-3"
                        style={{
                          width: "64px",
                          height: "64px",
                          background: "rgba(255, 255, 255, 0.25)",
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="4" y1="9" x2="20" y2="9" />
                          <line x1="4" y1="15" x2="20" y2="15" />
                          <line x1="10" y1="3" x2="8" y2="21" />
                          <line x1="16" y1="3" x2="14" y2="21" />
                        </svg>
                      </div>
                      <div className="flex-grow-1">
                        <span
                          style={{
                            display: "inline-block",
                            background: "rgba(255, 255, 255, 0.95)",
                            color: "#cc1111ff",
                            padding: "0.4rem 1rem",
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            letterSpacing: "0.5px",
                            marginBottom: "0.75rem",
                          }}
                        >
                          HARD
                        </span>
                        <h5
                          className="fw-bold mb-2 text-white"
                          style={{ fontSize: "1.25rem" }}
                        >
                          Phrases Game
                        </h5>
                        <p
                          className="mb-3"
                          style={{
                            fontSize: "0.95rem",
                            lineHeight: "1.6",
                            color: "rgba(255, 255, 255, 0.9)",
                          }}
                        >
                          Count your way to success from 0 to 100 in ASL
                        </p>
                        <Link
                          href="/asl/test/phrasesChallenge"
                          className="btn btn-sm game-btn"
                          style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            color: "#ea580c",
                            border: "none",
                            padding: "0.7rem 1.8rem",
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            borderRadius: "10px",
                            letterSpacing: "0.3px",
                          }}
                        >
                          START GAME →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Talk Time - Pink */}
              <div className="col-lg-6">
                <div
                  className="card border-0 h-100 game-card"
                  style={{
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #0012b3ff 0%, #ec4899 100%)",
                    boxShadow: "0 8px 24px rgba(219, 39, 119, 0.4)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      right: "-40px",
                      width: "150px",
                      height: "150px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    className="card-body p-4"
                    style={{ position: "relative" }}
                  >
                    <div className="d-flex align-items-start">
                      <div
                        className="me-3"
                        style={{
                          width: "64px",
                          height: "64px",
                          background: "rgba(255, 255, 255, 0.25)",
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <div className="flex-grow-1">
                        <span
                          style={{
                            display: "inline-block",
                            background: "rgba(255, 255, 255, 0.95)",
                            color: "#0f0ab3ff",
                            padding: "0.4rem 1rem",
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            letterSpacing: "0.5px",
                            marginBottom: "0.75rem",
                          }}
                        >
                          BONUS
                        </span>
                        <h5
                          className="fw-bold mb-2 text-white"
                          style={{ fontSize: "1.25rem" }}
                        >
                          Numbers Game
                        </h5>
                        <p
                          className="mb-3"
                          style={{
                            fontSize: "0.95rem",
                            lineHeight: "1.6",
                            color: "rgba(255, 255, 255, 0.9)",
                          }}
                        >
                          Practice common phrases and start real conversations
                        </p>
                        <Link
                          href="/quiz/phrases"
                          className="btn btn-sm game-btn"
                          style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            color: "#db2777",
                            border: "none",
                            padding: "0.7rem 1.8rem",
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            borderRadius: "10px",
                            letterSpacing: "0.3px",
                          }}
                        >
                          START GAME →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Challenges */}
          <div>
            <div className="d-flex align-items-center mb-4">
              <div
                style={{
                  width: "5px",
                  height: "32px",
                  background:
                    "linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)",
                  borderRadius: "3px",
                  marginRight: "15px",
                }}
              />
              <h2 className="h4 fw-bold text-white mb-0">Boss Battles</h2>
            </div>
            <div className="row g-4">
              {/* Master Challenge - Gold */}
              <div className="col-lg-6">
                <div
                  className="card h-100 boss-card"
                  style={{
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                    border: "none",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 12px 32px rgba(245, 158, 11, 0.5)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-50px",
                      right: "-50px",
                      width: "180px",
                      height: "180px",
                      background: "rgba(255, 255, 255, 0.15)",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-60px",
                      left: "-60px",
                      width: "200px",
                      height: "200px",
                      background: "rgba(234, 88, 12, 0.2)",
                      borderRadius: "50%",
                    }}
                  />

                  <div
                    className="card-body p-4"
                    style={{ position: "relative" }}
                  >
                    <div className="d-flex align-items-start">
                      <div
                        className="me-3"
                        style={{
                          width: "64px",
                          height: "64px",
                          background: "rgba(255, 255, 255, 0.3)",
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          backdropFilter: "blur(10px)",
                          border: "2px solid rgba(255, 255, 255, 0.4)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                          <path d="M4 22h16" />
                          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                        </svg>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-2">
                          <h5
                            className="fw-bold mb-0 text-white"
                            style={{ fontSize: "1.3rem" }}
                          >
                            🏆 Master Challenge
                          </h5>
                          <span
                            className="badge ms-2"
                            style={{
                              background: "rgba(220, 38, 38, 0.9)",
                              color: "white",
                              fontSize: "0.7rem",
                              fontWeight: "800",
                              padding: "0.4rem 0.8rem",
                              borderRadius: "6px",
                              letterSpacing: "0.5px",
                            }}
                          >
                            EXTREME
                          </span>
                        </div>
                        <p
                          className="mb-3"
                          style={{
                            fontSize: "0.95rem",
                            lineHeight: "1.6",
                            color: "rgba(255, 255, 255, 0.95)",
                          }}
                        >
                          Ultimate test! Letters, numbers, words, and phrases
                          combined
                        </p>
                        <Link
                          href="/quiz/mixed"
                          className="btn btn-sm boss-btn"
                          style={{
                            background: "rgba(220, 38, 38, 0.95)",
                            color: "white",
                            border: "none",
                            padding: "0.7rem 1.8rem",
                            fontSize: "0.9rem",
                            fontWeight: "800",
                            borderRadius: "10px",
                            letterSpacing: "0.5px",
                          }}
                        >
                          ACCEPT CHALLENGE →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Practice Mode - Cyan */}
              <div className="col-lg-6">
                <div
                  className="card border-0 h-100 game-card"
                  style={{
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
                    boxShadow: "0 8px 24px rgba(8, 145, 178, 0.4)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      right: "-40px",
                      width: "150px",
                      height: "150px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    className="card-body p-4"
                    style={{ position: "relative" }}
                  >
                    <div className="d-flex align-items-start">
                      <div
                        className="me-3"
                        style={{
                          width: "64px",
                          height: "64px",
                          background: "rgba(255, 255, 255, 0.25)",
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div className="flex-grow-1">
                        <h5
                          className="fw-bold mb-2 text-white"
                          style={{ fontSize: "1.25rem" }}
                        >
                          😊 Chill Mode
                        </h5>
                        <p
                          className="mb-3"
                          style={{
                            fontSize: "0.95rem",
                            lineHeight: "1.6",
                            color: "rgba(255, 255, 255, 0.9)",
                          }}
                        >
                          No pressure, no timer. Learn at your own comfortable
                          pace
                        </p>
                        <Link
                          href="/quiz/practice"
                          className="btn btn-sm game-btn"
                          style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            color: "#0891b2",
                            border: "none",
                            padding: "0.7rem 1.8rem",
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            borderRadius: "10px",
                            letterSpacing: "0.3px",
                          }}
                        >
                          START PRACTICE →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .game-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .game-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.5) !important;
        }

        .boss-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: pulse 2s ease-in-out infinite;
        }

        .boss-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 24px 48px rgba(245, 158, 11, 0.6) !important;
        }

        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 12px 32px rgba(245, 158, 11, 0.5);
          }
          50% {
            box-shadow: 0 12px 32px rgba(245, 158, 11, 0.7);
          }
        }

        .game-btn {
          transition: all 0.2s ease;
        }

        .game-btn:hover {
          transform: translateX(6px) scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .boss-btn {
          transition: all 0.2s ease;
          animation: glow 1.5s ease-in-out infinite;
        }

        .boss-btn:hover {
          transform: translateX(6px) scale(1.05);
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5);
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(220, 38, 38, 0.8);
          }
        }

        @media (max-width: 991px) {
          .display-4 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .card-body {
            padding: 1.25rem !important;
          }

          h5 {
            font-size: 1.1rem !important;
          }

          p {
            font-size: 0.9rem !important;
          }

          [style*="width: 64px"] {
            width: 56px !important;
            height: 56px !important;
          }

          svg {
            width: 28px !important;
            height: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}
