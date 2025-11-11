"use client";

import { useEffect, useState, useRef } from "react";

interface Question {
  id: number;
  imageUrl: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
}

interface Answer {
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
}

interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  showInstructions: boolean;
  quizDone: boolean;
}

interface QuizWindow extends Window {
  __quizState?: string;
}

interface AudioWindow extends Window {
  webkitAudioContext?: {
    new (): AudioContext;
  };
}

export default function ProfessionalLMSQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizDone, setQuizDone] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showFeedbackAnimation, setShowFeedbackAnimation] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const questionTopRef = useRef<HTMLDivElement>(null);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleLeave = () => {
    window.location.href = "/asl/test";
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const saveToMemory = (state: QuizState) => {
    try {
      const stateData = JSON.stringify(state);
      (window as QuizWindow).__quizState = stateData;
    } catch (error) {
      console.error("Error saving state:", error);
    }
  };

  const loadFromMemory = (): QuizState | null => {
    try {
      const stateData = (window as QuizWindow).__quizState;
      if (stateData) {
        return JSON.parse(stateData) as QuizState;
      }
    } catch (error) {
      console.error("Error loading state:", error);
    }
    return null;
  };

  const playSuccessSound = () => {
    const AudioCtx =
      window.AudioContext || (window as AudioWindow).webkitAudioContext;
    if (!AudioCtx) {
      console.warn("Web Audio API is not supported in this browser");
      return;
    }

    const audioContext = new AudioCtx();
    const melody = [
      { freq: 523.25, time: 0 },
      { freq: 659.25, time: 0.1 },
      { freq: 783.99, time: 0.2 },
      { freq: 1046.5, time: 0.3 },
    ];

    const startTime = audioContext.currentTime;
    melody.forEach(({ freq, time }) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.setValueAtTime(freq, startTime + time);
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, startTime + time);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + time + 0.15);
      osc.start(startTime + time);
      osc.stop(startTime + time + 0.15);
    });
  };

  const playErrorSound = () => {
    const AudioCtx =
      window.AudioContext || (window as AudioWindow).webkitAudioContext;
    if (!AudioCtx) {
      console.warn("Web Audio API is not supported in this browser");
      return;
    }

    const audioContext = new AudioCtx();
    const osc1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    osc1.connect(gainNode1);
    gainNode1.connect(audioContext.destination);
    const now = audioContext.currentTime;
    osc1.frequency.setValueAtTime(440, now);
    osc1.frequency.exponentialRampToValueAtTime(220, now + 0.15); // ✅ fixed
    osc1.type = "sawtooth";
    gainNode1.gain.setValueAtTime(0.2, now);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc1.start(now);
    osc1.stop(now + 0.15);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const savedState = loadFromMemory();

        if (savedState && savedState.questions.length > 0) {
          setQuestions(savedState.questions);
          setCurrentIndex(savedState.currentIndex);
          setAnswers(savedState.answers);
          setShowInstructions(savedState.showInstructions);
          setQuizDone(savedState.quizDone);

          const currentQuestion = savedState.questions[savedState.currentIndex];
          const existingAnswer = savedState.answers.find(
            (a) => a.questionId === currentQuestion?.id
          );

          if (existingAnswer) {
            setIsAnswered(true);
            const selectedKey = ["a", "b", "c", "d"].find((key) => {
              const optionKey = `option${key.toUpperCase()}` as keyof Question;
              return currentQuestion[optionKey] === existingAnswer.userAnswer;
            });
            setSelected(selectedKey || null);
            setFeedback(existingAnswer.isCorrect ? "correct" : "wrong");
          }

          setLoading(false);
          return;
        }

        const res = await fetch("/api/questions");
        const data: Question[] = await res.json();
        if (!data || data.length === 0) {
          setQuizDone(true);
        } else {
          const shuffledQuestions: Question[] = shuffleArray(data);
          setQuestions(shuffledQuestions);

          const initialState: QuizState = {
            questions: shuffledQuestions,
            currentIndex: 0,
            answers: [],
            showInstructions: true,
            quizDone: false,
          };
          saveToMemory(initialState);
        }
      } catch (error) {
        console.error("❌ Error fetching questions:", error);
        setQuizDone(true);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!loading && questions.length > 0) {
      const state: QuizState = {
        questions,
        currentIndex,
        answers,
        showInstructions,
        quizDone,
      };
      saveToMemory(state);
    }
  }, [questions, currentIndex, answers, showInstructions, quizDone, loading]);

  useEffect(() => {
    if (questionTopRef.current && !showInstructions) {
      questionTopRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentIndex, showInstructions]);

  const handleAnswer = (key: string) => {
    if (isAnswered || !questions.length) return;

    const current = questions[currentIndex];
    const alreadyAnswered = answers.find((a) => a.questionId === current.id);
    if (alreadyAnswered) return;

    const optionKey = `option${key.toUpperCase()}` as
      | "optionA"
      | "optionB"
      | "optionC"
      | "optionD";
    const selectedText = current[optionKey];
    const isCorrect = selectedText === current.answer;

    setSelected(key);
    setIsAnswered(true);
    setFeedback(isCorrect ? "correct" : "wrong");
    setShowFeedbackAnimation(true);

    const newAnswers: Answer[] = [
      ...answers,
      {
        questionId: current.id,
        userAnswer: selectedText,
        isCorrect,
      },
    ];
    setAnswers(newAnswers);

    if (isCorrect) {
      playSuccessSound();
    } else {
      playErrorSound();
    }

    setTimeout(() => setShowFeedbackAnimation(false), 500);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetQuestion();
    } else {
      setQuizDone(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetQuestion();
    }
  };

  const handleRestart = () => {
    const shuffledQuestions: Question[] = shuffleArray([...questions]);
    setQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setAnswers([]);
    setQuizDone(false);
    resetQuestion();
    setShowInstructions(true);

    const newState: QuizState = {
      questions: shuffledQuestions,
      currentIndex: 0,
      answers: [],
      showInstructions: true,
      quizDone: false,
    };
    saveToMemory(newState);
  };

  const resetQuestion = () => {
    const nextIndex =
      currentIndex < questions.length - 1 ? currentIndex + 1 : currentIndex;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    const currentQuestion = questions[nextIndex] || questions[prevIndex];

    if (currentQuestion) {
      const existingAnswer = answers.find(
        (a) => a.questionId === currentQuestion.id
      );

      if (existingAnswer) {
        setIsAnswered(true);
        const selectedKey = ["a", "b", "c", "d"].find((key) => {
          const optionKey = `option${key.toUpperCase()}` as keyof Question;
          return currentQuestion[optionKey] === existingAnswer.userAnswer;
        });
        setSelected(selectedKey || null);
        setFeedback(existingAnswer.isCorrect ? "correct" : "wrong");
      } else {
        setSelected(null);
        setFeedback(null);
        setIsAnswered(false);
      }
    } else {
      setSelected(null);
      setFeedback(null);
      setIsAnswered(false);
    }
    setShowFeedbackAnimation(false);
  };

  const jumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setShowNavigation(false);

    const targetQuestion = questions[index];
    const existingAnswer = answers.find(
      (a) => a.questionId === targetQuestion.id
    );

    if (existingAnswer) {
      setIsAnswered(true);
      const selectedKey = ["a", "b", "c", "d"].find((key) => {
        const optionKey = `option${key.toUpperCase()}` as keyof Question;
        return targetQuestion[optionKey] === existingAnswer.userAnswer;
      });
      setSelected(selectedKey || null);
      setFeedback(existingAnswer.isCorrect ? "correct" : "wrong");
    } else {
      setSelected(null);
      setFeedback(null);
      setIsAnswered(false);
    }
    setShowFeedbackAnimation(false);
  };

  const startQuiz = () => {
    setShowInstructions(false);
    setTimeout(() => {
      if (questionTopRef.current) {
        questionTopRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const wrongCount = answers.filter((a) => !a.isCorrect).length;

  if (loading) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "3rem",
              height: "3rem",
              border: "4px solid rgba(102, 126, 234, 0.3)",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <h4 style={{ marginTop: "1.5rem", fontWeight: "600" }}>
            Loading Assessment...
          </h4>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (showInstructions && !quizDone) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: "600px", width: "100%" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "2.5rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "2.5rem",
                }}
              >
                ℹ️
              </div>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                Assessment Instructions
              </h2>
              <p style={{ color: "#94a3b8" }}>
                Please read carefully before starting
              </p>
            </div>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                padding: "1.5rem",
                borderRadius: "12px",
                marginBottom: "1.5rem",
              }}
            >
              {[
                {
                  num: "1",
                  title: "Review Each Question",
                  desc: "Look at the ASL sign image carefully and select the correct letter from the options provided.",
                },
                {
                  num: "2",
                  title: "One Answer Per Question",
                  desc: "You can only select one answer per question. Once selected, you cannot change your answer.",
                },
                {
                  num: "3",
                  title: "Navigate Between Questions",
                  desc: "Use the Previous/Next buttons or the question navigation panel to move between questions.",
                },
                {
                  num: "4",
                  title: "Review Your Score",
                  desc: "After completing all questions, you'll see your score and can review the correct answers.",
                },
              ].map((item) => (
                <div
                  key={item.num}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "#667eea",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "0.9rem",
                      flexShrink: 0,
                    }}
                  >
                    {item.num}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h6 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                      {item.title}
                    </h6>
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.9rem",
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
                padding: "1.5rem 0",
                borderTop: "2px solid rgba(255, 255, 255, 0.1)",
                borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
                  ❓
                </div>
                <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                  Total Questions
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                  {questions.length}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
                  ⏱️
                </div>
                <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                  Time Limit
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                  No Limit
                </div>
              </div>
            </div>

            <button
              onClick={startQuiz}
              style={{
                width: "100%",
                padding: "1rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
            >
              ▶️ Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizDone) {
    const totalQuestions = questions.length;
    const percentage =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;

    let grade = "";
    let gradeColor = "";
    let gradeMessage = "";

    if (percentage >= 90) {
      grade = "Outstanding";
      gradeColor = "#10B981";
      gradeMessage = "Excellent performance! You've mastered the material.";
    } else if (percentage >= 75) {
      grade = "Very Good";
      gradeColor = "#06B6D4";
      gradeMessage = "Great work! You have a strong understanding.";
    } else if (percentage >= 60) {
      grade = "Good";
      gradeColor = "#F59E0B";
      gradeMessage = "Well done! Keep practicing to improve further.";
    } else {
      grade = "Needs Improvement";
      gradeColor = "#EF4444";
      gradeMessage = "Review the material and try again.";
    }

    return (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          minHeight: "100vh",
          padding: "20px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "2.5rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "rgba(102, 126, 234, 0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "2.5rem",
                }}
              >
                📋
              </div>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                Assessment Complete
              </h2>
              <p style={{ color: "#94a3b8" }}>You have completed the quiz</p>
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                border: `3px solid ${gradeColor}`,
                borderRadius: "12px",
                background: "rgba(0, 0, 0, 0.3)",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "800",
                  color: gradeColor,
                  marginBottom: "0.5rem",
                }}
              >
                {percentage}%
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: gradeColor,
                  marginBottom: "0.5rem",
                }}
              >
                {grade}
              </div>
              <p style={{ color: "#94a3b8", margin: 0 }}>{gradeMessage}</p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "1.25rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#667eea",
                  }}
                >
                  {totalQuestions}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  Total
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "1.25rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#10b981",
                  }}
                >
                  {correctCount}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  Correct
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "1.25rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#ef4444",
                  }}
                >
                  {wrongCount}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  Wrong
                </div>
              </div>
            </div>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                padding: "1.5rem",
                borderRadius: "12px",
                marginBottom: "2rem",
              }}
            >
              <h5
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                📝 Answer Review
              </h5>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {questions.map((q, idx) => {
                  const userAnswer = answers.find((a) => a.questionId === q.id);
                  return (
                    <div
                      key={q.id}
                      style={{
                        padding: "1rem",
                        marginBottom: "0.75rem",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderLeft: `4px solid ${userAnswer?.isCorrect ? "#10b981" : "#ef4444"}`,
                      }}
                    >
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <div style={{ fontSize: "1.25rem" }}>
                          {userAnswer?.isCorrect ? "✅" : "❌"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "#94a3b8",
                              marginBottom: "0.25rem",
                            }}
                          >
                            Question {idx + 1}
                          </div>
                          <div style={{ fontWeight: "600" }}>
                            Correct: {q.answer}
                          </div>
                          {userAnswer && !userAnswer.isCorrect && (
                            <div
                              style={{ fontSize: "0.9rem", color: "#ef4444" }}
                            >
                              Your answer: {userAnswer.userAnswer}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleRestart}
              style={{
                width: "100%",
                padding: "1rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
            >
              🔄 Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📭</div>
          <h3 style={{ fontWeight: "600" }}>No Questions Available</h3>
          <p style={{ color: "#94a3b8" }}>Please contact your administrator</p>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <div ref={questionTopRef}></div>

      {/* Header */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "1rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={handleBackClick}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "1.5rem",
                cursor: "pointer",
                padding: "0.5rem",
              }}
            >
              ←
            </button>
            <div>
              <h5 style={{ margin: 0, fontWeight: "bold" }}>
                ASL Quiz Assessment
              </h5>
              <small style={{ color: "#94a3b8" }}>American Sign Language</small>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1e293b",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h5 style={{ marginBottom: "1rem" }}>Confirm Exit</h5>
            <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
              Are you sure you want to leave the ASL Quiz Assessment?
            </p>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Stay
              </button>
              <button
                onClick={handleLeave}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Modal */}
      {showNavigation && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={() => setShowNavigation(false)}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "1rem 1.5rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h6 style={{ margin: 0, fontWeight: "bold", fontSize: "1rem" }}>
                📋 Quiz Navigation
              </h6>
              <button
                onClick={() => setShowNavigation(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: "0",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                {questions.map((_, idx) => {
                  const answered = answers.find(
                    (a) => a.questionId === questions[idx].id
                  );
                  return (
                    <button
                      key={idx}
                      onClick={() => jumpToQuestion(idx)}
                      style={{
                        aspectRatio: "1",
                        border: "2px solid rgba(255, 255, 255, 0.2)",
                        background:
                          currentIndex === idx
                            ? "#667eea"
                            : answered
                              ? answered.isCorrect
                                ? "#10b981"
                                : "#ef4444"
                              : "rgba(255, 255, 255, 0.05)",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        color: "#fff",
                        transition: "all 0.2s",
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div
                style={{
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {[
                  { color: "#667eea", label: "Current" },
                  { color: "#10b981", label: "Correct" },
                  { color: "#ef4444", label: "Wrong" },
                  { color: "rgba(255, 255, 255, 0.05)", label: "Unanswered" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        background: item.color,
                        border: "2px solid rgba(255, 255, 255, 0.2)",
                        flexShrink: 0,
                      }}
                    />
                    <small style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                      {item.label}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: "1.5rem",
          }}
          className="quiz-layout"
        >
          {/* Left: Question */}
          <div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "2rem",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Progress Bar */}
              <div
                style={{
                  height: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "3px",
                  marginBottom: "2rem",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {/* Question Header */}
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h5 style={{ fontWeight: "bold", margin: 0 }}>
                    Question {currentIndex + 1} of {questions.length}
                  </h5>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      background: "#667eea",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    ASL Sign
                  </span>
                </div>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>
                  What letter does this ASL sign represent?
                </p>
              </div>

              {/* Image */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  borderRadius: "12px",
                  padding: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                  border: "3px solid rgba(139, 135, 153, 0.3)",
                  marginBottom: "2rem",
                }}
              >
                <img
                  src={q.imageUrl}
                  alt={`ASL Sign ${q.id}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "280px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  }}
                />
              </div>

              {/* Options - Grid Layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
                className="options-grid"
              >
                {["a", "b", "c", "d"].map((key) => {
                  const optionKey =
                    `option${key.toUpperCase()}` as keyof Question;
                  const optionText = q[optionKey] as string;
                  const isSelected = selected === key;
                  const correctOption = optionText === q.answer;
                  const shouldShowCorrect =
                    feedback === "wrong" && correctOption;

                  let buttonStyle: React.CSSProperties = {
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "2px solid rgba(90, 109, 109, 0.5)",
                    borderRadius: "10px",
                    cursor: isAnswered ? "not-allowed" : "pointer",
                    transition: "all 0.3s",
                    textAlign: "left",
                    width: "100%",
                    color: "#fff",
                  };

                  if (feedback === "correct" && isSelected) {
                    buttonStyle = {
                      ...buttonStyle,
                      borderColor: "#10b981",
                      background:
                        "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)",
                      boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)",
                    };
                  } else if (feedback === "wrong" && isSelected) {
                    buttonStyle = {
                      ...buttonStyle,
                      borderColor: "#ef4444",
                      background:
                        "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)",
                    };
                  } else if (shouldShowCorrect) {
                    buttonStyle = {
                      ...buttonStyle,
                      borderColor: "#10b981",
                      background:
                        "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)",
                    };
                  }

                  return (
                    <button
                      key={key}
                      onClick={() => handleAnswer(key)}
                      disabled={isAnswered}
                      style={buttonStyle}
                      onMouseEnter={(e) => {
                        if (!isAnswered) {
                          e.currentTarget.style.borderColor = "#667eea";
                          e.currentTarget.style.background =
                            "rgba(102, 126, 234, 0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isAnswered && !isSelected) {
                          e.currentTarget.style.borderColor =
                            "rgba(90, 109, 109, 0.5)";
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.05)";
                        }
                      }}
                    >
                      <span
                        style={{
                          width: "36px",
                          height: "36px",
                          background:
                            feedback === "correct" && isSelected
                              ? "#10b981"
                              : feedback === "wrong" && isSelected
                                ? "#ef4444"
                                : shouldShowCorrect
                                  ? "#10b981"
                                  : "rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "0.95rem",
                          color:
                            isSelected || shouldShowCorrect
                              ? "white"
                              : "#94a3b8",
                          flexShrink: 0,
                        }}
                      >
                        {key}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: "0.95rem",
                          fontWeight: "500",
                        }}
                      >
                        {optionText}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {feedback && (
                <div
                  style={{
                    padding: "1rem 1.5rem",
                    borderRadius: "10px",
                    background:
                      feedback === "correct"
                        ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)"
                        : "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)",
                    border: `2px solid ${feedback === "correct" ? "#10b981" : "#ef4444"}`,
                    animation: showFeedbackAnimation
                      ? "feedbackPop 0.5s ease"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "2rem" }}>
                      {feedback === "correct" ? "🎉" : "😔"}
                    </span>
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {feedback === "correct"
                          ? "Amazing! That's Correct!"
                          : "Oops! Not quite right"}
                      </div>
                      <small
                        style={{
                          color: feedback === "correct" ? "#10b981" : "#ef4444",
                        }}
                      >
                        {feedback === "correct"
                          ? "Keep up the great work!"
                          : `The correct answer is: ${q.answer}`}
                      </small>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "1rem",
                marginTop: "1rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  style={{
                    padding: "0.75rem 1.25rem",
                    background:
                      currentIndex === 0
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(255, 255, 255, 0.1)",
                    color: currentIndex === 0 ? "#64748b" : "#fff",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  ← Previous
                </button>

                <button
                  onClick={() => setShowNavigation(!showNavigation)}
                  style={{
                    padding: "0.75rem 1.25rem",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  className="mobile-nav-btn"
                >
                  ⊞
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  style={{
                    flex: 1,
                    padding: "0.75rem 1.25rem",
                    background: !isAnswered
                      ? "rgba(255, 255, 255, 0.05)"
                      : currentIndex === questions.length - 1
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : "linear-gradient(135deg, #667eea, #764ba2)",
                    color: !isAnswered ? "#64748b" : "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: !isAnswered ? "not-allowed" : "pointer",
                  }}
                >
                  {currentIndex === questions.length - 1
                    ? "Finish Quiz ✓"
                    : "Next Question →"}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Navigation Panel (Desktop Only) */}
          <div className="desktop-nav">
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                position: "sticky",
                top: "1rem",
                maxHeight: "calc(100vh - 2rem)",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <h6
                  style={{ margin: 0, fontWeight: "bold", fontSize: "0.95rem" }}
                >
                  📋 Quiz Navigation
                </h6>
              </div>
              <div style={{ padding: "1rem" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "0.5rem",
                  }}
                >
                  {questions.map((_, idx) => {
                    const answered = answers.find(
                      (a) => a.questionId === questions[idx].id
                    );
                    return (
                      <button
                        key={idx}
                        onClick={() => jumpToQuestion(idx)}
                        style={{
                          aspectRatio: "1",
                          border: "2px solid rgba(255, 255, 255, 0.2)",
                          background:
                            currentIndex === idx
                              ? "#667eea"
                              : answered
                                ? answered.isCorrect
                                  ? "#10b981"
                                  : "#ef4444"
                                : "rgba(255, 255, 255, 0.05)",
                          borderRadius: "6px",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          color: "#fff",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 8px rgba(102, 126, 234, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div
                  style={{
                    marginTop: "1.5rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {[
                    { color: "#667eea", label: "Current" },
                    { color: "#10b981", label: "Correct" },
                    { color: "#ef4444", label: "Wrong" },
                    { color: "rgba(255, 255, 255, 0.05)", label: "Unanswered" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "4px",
                          background: item.color,
                          border: "2px solid rgba(255, 255, 255, 0.2)",
                          flexShrink: 0,
                        }}
                      />
                      <small style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                        {item.label}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
        @keyframes feedbackPop {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        * {
          box-sizing: border-box;
        }

        .mobile-nav-btn {
          display: none;
        }

        @media (max-width: 1024px) {
          .quiz-layout {
            grid-template-columns: 1fr !important;
          }

          .desktop-nav {
            display: none !important;
          }

          .mobile-nav-btn {
            display: block !important;
          }
       
        
        @media (max-width: 768px) {
          .options-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}
      </style>
    </div>
  );
}
