"use client";
import React, { useState, useEffect, useRef } from "react";

interface SignItem {
  answer: string;
  imageUrl: string;
}

export default function SpeechTextToSign() {
  const [text, setText] = useState<string>("");
  const [signImages, setSignImages] = useState<(string | null)[]>([]);
  const [database, setDatabase] = useState<SignItem[]>([]);
  const [listening, setListening] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  // Fetch database
  useEffect(() => {
    async function fetchDatabase() {
      try {
        const res = await fetch("/api/speech_text_to_sign");
        const data: SignItem[] = await res.json();
        setDatabase(data);
      } catch (err) {
        console.error("Failed to fetch database:", err);
      }
    }
    fetchDatabase();
  }, []);

  // Setup SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
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
    const words = inputText.split(" ");
    const images = words.map((word) => {
      const match = database.find(
        (item) => item.answer.toLowerCase() === word.toLowerCase()
      );
      return match ? match.imageUrl : null;
    });
    setSignImages(images);
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

      <div className="min-vh-100 bg-dark text-white py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-xl-10">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold">
                  <i className="fas fa-hands me-2 text-primary"></i>
                  Speech to Sign Language Translator
                </h2>
              </div>

              {/* Input Card */}
              <div className="card bg-dark border-secondary shadow-lg mb-4">
                <div className="card-body p-4">
                  <label className="form-label text-light mb-3 fw-semibold">
                    <i className="fas fa-comment-dots me-2"></i>
                    Input Text
                  </label>

                  <div className="input-group" style={{ height: "70px" }}>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      value={text}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="Type or speak here..."
                      style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        fontSize: "1.5rem",
                        height: "100%",
                      }}
                    />
                    <button
                      className={`btn ${
                        listening ? "btn-danger" : "btn-primary"
                      } px-4`}
                      onClick={toggleListening}
                      style={{ minWidth: "100px", height: "100%" }}
                    >
                      <i
                        className={`fas ${
                          listening ? "fa-stop-circle" : "fa-microphone"
                        }`}
                        style={{ fontSize: "1.8rem" }}
                      ></i>
                    </button>
                  </div>

                  {listening && (
                    <div className="alert alert-danger bg-dark border-danger text-danger mt-3 mb-0 d-flex align-items-center">
                      <i className="fas fa-circle fa-beat me-3"></i>
                      <strong>Recording in progress...</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Sign Images Display */}
              {text && (
                <div className="card bg-dark border-secondary shadow-lg">
                  <div className="card-body p-4">
                    <h5 className="card-title mb-4 fw-semibold">
                      <i className="fas fa-language me-2 text-primary"></i>
                      Sign Language Translation
                    </h5>

                    {signImages.length > 0 ? (
                      <div className="d-flex flex-wrap gap-3 justify-content-center py-3">
                        {signImages.map((img, idx) =>
                          img ? (
                            <div
                              key={idx}
                              className="border border-secondary rounded p-2 bg-secondary bg-opacity-25 shadow"
                              style={{
                                width: "140px",
                                height: "140px",
                              }}
                            >
                              <img
                                src={img}
                                alt="sign"
                                className="img-fluid rounded"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              key={idx}
                              className="border border-secondary rounded p-2 d-flex align-items-center justify-content-center bg-secondary bg-opacity-10"
                              style={{
                                width: "140px",
                                height: "140px",
                              }}
                            >
                              <i className="fas fa-question-circle text-secondary fa-2x"></i>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-secondary py-4">
                        <i className="fas fa-hand-paper fa-3x mb-3 opacity-50"></i>
                        <p>No translation available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
