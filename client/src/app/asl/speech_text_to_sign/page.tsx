"use client";
import React, { useState, useEffect, useRef } from "react";

interface SignItem {
  answer: string;
  imageUrl: string;
  videoUrl?: string;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

export default function SpeechTextToSign() {
  const [text, setText] = useState<string>("");
  const [signImages, setSignImages] = useState<SignItem[]>([]);
  const [database, setDatabase] = useState<SignItem[]>([]);
  const [listening, setListening] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Fetch database - Combined questions and wordQuestions
  useEffect(() => {
    async function fetchDatabase() {
      try {
        setLoading(true);
        setError("");

        // Fetch both endpoints
        const [questionsRes, wordQuestionsRes] = await Promise.all([
          fetch("/api/speech_text_to_sign"),
          fetch("/api/learn/allWords"),
        ]);

        // Check if responses are OK
        if (!questionsRes.ok) {
          throw new Error(
            `Failed to fetch questions: ${questionsRes.status} ${questionsRes.statusText}`
          );
        }

        if (!wordQuestionsRes.ok) {
          throw new Error(
            `Failed to fetch word questions: ${wordQuestionsRes.status} ${wordQuestionsRes.statusText}`
          );
        }

        // Check content type
        const questionsContentType = questionsRes.headers.get("content-type");
        const wordQuestionsContentType =
          wordQuestionsRes.headers.get("content-type");

        if (
          !questionsContentType ||
          !questionsContentType.includes("application/json")
        ) {
          throw new Error(
            "Invalid response from questions API - expected JSON"
          );
        }

        if (
          !wordQuestionsContentType ||
          !wordQuestionsContentType.includes("application/json")
        ) {
          throw new Error(
            "Invalid response from word questions API - expected JSON"
          );
        }

        const questions: SignItem[] = await questionsRes.json();
        const wordQuestions: SignItem[] = await wordQuestionsRes.json();

        // Validate data
        if (!Array.isArray(questions) || !Array.isArray(wordQuestions)) {
          throw new Error("Invalid data format received from API");
        }

        // Combine both arrays
        const combined = [...questions, ...wordQuestions];
        setDatabase(combined);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch database:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load database"
        );
        setLoading(false);
      }
    }
    fetchDatabase();
  }, []);

