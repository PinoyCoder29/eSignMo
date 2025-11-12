"use client";
import Link from "next/link";

export default function Learn() {
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
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="mb-3">
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
                  📚 LEARN ASL
                </span>
              </div>
              <h1
                className="display-3 fw-bold text-white mb-3"
                style={{
                  letterSpacing: "-1px",
                  lineHeight: "0.8",
                  textShadow: "0 2px 20px rgba(139, 92, 246, 0.3)",
                }}
              >
                ASL Learning Center
              </h1>
              <p
                className="fs-5 mb-0"
                style={{
                  maxWidth: "600px",
                  color: "rgba(255, 255, 255, 0.85)",
                  lineHeight: "1.5",
                }}
              >
                Start your journey to mastering American Sign Language with our
                comprehensive learning modules!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-4">
        <div className="container" style={{ maxWidth: "1140px" }}>
          {/* Learning Modules */}
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
              <h2 className="h4 fw-bold text-white mb-0">Learning Modules</h2>
            </div>
            <div className="row g-4">
              {/* ASL Alphabet - Cyan */}
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
                          <path d="M4 7V4h16v3" />
                          <path d="M9 20h6" />
                          <path d="M12 4v16" />
                        </svg>
                      </div>
                      <div className="flex-grow-1">
                        <h5
                          className="fw-bold mb-2 text-white"
                          style={{ fontSize: "1.25rem" }}
                        >
                          ASL Alphabet
                        </h5>
                        <p
                          className="mb-3"
                          style={{
                            fontSize: "0.95rem",
                            lineHeight: "1.6",
                            color: "rgba(255, 255, 255, 0.9)",
                          }}
                        >
                          Learn the complete ASL alphabet from A to Z with
                          detailed finger positions and practice guides
                        </p>
                        <Link
                          href="/ asl/learn/learnAlphabet"
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
                          EXPLORE →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Common Words - Gold */}
              <div className="col-lg-6">
                <div
                  className="card border-0 h-100 game-card"
                  style={{
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                    boxShadow: "0 8px 24px rgba(245, 158, 11, 0.4)",
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
                        <h5
                          className="fw-bold mb-2 text-white"
                          style={{ fontSize: "1.25rem" }}
                        >
                          Common Words
                        </h5>
                        <p
                          className="mb-3"
                          style={{
                            fontSize: "0.95rem",
                            lineHeight: "1.6",
                            color: "rgba(255, 255, 255, 0.9)",
                          }}
                        >
                          Build your vocabulary with everyday ASL words and
                          essential signs for daily communication
                        </p>
                        <Link
                          href="/learn/words"
                          className="btn btn-sm game-btn"
                          style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            color: "#f59e0b",
                            border: "none",
                            padding: "0.7rem 1.8rem",
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            borderRadius: "10px",
                            letterSpacing: "0.3px",
                          }}
                        >
                          EXPLORE →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phrases - Purple */}
              <div className="col-lg-6">
                <div
                  className="card border-0 h-100 game-card"
                  style={{
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
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
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <div className="flex-grow-1">
                        <h5
                          className="fw-bold mb-2 text-white"
                          style={{ fontSize: "1.25rem" }}
                        >
                          Phrases
                        </h5>
                        <p
                          className="mb-3"
                          style={{
                            fontSize: "0.95rem",
                            lineHeight: "1.6",
                            color: "rgba(255, 255, 255, 0.9)",
                          }}
                        >
                          Master common phrases and conversational expressions
                          to communicate naturally in ASL
                        </p>
                        <Link
                          href="/learn/phrases"
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
                          EXPLORE →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grammar Rules - Pink */}
              <div className="col-lg-6">
                <div
                  className="card border-0 h-100 game-card"
                  style={{
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #db2777 0%, #ec4899 100%)",
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
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <line x1="10" y1="9" x2="8" y2="9" />
                        </svg>
                      </div>
                      <div className="flex-grow-1">
                        <h5
                          className="fw-bold mb-2 text-white"
                          style={{ fontSize: "1.25rem" }}
                        >
                          Grammar Rules
                        </h5>
                        <p
                          className="mb-3"
                          style={{
                            fontSize: "0.95rem",
                            lineHeight: "1.6",
                            color: "rgba(255, 255, 255, 0.9)",
                          }}
                        >
                          Understand ASL sentence structure, grammar patterns,
                          and linguistic principles for fluency
                        </p>
                        <Link
                          href="/learn/grammar"
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
                          EXPLORE →
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

        .game-btn {
          transition: all 0.2s ease;
        }

        .game-btn:hover {
          transform: translateX(6px) scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 991px) {
          .display-3 {
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
