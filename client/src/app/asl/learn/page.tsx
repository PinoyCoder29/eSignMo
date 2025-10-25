"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  Search,
  BookOpen,
  MessageSquare,
  Grid3x3,
  ChevronLeft,
  ChevronRight,
  Play,
  Share2,
  BookMarked,
  Zap,
} from "lucide-react";

// ==================== TYPES ====================
interface Lesson {
  id: string;
  title: string;
  category: "alphabet" | "common-words" | "phrases" | "grammar";
  imageUrl: string;
  videoUrl?: string;
  description: string;
  exampleSentence?: string;
  order: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimatedTime?: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  gradient: string;
  totalLessons: number;
}

// ==================== MOCK DATA ====================
const categories: Category[] = [
  {
    id: "alphabet",
    name: "ASL Alphabet",
    icon: <Grid3x3 size={32} />,
    description:
      "Master all 26 letters of the ASL alphabet through interactive lessons",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    totalLessons: 26,
  },
  {
    id: "common-words",
    name: "Common Words",
    icon: <MessageSquare size={32} />,
    description:
      "Learn essential everyday signs and expressions used in daily conversations",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    totalLessons: 50,
  },
  {
    id: "phrases",
    name: "Phrases",
    icon: <BookOpen size={32} />,
    description:
      "Practice useful conversational phrases for real-world communication",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    totalLessons: 30,
  },
  {
    id: "grammar",
    name: "Grammar Rules",
    icon: <BookMarked size={32} />,
    description: "Understand ASL grammar structure and linguistic fundamentals",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    totalLessons: 20,
  },
];

const mockLessons: Lesson[] = [
  // Alphabet
  {
    id: "a1",
    title: "Letter A",
    category: "alphabet",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop",
    description: "Make a fist with your thumb resting on the side",
    difficulty: "beginner",
    estimatedTime: 2,
    order: 1,
  },
  {
    id: "a2",
    title: "Letter B",
    category: "alphabet",
    imageUrl:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop",
    description:
      "Hold your fingers together pointing up with thumb across palm",
    difficulty: "beginner",
    estimatedTime: 2,
    order: 2,
  },
  {
    id: "a3",
    title: "Letter C",
    category: "alphabet",
    imageUrl:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop",
    description: "Curve your hand to form the letter C",
    difficulty: "beginner",
    estimatedTime: 2,
    order: 3,
  },
  {
    id: "a4",
    title: "Letter D",
    category: "alphabet",
    imageUrl:
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=400&fit=crop",
    description: "Point your index finger up while other fingers touch thumb",
    difficulty: "beginner",
    estimatedTime: 2,
    order: 4,
  },
  {
    id: "a5",
    title: "Letter E",
    category: "alphabet",
    imageUrl:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=400&fit=crop",
    description: "Curl fingers over thumb in a fist",
    difficulty: "beginner",
    estimatedTime: 2,
    order: 5,
  },
  {
    id: "a6",
    title: "Letter F",
    category: "alphabet",
    imageUrl:
      "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400&h=400&fit=crop",
    description: "Touch index finger and thumb while other fingers point up",
    difficulty: "beginner",
    estimatedTime: 2,
    order: 6,
  },

  // Common Words
  {
    id: "w1",
    title: "Hello",
    category: "common-words",
    imageUrl:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop",
    description: "A friendly greeting sign - wave your hand near your forehead",
    exampleSentence: "Hello, nice to meet you!",
    difficulty: "beginner",
    estimatedTime: 3,
    order: 1,
  },
  {
    id: "w2",
    title: "Thank You",
    category: "common-words",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
    description: "Touch your chin and move hand forward",
    exampleSentence: "Thank you for your help!",
    difficulty: "beginner",
    estimatedTime: 3,
    order: 2,
  },
  {
    id: "w3",
    title: "Please",
    category: "common-words",
    imageUrl:
      "https://images.unsplash.com/photo-1542435503-956c469947f6?w=400&h=400&fit=crop",
    description: "Circular motion on chest with flat hand",
    exampleSentence: "Please help me.",
    difficulty: "beginner",
    estimatedTime: 3,
    order: 3,
  },
  {
    id: "w4",
    title: "Sorry",
    category: "common-words",
    imageUrl:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop",
    description: "Make a fist and rub chest in circular motion",
    exampleSentence: "I am sorry for being late.",
    difficulty: "beginner",
    estimatedTime: 3,
    order: 4,
  },
  {
    id: "w5",
    title: "Yes",
    category: "common-words",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop",
    description: "Nod your fist like a head nodding",
    exampleSentence: "Yes, I understand.",
    difficulty: "beginner",
    estimatedTime: 2,
    order: 5,
  },
  {
    id: "w6",
    title: "No",
    category: "common-words",
    imageUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop",
    description: "Snap index and middle finger with thumb",
    exampleSentence: "No, I disagree.",
    difficulty: "beginner",
    estimatedTime: 2,
    order: 6,
  },

  // Phrases
  {
    id: "p1",
    title: "How are you?",
    category: "phrases",
    imageUrl:
      "https://images.unsplash.com/photo-1551135049-8a33b5883817?w=400&h=400&fit=crop",
    description: "Common greeting phrase in ASL",
    difficulty: "intermediate",
    estimatedTime: 5,
    order: 1,
  },
  {
    id: "p2",
    title: "My name is...",
    category: "phrases",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=400&fit=crop",
    description: "Introduce yourself in ASL",
    difficulty: "intermediate",
    estimatedTime: 5,
    order: 2,
  },
  {
    id: "p3",
    title: "Nice to meet you",
    category: "phrases",
    imageUrl:
      "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=400&h=400&fit=crop",
    description: "Polite phrase for first meetings",
    difficulty: "intermediate",
    estimatedTime: 5,
    order: 3,
  },

  // Grammar
  {
    id: "g1",
    title: "Facial Expressions",
    category: "grammar",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=400&fit=crop",
    description: "Understanding the role of facial expressions in ASL grammar",
    difficulty: "advanced",
    estimatedTime: 10,
    order: 1,
  },
  {
    id: "g2",
    title: "Word Order",
    category: "grammar",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop",
    description: "Learn ASL sentence structure (Subject-Verb-Object)",
    difficulty: "advanced",
    estimatedTime: 10,
    order: 2,
  },
];