  // Setup SpeechRecognition
  useEffect(() => {
    if (database.length === 0) return;

    const windowWithSR = window as unknown as WindowWithSpeechRecognition;
    const SpeechRecognitionConstructor =
      windowWithSR.SpeechRecognition || windowWithSR.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      console.warn("Browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setText(finalTranscript);
      updateSignImages(finalTranscript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [database]);

  const updateSignImages = (inputText: string) => {
    const words = inputText
      .toLowerCase()
      .split(" ")
      .filter((word) => word.trim() !== "");

    const items = words
      .map((word) => {
        const match = database.find(
          (item) => item.answer.toLowerCase().trim() === word.trim()
        );
        return match || null;
      })
      .filter((item): item is SignItem => item !== null);

    setSignImages(items);
  };

  const handleInputChange = (value: string) => {
    setText(value);
    updateSignImages(value);
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />

      <div
        className="min-vh-100 py-5"
        style={{
          background: "#1a1a1a",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-xl-10">
              {/* Header */}
              <div className="text-center mb-5">
                <h1 className="fw-bold text-white display-5 mb-3">
                  <i className="fas fa-hands me-3"></i>
                  Speech to Sign Language
                </h1>
                <p className="text-white-50 fs-5">
                  Speak or type to translate into ASL signs
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-5">
                  <div
                    className="spinner-border text-light"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-white mt-3 fs-5">Loading database...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center"
                  role="alert"
                >
                  <i className="fas fa-exclamation-circle me-3 fs-4"></i>
                  <div>
                    <strong>Error:</strong> {error}
                    <br />
                    <small>
                      Please make sure the API endpoints are working correctly.
                    </small>
                  </div>
                </div>
              )}

              {/* Main Content - Only show if loaded successfully */}
              {!loading && !error && (
                <>
                  {/* Input Card */}
                  <div
                    className="card shadow-lg mb-5"
                    style={{
                      background: "rgba(139, 92, 246, 0.25)",
                      border: "2px solid rgba(139, 92, 246, 0.5)",
                      borderRadius: "20px",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div className="card-body p-4">
                      <label
                        className="form-label mb-3 fw-semibold text-white fs-5"
                        style={{ color: "#c4b5fd" }}
                      >
                        <i className="fas fa-comment-dots me-2"></i>
                        Input Text
                      </label>

                      <div
                        className="input-group mb-3"
                        style={{ height: "80px" }}
                      >
                        <input
                          type="text"
                          className="form-control"
                          value={text}
                          onChange={(e) => handleInputChange(e.target.value)}
                          placeholder="Type or speak here..."
                          style={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            fontSize: "1.5rem",
                            height: "100%",
                            border: "2px solid rgba(139, 92, 246, 0.5)",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            color: "white",
                            borderTopLeftRadius: "12px",
                            borderBottomLeftRadius: "12px",
                          }}
                        />
                        <button
                          className={`btn px-5`}
                          onClick={toggleListening}
                          disabled={database.length === 0}
                          style={{
                            minWidth: "120px",
                            height: "100%",
                            background: listening
                              ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                              : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                            color: "white",
                            border: "none",
                            borderTopRightRadius: "12px",
                            borderBottomRightRadius: "12px",
                          }}
                        >
                          <i
                            className={`fas ${
                              listening ? "fa-stop-circle" : "fa-microphone"
                            }`}
                            style={{ fontSize: "2rem" }}
                          ></i>
                        </button>
                      </div>

                      {listening && (
                        <div
                          className="alert mb-0 d-flex align-items-center"
                          style={{
                            background: "rgba(239, 68, 68, 0.2)",
                            border: "2px solid #ef4444",
                            borderRadius: "12px",
                            color: "white",
                          }}
                        >
                          <i
                            className="fas fa-circle fa-beat me-3"
                            style={{ color: "#ef4444", fontSize: "1.2rem" }}
                          ></i>
                          <strong style={{ fontSize: "1.1rem" }}>
                            Recording in progress...
                          </strong>
                        </div>
                      )}

                      {/* Database Info */}
                      <div className="text-white-50 small mt-3">
                        <i className="fas fa-database me-2"></i>
                        Loaded {database.length} signs
                      </div>
                    </div>
                  </div>

                  {/* Sign Images/Videos Display */}
                  {text && (
                    <div
                      className="card shadow-lg"
                      style={{
                        background: "rgba(139, 92, 246, 0.25)",
                        border: "2px solid rgba(139, 92, 246, 0.5)",
                        borderRadius: "20px",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div className="card-body p-4">
                        <h4
                          className="card-title mb-4 fw-bold text-white"
                          style={{ fontSize: "1.5rem" }}
                        >
                          <i className="fas fa-language me-2"></i>
                          Sign Language Translation
                        </h4>

                        {signImages.length > 0 ? (
                          <div className="row g-4">
                            {signImages.map((item, idx) => (
                              <div
                                key={idx}
                                className="col-sm-6 col-md-4 col-lg-3"
                              >
                                <div
                                  className="rounded p-3 shadow-lg h-100"
                                  style={{
                                    border: "3px solid rgba(139, 92, 246, 0.5)",
                                    background: "rgba(255, 255, 255, 0.1)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: "16px",
                                  }}
                                >
                                  {/* Display Video if available, otherwise Image */}
                                  {item.videoUrl ? (
                                    <video
                                      src={item.videoUrl}
                                      controls
                                      autoPlay
                                      loop
                                      muted
                                      className="w-100 rounded mb-2"
                                      style={{
                                        height: "200px",
                                        objectFit: "cover",
                                        borderRadius: "12px",
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src={item.imageUrl}
                                      alt="sign"
                                      className="w-100 rounded mb-2"
                                      style={{
                                        height: "200px",
                                        objectFit: "cover",
                                        borderRadius: "12px",
                                      }}
                                    />
                                  )}
                                  <div className="text-center">
                                    <span
                                      className="badge px-3 py-2"
                                      style={{
                                        background:
                                          "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                                        fontSize: "1rem",
                                        borderRadius: "8px",
                                      }}
                                    >
                                      {item.answer}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div
                            className="text-center py-5"
                            style={{ color: "#cbd5e1" }}
                          >
                            <i className="fas fa-hand-paper fa-4x mb-4 opacity-50"></i>
                            <p className="fs-5">
                              No translation available for this text
                            </p>
                            <small className="text-white-50">
                              Try typing words that are in the database
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
