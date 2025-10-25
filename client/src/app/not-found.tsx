"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1f35 0%, #2d3561 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "2rem",
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          top: "10%",
          left: "10%",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          bottom: "15%",
          right: "15%",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* 404 Number with Glow Effect */}
        <div
          style={{
            position: "relative",
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(6rem, 15vw, 12rem)",
              fontWeight: "900",
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
              letterSpacing: "-0.05em",
              textShadow: "0 0 80px rgba(124, 58, 237, 0.5)",
              animation: "pulse 3s ease-in-out infinite",
            }}
          >
            404
          </h1>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              background:
                "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)",
              filter: "blur(40px)",
              zIndex: -1,
            }}
          />
        </div>

        {/* Error Message Card */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            padding: "2.5rem",
            marginBottom: "2rem",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
                animation: "bounce 2s ease-in-out infinite",
              }}
            >
              <span style={{ fontSize: "2.5rem" }}>🤷</span>
            </div>
          </div>

          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "white",
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Oops! Page Not Found
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: "1.6",
              marginBottom: "0",
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            <br />
            Let&apos;s get you back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 2rem",
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              color: "white",
              textDecoration: "none",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "1rem",
              boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 12px 32px rgba(124, 58, 237, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(124, 58, 237, 0.4)";
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>🏠</span>
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 2rem",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              textDecoration: "none",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "1rem",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>←</span>
            Go Back
          </button>
        </div>

        {/* Additional Help Links */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <p
            style={{
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.5)",
              marginBottom: "1rem",
            }}
          >
            Need help? Try these popular pages:
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/asl"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                fontSize: "0.9rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                background: "rgba(255, 255, 255, 0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#a855f7";
                e.currentTarget.style.background = "rgba(168, 85, 247, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              }}
            >
              ASL
            </Link>
            <Link
              href="/fsl"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                fontSize: "0.9rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                background: "rgba(255, 255, 255, 0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#06b6d4";
                e.currentTarget.style.background = "rgba(6, 182, 212, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              }}
            >
              FSL
            </Link>
            <Link
              href="/other"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                fontSize: "0.9rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                background: "rgba(255, 255, 255, 0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#f97316";
                e.currentTarget.style.background = "rgba(249, 115, 22, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              }}
            >
              Other
            </Link>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