// ==================== COMPONENTS ====================

// Search Bar Component
const SearchBar: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div className="position-relative mb-4">
    <div
      className="input-group input-group-lg"
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <span className="input-group-text bg-transparent border-0">
        <Search size={24} style={{ color: "rgba(255, 255, 255, 0.6)" }} />
      </span>
      <input
        type="text"
        className="form-control border-0 ps-0"
        placeholder="Search for signs, words, or phrases..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontSize: "1.1rem",
          background: "transparent",
          color: "white",
        }}
      />
    </div>
  </div>
);

// Category Card Component
const CategoryCard: React.FC<{
  category: Category;
  onClick: () => void;
}> = ({ category, onClick }) => (
  <div className="col-lg-6 mb-4">
    <div
      className="card border-0 h-100 category-card"
      onClick={onClick}
      style={{
        borderRadius: "20px",
        background: category.gradient,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
      <div className="card-body p-4" style={{ position: "relative" }}>
        <div className="d-flex align-items-start">
          <div
            className="me-3"
            style={{
              width: "64px",
              height: "64px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ color: "white" }}>{category.icon}</div>
          </div>
          <div className="flex-grow-1">
            <h5
              className="fw-bold mb-2 text-white"
              style={{ fontSize: "1.4rem" }}
            >
              {category.name}
            </h5>
            <p
              className="mb-3"
              style={{
                fontSize: "0.95rem",
                lineHeight: "1.6",
                color: "rgba(255, 255, 255, 0.85)",
              }}
            >
              {category.description}
            </p>
            <div className="d-flex align-items-center justify-content-between">
              <span
                className="text-white"
                style={{ fontSize: "0.9rem", opacity: 0.8 }}
              >
                📚 {category.totalLessons} Lessons
              </span>
              <button
                className="btn btn-sm"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  color: category.color,
                  border: "none",
                  padding: "0.6rem 1.5rem",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  borderRadius: "10px",
                  letterSpacing: "0.3px",
                }}
              >
                Explore →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Lesson Card Component
const LessonCard: React.FC<{
  lesson: Lesson;
  onClick: () => void;
}> = ({ lesson, onClick }) => {
  const difficultyColors = {
    beginner: "#10B981",
    intermediate: "#F59E0B",
    advanced: "#EF4444",
  };

  return (
    <div className="col-md-6 col-lg-4 col-xl-3 mb-4">
      <div
        className="card border-0 h-100 lesson-card position-relative"
        onClick={onClick}
        style={{
          cursor: "pointer",
          overflow: "hidden",
          transition: "all 0.3s ease",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          background: "#1a1f2e",
        }}
      >
        <div
          style={{
            position: "relative",
            paddingTop: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={lesson.imageUrl}
            className="position-absolute top-0 start-0 w-100 h-100"
            alt={lesson.title}
            style={{ objectFit: "cover" }}
          />
          <div
            className="position-absolute bottom-0 start-0 w-100 p-2"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
            }}
          >
            <span
              className="badge text-white"
              style={{
                backgroundColor:
                  difficultyColors[lesson.difficulty || "beginner"],
              }}
            >
              {lesson.difficulty || "beginner"}
            </span>
          </div>
        </div>

        <div className="card-body">
          <h6 className="card-title fw-bold mb-2 text-white">{lesson.title}</h6>
          <p
            className="card-text mb-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            {lesson.description}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <span
              className="small"
              style={{ color: "rgba(255, 255, 255, 0.5)" }}
            >
              <Zap size={14} className="me-1" />
              {lesson.estimatedTime} min
            </span>
            <span className="small fw-bold" style={{ color: "#06b6d4" }}>
              Learn →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lesson Detail Component
const LessonDetail: React.FC<{
  lesson: Lesson;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  currentIndex: number;
  totalLessons: number;
}> = ({
  lesson,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  currentIndex,
  totalLessons,
}) => {
  const [showVideo, setShowVideo] = useState(false);

  const difficultyColors = {
    beginner: "#10B981",
    intermediate: "#F59E0B",
    advanced: "#EF4444",
  };

  return (
    <div
      className="card border-0 shadow-lg"
      style={{ borderRadius: "20px", background: "#1a1f2e" }}
    >
      <div className="card-body p-0">
        {/* Header */}
        <div
          className="p-4 border-bottom"
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <div className="d-flex justify-content-between align-items-center text-white">
            <div>
              <span className="badge bg-white bg-opacity-25 mb-2">
                Lesson {currentIndex + 1} of {totalLessons}
              </span>
              <h2 className="mb-0 fw-bold">{lesson.title}</h2>
            </div>
            <div>
              <span
                className="badge"
                style={{
                  backgroundColor:
                    difficultyColors[lesson.difficulty || "beginner"],
                  fontSize: "1rem",
                  padding: "0.5rem 1rem",
                }}
              >
                {lesson.difficulty || "beginner"}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="row g-0">
          {/* Left: Image/Video */}
          <div className="col-lg-6 p-4" style={{ background: "#141824" }}>
            <div
              className="position-relative mb-3"
              style={{ borderRadius: "12px", overflow: "hidden" }}
            >
              <Image
                src={lesson.imageUrl}
                className="img-fluid w-100"
                alt={lesson.title}
                style={{ aspectRatio: "1/1", objectFit: "cover" }}
              />
            </div>

            {lesson.videoUrl && (
              <button
                className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
                onClick={() => setShowVideo(!showVideo)}
                style={{
                  borderRadius: "10px",
                  background: "#06b6d4",
                  border: "none",
                }}
              >
                <Play size={24} />
                {showVideo ? "Hide Video" : "Play Video Tutorial"}
              </button>
            )}

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light flex-fill"
                style={{ borderRadius: "10px" }}
              >
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>

          {/* Right: Details */}
          <div className="col-lg-6 p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Zap size={20} className="text-warning" />
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Estimated time:{" "}
                <strong className="text-white">
                  {lesson.estimatedTime} minutes
                </strong>
              </span>
            </div>

            <h5 className="fw-bold mb-3 text-white">Description</h5>
            <p
              className="mb-4"
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.8",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              {lesson.description}
            </p>

            {lesson.exampleSentence && (
              <div
                className="alert border-0 mb-4"
                style={{
                  backgroundColor: "rgba(6, 182, 212, 0.1)",
                  borderRadius: "12px",
                  borderLeft: "4px solid #06b6d4",
                }}
              >
                <h6 className="fw-bold mb-2 text-white">Example Sentence</h6>
                <p
                  className="mb-0 fst-italic"
                  style={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  <p>{`"${lesson.exampleSentence}"`}</p>
                </p>
              </div>
            )}

            <div
              className="card border-0 p-3 mb-4"
              style={{ borderRadius: "12px", background: "#141824" }}
            >
              <h6 className="fw-bold mb-3 text-white">Learning Tips</h6>
              <ul
                className="mb-0 ps-3"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                <li className="mb-2">
                  Practice the hand shape slowly at first
                </li>
                <li className="mb-2">Watch your hand position in a mirror</li>
                <li className="mb-2">Repeat 10-15 times for muscle memory</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div
          className="p-4 border-top"
          style={{ borderRadius: "0 0 20px 20px", background: "#141824" }}
        >
          <div className="row align-items-center">
            <div className="col">
              <button
                className="btn btn-outline-light"
                onClick={onPrevious}
                disabled={!hasPrevious}
                style={{ borderRadius: "10px" }}
              >
                <ChevronLeft size={20} /> Previous Lesson
              </button>
            </div>
            <div className="col-auto">
              <div
                className="progress"
                style={{
                  width: "200px",
                  height: "8px",
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <div
                  className="progress-bar"
                  style={{
                    width: `${((currentIndex + 1) / totalLessons) * 100}%`,
                    background: "#06b6d4",
                  }}
                />
              </div>
            </div>
            <div className="col text-end">
              <button
                className="btn btn-light"
                onClick={onNext}
                disabled={!hasNext}
                style={{ borderRadius: "10px" }}
              >
                Next Lesson <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
const Learn: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "category" | "lesson"
  >("dashboard");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getCategoryLessons = (categoryId: string) => {
    return mockLessons
      .filter((l) => l.category === categoryId)
      .sort((a, b) => a.order - b.order);
  };

  const filteredLessons = mockLessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ==================== DASHBOARD PAGE ====================
  if (currentPage === "dashboard") {
    return (
      <div style={{ minHeight: "100vh", background: "#0f1117" }}>
        {/* Hero Section */}

        {/* Main Content */}
        <div className="py-5">
          <div className="container" style={{ maxWidth: "1140px" }}>
            {/* Row with badge and search bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center", // Pantay na pantay
                justifyContent: "space-between",
                gap: "0.6rem",
                flexWrap: "wrap",
              }}
            >
              {/* Badge */}
              <span
                className="badge"
                style={{
                  background: "rgba(6, 182, 212, 0.2)",
                  color: "#67e8f9",
                  padding: "0.8rem 1.2rem",
                  borderRadius: "25px",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  letterSpacing: "0.5px",
                  margin: 0, // siguraduhing walang margin
                  transform: "translateY(-12px)",
                }}
              >
                ✨ INTERACTIVE LEARNING PLATFORM
              </span>

              {/* SearchBar */}
              <div style={{ flex: "1", maxWidth: "400px" }}>
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
            </div>

            {searchQuery ? (
              // Search Results
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold mb-0 text-white">Search Results</h3>
                  <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    {filteredLessons.length} lessons found
                  </span>
                </div>

                {filteredLessons.length > 0 ? (
                  <div className="row">
                    {filteredLessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setSelectedCategory(lesson.category);
                          setCurrentPage("lesson");
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <Search
                      size={64}
                      style={{ color: "rgba(255, 255, 255, 0.3)" }}
                    />
                    <h4
                      style={{ color: "rgba(255, 255, 255, 0.6)" }}
                      className="mt-3"
                    >
                      No lessons found
                    </h4>
                    <p style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                      Try a different search term
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Learning Categories */}
                <div className="mb-5">
                  <div className="mb-4">
                    <h2 className="h4 fw-bold text-white mb-2">
                      Browse Learning Categories
                    </h2>
                    <p style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Choose a category to start your ASL learning journey
                    </p>
                  </div>
                  <div className="row">
                    {categories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setCurrentPage("category");
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <style jsx>{`
          .category-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .category-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
          }

          .lesson-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.4) !important;
          }

          input::placeholder {
            color: rgba(255, 255, 255, 0.4);
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
          }
        `}</style>
      </div>
    );
  }

  // ==================== CATEGORY PAGE ====================
  if (currentPage === "category" && selectedCategory) {
    const category = categories.find((c) => c.id === selectedCategory)!;
    const lessons = getCategoryLessons(selectedCategory);

    return (
      <div style={{ minHeight: "100vh", background: "#0f1117" }}>
        {/* Category Header */}
        <div
          style={{
            background: category.gradient,
            padding: "1rem 0 4rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative Background Elements */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "250px",
              height: "250px",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              left: "-30px",
              width: "180px",
              height: "180px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "50%",
              filter: "blur(30px)",
            }}
          />

          <div
            className="container"
            style={{ maxWidth: "1140px", position: "relative" }}
          >
            {/* Back Button */}
            <button
              className="btn btn-light mb-1"
              onClick={() => setCurrentPage("dashboard")}
              style={{
                borderRadius: "10px",
                fontWeight: "600",
                border: "none",
                padding: "0.6rem 1.2rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <ChevronLeft size={18} style={{ marginRight: "4px" }} /> Back
            </button>

            {/* Main Content */}
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-7 col-8">
                <div className="d-flex align-items-center mb-">
                  {/* Icon */}
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ color: "white", fontSize: "1.5rem" }}>
                      {category.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h2
                      className="fw-bold mb-1 text-white"
                      style={{
                        fontSize: "2rem",
                        letterSpacing: "-0.5px",
                        lineHeight: "1.2",
                      }}
                    >
                      {category.name}
                    </h2>
                    <p
                      className="mb-0 text-white"
                      style={{
                        opacity: 0.85,
                        fontSize: "0.95rem",
                        fontWeight: "400",
                      }}
                    >
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Lessons Card - Right Side */}
              <div className="col-lg-4 col-md-5 col-4">
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "16px",
                    padding: "0.3rem",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "800",
                      color: "white",
                      lineHeight: "1",
                      marginBottom: "",
                      textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {lessons.length}
                  </div>
                  <div
                    style={{
                      color: "white",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      opacity: 0.9,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Lessons
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-5" style={{ maxWidth: "1140px" }}>
          {/* Action Bar */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold mb-0 text-white">All Lessons</h3>
              <p className="mb-0" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                {lessons.length} lessons available
              </p>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="row">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onClick={() => {
                  setSelectedLesson(lesson);
                  setCurrentPage("lesson");
                }}
              />
            ))}
          </div>

          {lessons.length === 0 && (
            <div className="text-center py-5">
              <BookOpen
                size={64}
                style={{ color: "rgba(255, 255, 255, 0.3)" }}
              />
              <h4
                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                className="mt-3"
              >
                No lessons available
              </h4>
              <p style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                Check back soon for new content!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== LESSON DETAIL PAGE ====================
  if (currentPage === "lesson" && selectedLesson && selectedCategory) {
    const lessons = getCategoryLessons(selectedCategory);
    const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
    const category = categories.find((c) => c.id === selectedCategory)!;

    return (
      <div style={{ minHeight: "100vh", background: "#0f1117" }}>
        <div className="container py-5" style={{ maxWidth: "1140px" }}>
          <button
            className="btn btn-light mb-4"
            onClick={() => setCurrentPage("category")}
            style={{ borderRadius: "10px", fontWeight: "600" }}
          >
            <ChevronLeft size={20} /> Back to {category.name}
          </button>

          <LessonDetail
            lesson={selectedLesson}
            onPrevious={() => setSelectedLesson(lessons[currentIndex - 1])}
            onNext={() => setSelectedLesson(lessons[currentIndex + 1])}
            hasPrevious={currentIndex > 0}
            hasNext={currentIndex < lessons.length - 1}
            currentIndex={currentIndex}
            totalLessons={lessons.length}
          />

          {/* Related Lessons */}
          <div className="mt-5">
            <h4 className="fw-bold mb-4 text-white">Related Lessons</h4>
            <div className="row">
              {lessons
                .filter((l) => l.id !== selectedLesson.id)
                .slice(0, 4)
                .map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onClick={() => setSelectedLesson(lesson)}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Learn;
