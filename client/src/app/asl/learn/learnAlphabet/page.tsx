"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Zap,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
} from "lucide-react";

interface Question {
  answer: string;
  imageUrl: string;
}

export default function LearnAlphabet() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<Question | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/learnAlphabet");
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  const handleDownload = async () => {
    if (!selectedLetter) return;

    try {
      const letter = selectedLetter.answer
        .split("\n")[0]
        .replace("Letter ", "");
      const imageUrl = selectedLetter.imageUrl;

      // Fetch the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Set filename: ASL_Letter_A.png (or appropriate extension)
      const extension = imageUrl.split(".").pop()?.split("?")[0] || "png";
      link.download = `ASL_Letter_${letter}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setShowDownloadModal(false);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  const handleNextLesson = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedLetter(questions[nextIndex]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousLesson = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedLetter(questions[prevIndex]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getRelatedLessons = () => {
    const startIndex = Math.max(0, currentIndex - 1);
    const endIndex = Math.min(questions.length, startIndex + 4);
    return questions
      .slice(startIndex, endIndex)
      .filter((_, idx) => startIndex + idx !== currentIndex);
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "#1a1a1a",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-info"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white mt-3 fs-5 fw-medium">
            Loading ASL Alphabet...
          </p>
        </div>
      </div>
    );
  }

  // Detail View
  if (selectedLetter) {
    const letter = selectedLetter.answer.split("\n")[0].replace("Letter ", "");
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
      <div className="min-vh-100" style={{ background: "#1a1a1a" }}>
        {/* Download Modal */}
        {showDownloadModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              background: "rgba(0, 0, 0, 0.75)",
              zIndex: 9999,
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setShowDownloadModal(false)}
          >
            <div
              className="bg-white rounded-4 p-4 position-relative"
              style={{ maxWidth: "400px", width: "90%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDownloadModal(false)}
                className="btn btn-link position-absolute top-0 end-0 text-dark p-2"
                style={{ textDecoration: "none" }}
              >
                <X size={24} />
              </button>

              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: "64px",
                    height: "64px",
                    background:
                      "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                  }}
                >
                  <Download size={32} color="white" />
                </div>
                <h3 className="fw-bold mb-2">Download Image</h3>
                <p className="text-secondary mb-0">
                  Download ASL sign for Letter {letter}
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="btn btn-outline-secondary flex-fill"
                  style={{ borderRadius: "10px", padding: "12px" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDownload}
                  className="btn flex-fill text-white"
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    background:
                      "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                    border: "none",
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Header with Back Button */}
        <div
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="container py-3">
            <button
              onClick={() => setSelectedLetter(null)}
              className="btn btn-light d-flex align-items-center gap-2 fw-semibold mb-3"
              style={{ borderRadius: "12px", padding: "10px 20px" }}
            >
              <ArrowLeft size={18} />
              <span>Back to ASL Alphabet</span>
            </button>

            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <span
                  className="badge bg-white bg-opacity-25"
                  style={{ padding: "6px 14px", fontSize: "0.875rem" }}
                >
                  Lesson {currentIndex + 1} of {questions.length}
                </span>
                <h1 className="display-4 fw-bold mb-0 text-white">
                  Letter {letter}
                </h1>
              </div>
              <span
                className="badge bg-success"
                style={{
                  padding: "6px 16px",
                  fontSize: "0.875rem",
                  borderRadius: "10px",
                }}
              >
                beginner
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-3">
          <div className="row g-3">
            {/* Left Side - Image */}
            <div className="col-lg-5">
              <div
                className="card border-0 h-100"
                style={{
                  background: "#2d3748",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="p-3 d-flex align-items-center justify-content-center"
                  style={{ minHeight: "380px", position: "relative" }}
                >
                  <Image
                    src={selectedLetter.imageUrl}
                    alt={`Sign for ${letter}`}
                    width={350}
                    height={350}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "350px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div className="p-3">
                  <button
                    onClick={() => setShowDownloadModal(true)}
                    className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{ borderRadius: "10px", padding: "10px" }}
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Description */}
            <div className="col-lg-7">
              <div
                className="card border-0 text-white h-100"
                style={{
                  background: "#2d3748",
                  borderRadius: "20px",
                  padding: "1.5rem",
                }}
              >
                <div className="mb-3 d-flex align-items-center gap-2 text-warning">
                  <Zap size={18} fill="currentColor" />
                  <span className="fw-semibold">Learn it now!</span>
                </div>

                <h2 className="h4 fw-bold mb-3">Description</h2>
                <h1
                  className="mb-3 lh-base text-center fw-bold"
                  style={{ color: "#cbd5e0", fontSize: "90px" }}
                >
                  {letter}
                </h1>

                <div
                  className="p-3 rounded-3"
                  style={{ background: "#1a202c" }}
                >
                  <h3 className="h6 fw-bold mb-3">Learning Tips</h3>
                  <ul
                    className="mb-0"
                    style={{ paddingLeft: "1.5rem", color: "#cbd5e0" }}
                  >
                    <li className="mb-2">
                      Practice the hand shape slowly at first
                    </li>
                    <li className="mb-2">
                      Watch your hand position in a mirror
                    </li>
                    <li className="mb-0">
                      Repeat 10-15 times for muscle memory
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                onClick={handlePreviousLesson}
                disabled={currentIndex === 0}
                className="btn btn-outline-light d-flex align-items-center gap-2"
                style={{
                  borderRadius: "10px",
                  padding: "10px 20px",
                  opacity: currentIndex === 0 ? 0.5 : 1,
                  cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                }}
              >
                <ChevronLeft size={18} />
                <span>Previous</span>
              </button>

              {/* Progress Bar */}
              <div className="flex-grow-1 mx-4">
                <div
                  className="progress"
                  style={{
                    height: "8px",
                    borderRadius: "4px",
                    background: "#2d3748",
                  }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${progress}%`,
                      background:
                        "linear-gradient(90deg, #06b6d4 0%, #0891b2 100%)",
                      borderRadius: "4px",
                    }}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>

              <button
                onClick={handleNextLesson}
                disabled={currentIndex === questions.length - 1}
                className="btn btn-light d-flex align-items-center gap-2"
                style={{
                  borderRadius: "10px",
                  padding: "10px 20px",
                  opacity: currentIndex === questions.length - 1 ? 0.5 : 1,
                  cursor:
                    currentIndex === questions.length - 1
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Related Lessons */}
          <div className="mt-4">
            <h2 className="h4 fw-bold text-white mb-3">Related Lessons</h2>
            <div className="row g-3">
              {getRelatedLessons().map((q, idx) => {
                const relatedLetter = q.answer
                  .split("\n")[0]
                  .replace("Letter ", "");
                const relatedDescription = q.answer.split("\n")[1] || "";
                const relatedIndex = questions.findIndex(
                  (item) => item.answer === q.answer
                );

                return (
                  <div key={idx} className="col-sm-6 col-lg-3">
                    <div
                      className="card border-0 h-100"
                      style={{
                        borderRadius: "14px",
                        cursor: "pointer",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        overflow: "hidden",
                      }}
                      onClick={() => {
                        setCurrentIndex(relatedIndex);
                        setSelectedLetter(q);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow =
                          "0 16px 32px rgba(0,0,0,0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "";
                      }}
                    >
                      <div
                        className="position-relative d-flex align-items-center justify-content-center"
                        style={{
                          height: "180px",
                          background:
                            "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                          padding: "1rem",
                        }}
                      >
                        <Image
                          src={q.imageUrl}
                          alt={`Sign for ${relatedLetter}`}
                          width={180}
                          height={180}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                        <span
                          className="badge bg-success position-absolute"
                          style={{
                            top: "10px",
                            left: "10px",
                            borderRadius: "6px",
                            padding: "4px 10px",
                            fontSize: "0.75rem",
                          }}
                        >
                          beginner
                        </span>
                      </div>
                      <div
                        className="card-body"
                        style={{ background: "#2d3748", padding: "1rem" }}
                      >
                        <h3 className="h6 fw-bold text-white mb-2">
                          Letter {relatedLetter}
                        </h3>
                        <p
                          className="card-text small mb-2"
                          style={{
                            color: "#cbd5e0",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {relatedDescription}
                        </p>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="text-white-50 small d-flex align-items-center gap-1">
                            <Zap size={12} />2 min
                          </span>
                          <span className="text-info small fw-semibold">
                            Learn →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="min-vh-100" style={{ background: "#1a1a1a" }}>
      {/* Hero Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container py-3">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="btn btn-light d-flex align-items-center gap-2 fw-semibold mb-3"
            style={{ borderRadius: "10px", padding: "10px 20px" }}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="bg-white bg-opacity-25 rounded-3 p-2">
                  <span style={{ fontSize: "1.75rem" }}>👋</span>
                </div>
                <div>
                  <h1 className="text-white fw-bold display-5 mb-1">
                    ASL Alphabet
                  </h1>
                  <p className="text-white fs-6 mb-0 opacity-75">
                    Master all 26 letters of the ASL alphabet through
                    interactive lessons
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div
                className="card border-0 bg-white bg-opacity-25 text-white text-center p-3"
                style={{ borderRadius: "14px", backdropFilter: "blur(10px)" }}
              >
                <h2 className="display-4 fw-bold mb-0">{questions.length}</h2>
                <p className="mb-0 text-uppercase fw-semibold small">
                  Total Lessons
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-4">
        <div className="mb-3">
          <h2 className="text-white fw-bold h4">All Lessons</h2>
          <p className="text-white-50 small">
            {questions.length} lessons available
          </p>
        </div>

        <div className="row g-3">
          {questions.map((q, index) => {
            const letter = q.answer.split("\n")[0].replace("Letter ", "");
            const description = q.answer.split("\n")[1] || "";
            return (
              <div key={index} className="col-sm-6 col-md-4 col-lg-3">
                <div
                  className="card border-0 h-100 shadow-sm position-relative overflow-hidden"
                  style={{
                    borderRadius: "14px",
                    cursor: "pointer",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onClick={() => {
                    setCurrentIndex(index);
                    setSelectedLetter(q);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 32px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div
                    className="position-relative d-flex align-items-center justify-content-center"
                    style={{
                      height: "200px",
                      background:
                        "linear-gradient(135deg, #e0f2fe 0%, #273339ff 100%)",
                      padding: "1rem",
                    }}
                  >
                    <Image
                      src={q.imageUrl}
                      alt={`Sign for ${letter}`}
                      width={200}
                      height={200}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <span
                      className="badge bg-success position-absolute"
                      style={{
                        top: "10px",
                        left: "10px",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "0.75rem",
                      }}
                    >
                      beginner
                    </span>
                  </div>
                  <div className="card-body" style={{ padding: "1rem" }}>
                    <h3 className="card-title fw-bold h6 mb-2">
                      Letter {letter}
                    </h3>
                    <p
                      className="card-text text-secondary small mb-0"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
