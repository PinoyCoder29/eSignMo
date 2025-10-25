"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function MainHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const getCurrentChoice = () => {
    if (pathname.startsWith("/main")) return "/main";
    if (pathname.startsWith("/fsl")) return "/fsl";
    if (pathname.startsWith("/other")) return "/other";
    return "/main";
  };

  const [selectedChoice, setSelectedChoice] = useState(getCurrentChoice());

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      );
    };
  }, []);

  useEffect(() => {
    setSelectedChoice(getCurrentChoice());
  }, [pathname]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("✅ User installed the app");
    } else {
      console.log("❌ User dismissed the install");
    }
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleChoiceSelect = (choice: string) => {
    setSelectedChoice(choice);
    router.push(choice);
  };

  const getThemeColors = () => {
    if (pathname.startsWith("/fsl")) {
      return {
        gradient: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
        glow: "rgba(6, 182, 212, 0.4)",
        badge: "#0891b2",
        light: "#06b6d4",
      };
    }
    if (pathname.startsWith("/other")) {
      return {
        gradient: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
        glow: "rgba(234, 88, 12, 0.4)",
        badge: "#ea580c",
        light: "#f97316",
      };
    }
    return {
      gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
      glow: "rgba(124, 58, 237, 0.4)",
      badge: "#7c3aed",
      light: "#a855f7",
    };
  };

  const theme = getThemeColors();

  if (!mounted) {
    return (
      <nav
        style={{
          background: "linear-gradient(135deg, #1a1f35 0%, #2d3561 100%)",
          padding: "1rem",
        }}
      >
        <div className="container">
          <div style={{ color: "white" }}>Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <div>
      {/* Desktop Navbar - Two Row Design */}
      <div className="d-none d-md-block" style={{ width: "100%" }}>
        {/* First Row - Logo and Language Selection */}
        <nav
          className="navbar navbar-expand-md shadow-lg"
          style={{
            background: scrolled
              ? "rgba(26, 31, 53, 0.95)"
              : "linear-gradient(135deg, #1a1f35 0%, #2d3561 100%)",
            backdropFilter: scrolled ? "blur(10px)" : "none",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="container">
            <div className="d-flex align-items-center justify-content-between w-100 ">
              {/* Logo/Brand */}
              <div>
                <Link
                  href={selectedChoice}
                  className="navbar-brand d-flex align-items-center text-decoration-none"
                  style={{ transition: "transform 0.3s ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: theme.gradient,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "12px",
                      boxShadow: `0 4px 15px ${theme.glow}`,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "26px",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      🤟
                    </span>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                        transform: "translateX(-100%)",
                        animation: "shimmer 3s infinite",
                      }}
                    />
                  </div>
                  <h1
                    className="m-0 fw-bold"
                    style={{
                      background: theme.gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "1.8rem",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    eSIGN Mo
                  </h1>
                </Link>
              </div>

              {/* Language Pills - Centered with mx-auto */}
              <div className="d-flex gap-2 mx-auto">
                <Link
                  href="/main"
                  className="language-pill"
                  style={{
                    padding: "0.5rem 1.2rem",
                    borderRadius: "20px",
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    display: "inline-block",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: pathname.startsWith("/main")
                      ? "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
                      : "rgba(124, 58, 237, 0.15)",
                    color: pathname.startsWith("/main")
                      ? "white"
                      : "rgba(124, 58, 237, 1)",
                    border: pathname.startsWith("/main")
                      ? "2px solid transparent"
                      : "2px solid rgba(124, 58, 237, 0.3)",
                    boxShadow: pathname.startsWith("/main")
                      ? "0 4px 15px rgba(124, 58, 237, 0.4)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!pathname.startsWith("/main")) {
                      e.currentTarget.style.background =
                        "rgba(124, 58, 237, 0.25)";
                      e.currentTarget.style.transform =
                        "translateY(-2px) scale(1.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(124, 58, 237, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!pathname.startsWith("/main")) {
                      e.currentTarget.style.background =
                        "rgba(124, 58, 237, 0.15)";
                      e.currentTarget.style.transform =
                        "translateY(0) scale(1)";
                      e.currentTarget.style.borderColor =
                        "rgba(124, 58, 237, 0.3)";
                    }
                  }}
                >
                  ASL
                </Link>
                <Link
                  href="/fsl"
                  className="language-pill"
                  style={{
                    padding: "0.5rem 1.2rem",
                    borderRadius: "20px",
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    display: "inline-block",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: pathname.startsWith("/fsl")
                      ? "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)"
                      : "rgba(8, 145, 178, 0.15)",
                    color: pathname.startsWith("/fsl")
                      ? "white"
                      : "rgba(8, 145, 178, 1)",
                    border: pathname.startsWith("/fsl")
                      ? "2px solid transparent"
                      : "2px solid rgba(8, 145, 178, 0.3)",
                    boxShadow: pathname.startsWith("/fsl")
                      ? "0 4px 15px rgba(8, 145, 178, 0.4)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!pathname.startsWith("/fsl")) {
                      e.currentTarget.style.background =
                        "rgba(8, 145, 178, 0.25)";
                      e.currentTarget.style.transform =
                        "translateY(-2px) scale(1.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(8, 145, 178, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!pathname.startsWith("/fsl")) {
                      e.currentTarget.style.background =
                        "rgba(8, 145, 178, 0.15)";
                      e.currentTarget.style.transform =
                        "translateY(0) scale(1)";
                      e.currentTarget.style.borderColor =
                        "rgba(8, 145, 178, 0.3)";
                    }
                  }}
                >
                  FSL
                </Link>
                <Link
                  href="/other"
                  className="language-pill"
                  style={{
                    padding: "0.5rem 1.2rem",
                    borderRadius: "20px",
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    display: "inline-block",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: pathname.startsWith("/other")
                      ? "linear-gradient(135deg, #ea580c 0%, #f97316 100%)"
                      : "rgba(234, 88, 12, 0.15)",
                    color: pathname.startsWith("/other")
                      ? "white"
                      : "rgba(234, 88, 12, 1)",
                    border: pathname.startsWith("/other")
                      ? "2px solid transparent"
                      : "2px solid rgba(234, 88, 12, 0.3)",
                    boxShadow: pathname.startsWith("/other")
                      ? "0 4px 15px rgba(234, 88, 12, 0.4)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!pathname.startsWith("/other")) {
                      e.currentTarget.style.background =
                        "rgba(234, 88, 12, 0.25)";
                      e.currentTarget.style.transform =
                        "translateY(-2px) scale(1.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(234, 88, 12, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!pathname.startsWith("/other")) {
                      e.currentTarget.style.background =
                        "rgba(234, 88, 12, 0.15)";
                      e.currentTarget.style.transform =
                        "translateY(0) scale(1)";
                      e.currentTarget.style.borderColor =
                        "rgba(234, 88, 12, 0.3)";
                    }
                  }}
                >
                  Other
                </Link>
              </div>

              {/* Empty space on right to balance the layout */}
              <div style={{ width: "200px" }}></div>
            </div>
          </div>
        </nav>

        {/* Second Row - Navigation Links aligned to right */}
        <nav
          className="navbar navbar-expand-md"
          style={{
            background: scrolled
              ? "rgba(35, 41, 70, 0.95)"
              : "linear-gradient(135deg, #2d3561 0%, #1a1f35 100%)",
            backdropFilter: scrolled ? "blur(10px)" : "none",
            borderBottom: `3px solid ${theme.badge}`,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="container">
            <div className="d-flex justify-content-end w-100 ">
              <ul className="navbar-nav d-flex flex-row gap-1 align-items-center mb-0">
                <li className="nav-item">
                  <Link
                    href={selectedChoice}
                    className="nav-link position-relative"
                    style={{
                      color:
                        pathname === selectedChoice
                          ? "white"
                          : "rgba(255, 255, 255, 0.8)",
                      fontWeight: pathname === selectedChoice ? "700" : "600",
                      fontSize: "1rem",
                      padding: "0.5rem 1.2rem",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.light;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color =
                        pathname === selectedChoice
                          ? "white"
                          : "rgba(255, 255, 255, 0.8)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Home
                    {pathname === selectedChoice && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "60%",
                          height: "3px",
                          background: theme.gradient,
                          borderRadius: "2px",
                          boxShadow: `0 2px 8px ${theme.glow}`,
                        }}
                      />
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href={`/asl/test`}
                    className="nav-link position-relative"
                    style={{
                      color: pathname.includes("/translate")
                        ? "white"
                        : "rgba(255, 255, 255, 0.8)",
                      fontWeight: pathname.includes("/translate")
                        ? "700"
                        : "600",
                      fontSize: "1rem",
                      padding: "0.5rem 1.2rem",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.light;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = pathname.includes(
                        "/translate"
                      )
                        ? "white"
                        : "rgba(255, 255, 255, 0.8)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Translate
                    {pathname.includes("/translate") && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "60%",
                          height: "3px",
                          background: theme.gradient,
                          borderRadius: "2px",
                          boxShadow: `0 2px 8px ${theme.glow}`,
                        }}
                      />
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href={`${selectedChoice}/learn`}
                    className="nav-link position-relative"
                    style={{
                      color: pathname.includes("/learn")
                        ? "white"
                        : "rgba(255, 255, 255, 0.8)",
                      fontWeight: pathname.includes("/learn") ? "700" : "600",
                      fontSize: "1rem",
                      padding: "0.5rem 1.2rem",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.light;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = pathname.includes("/learn")
                        ? "white"
                        : "rgba(255, 255, 255, 0.8)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Learn
                    {pathname.includes("/learn") && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "60%",
                          height: "3px",
                          background: theme.gradient,
                          borderRadius: "2px",
                          boxShadow: `0 2px 8px ${theme.glow}`,
                        }}
                      />
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href={`${selectedChoice}/about`}
                    className="nav-link position-relative"
                    style={{
                      color: pathname.includes("/about")
                        ? "white"
                        : "rgba(255, 255, 255, 0.8)",
                      fontWeight: pathname.includes("/about") ? "700" : "600",
                      fontSize: "1rem",
                      padding: "0.5rem 1.2rem",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.light;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = pathname.includes("/about")
                        ? "white"
                        : "rgba(255, 255, 255, 0.8)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    About Us
                    {pathname.includes("/about") && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "60%",
                          height: "3px",
                          background: theme.gradient,
                          borderRadius: "2px",
                          boxShadow: `0 2px 8px ${theme.glow}`,
                        }}
                      />
                    )}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Top Navbar */}
      <nav
        className="navbar shadow-lg d-md-none"
        style={{
          background: "linear-gradient(135deg, #1a1f35 0%, #2d3561 100%)",
          borderBottom: `3px solid ${theme.badge}`,
        }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div
              style={{
                width: "40px",
                height: "40px",
                background: theme.gradient,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
                boxShadow: `0 4px 12px ${theme.glow}`,
              }}
            >
              <span style={{ fontSize: "20px" }}>🤟</span>
            </div>
            <h5 className="m-0 fw-bold text-white">eSIGN Mo</h5>
          </div>

          <div className="dropdown">
            <button
              className="btn dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                background: theme.gradient,
                color: "white",
                border: "none",
                padding: "0.5rem 1.2rem",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "0.9rem",
                boxShadow: `0 4px 12px ${theme.glow}`,
              }}
            >
              {selectedChoice === "/main" && "ASL"}
              {selectedChoice === "/fsl" && "FSL"}
              {selectedChoice === "/other" && "Other"}
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton"
              style={{
                background: "#1a1f35",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "0.5rem",
              }}
            >
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleChoiceSelect("/main")}
                  style={{
                    background:
                      selectedChoice === "/main"
                        ? "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
                        : "transparent",
                    color: "white",
                    borderRadius: "8px",
                    padding: "0.6rem 1rem",
                    marginBottom: "0.3rem",
                    fontWeight: selectedChoice === "/main" ? "700" : "500",
                  }}
                >
                  ASL
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleChoiceSelect("/fsl")}
                  style={{
                    background:
                      selectedChoice === "/fsl"
                        ? "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)"
                        : "transparent",
                    color: "white",
                    borderRadius: "8px",
                    padding: "0.6rem 1rem",
                    marginBottom: "0.3rem",
                    fontWeight: selectedChoice === "/fsl" ? "700" : "500",
                  }}
                >
                  FSL
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleChoiceSelect("/other")}
                  style={{
                    background:
                      selectedChoice === "/other"
                        ? "linear-gradient(135deg, #ea580c 0%, #f97316 100%)"
                        : "transparent",
                    color: "white",
                    borderRadius: "8px",
                    padding: "0.6rem 1rem",
                    fontWeight: selectedChoice === "/other" ? "700" : "500",
                  }}
                >
                  Other
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar - Spaced with Home centered */}
      <nav
        className="navbar fixed-bottom shadow-lg d-md-none"
        style={{
          background: "linear-gradient(135deg, #1a1f35 0%, #2d3561 100%)",
          borderTop: `3px solid ${theme.badge}`,
          padding: "0.2rem 0",
          zIndex: 1030,
        }}
      >
        <div className="container">
          <div className="d-flex justify-content-around align-items-center w-100">
            <Link
              href={`/asl/signToText`}
              className="nav-icon-btn"
              style={{
                textDecoration: "none",
                padding: "0.6rem 0.5rem",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                background: pathname.includes("/signToText")
                  ? theme.gradient
                  : "transparent",
                color: pathname.includes("/signToText")
                  ? "white"
                  : "rgba(255, 255, 255, 0.6)",
                transition: "all 0.3s ease",
                boxShadow: pathname.includes("/signToText")
                  ? `0 4px 12px ${theme.glow}`
                  : "none",
                flex: "0 0 60px",
              }}
            >
              <i
                className="bi bi-hand-index-thumb"
                style={{ fontSize: "1.4rem" }}
              ></i>
              <span style={{ fontSize: "0.65rem", fontWeight: "600" }}>
                Sign
              </span>
            </Link>

            <Link
              href={`${selectedChoice}/speech-to-sign`}
              className="nav-icon-btn"
              style={{
                textDecoration: "none",
                padding: "0.6rem 0.5rem",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                background: pathname.includes("/speech-to-sign")
                  ? theme.gradient
                  : "transparent",
                color: pathname.includes("/speech-to-sign")
                  ? "white"
                  : "rgba(255, 255, 255, 0.6)",
                transition: "all 0.3s ease",
                boxShadow: pathname.includes("/speech-to-sign")
                  ? `0 4px 12px ${theme.glow}`
                  : "none",
                flex: "0 0 60px",
              }}
            >
              <i className="bi bi-mic-fill" style={{ fontSize: "1.4rem" }}></i>
              <span style={{ fontSize: "0.65rem", fontWeight: "600" }}>
                Speech
              </span>
            </Link>

            <Link
              href={selectedChoice}
              className="nav-icon-btn"
              style={{
                textDecoration: "none",
                padding: "0.6rem 0.5rem",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                background:
                  pathname === selectedChoice ? theme.gradient : "transparent",
                color:
                  pathname === selectedChoice
                    ? "white"
                    : "rgba(255, 255, 255, 0.6)",
                transition: "all 0.3s ease",
                boxShadow:
                  pathname === selectedChoice
                    ? `0 4px 12px ${theme.glow}`
                    : "none",
                flex: "0 0 60px",
              }}
            >
              <i
                className="bi bi-house-door-fill"
                style={{ fontSize: "1.4rem" }}
              ></i>
              <span style={{ fontSize: "0.65rem", fontWeight: "600" }}>
                Home
              </span>
            </Link>

            <Link
              href={`/asl/test`}
              className="nav-icon-btn"
              style={{
                textDecoration: "none",
                padding: "0.6rem 0.5rem",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                background: pathname.includes("/test")
                  ? theme.gradient
                  : "transparent",
                color: pathname.includes("/test")
                  ? "white"
                  : "rgba(255, 255, 255, 0.6)",
                transition: "all 0.3s ease",
                boxShadow: pathname.includes("/test")
                  ? `0 4px 12px ${theme.glow}`
                  : "none",
                flex: "0 0 60px",
              }}
            >
              <i
                className="bi bi-clipboard-check"
                style={{ fontSize: "1.4rem" }}
              ></i>
              <span style={{ fontSize: "0.65rem", fontWeight: "600" }}>
                Test
              </span>
            </Link>

            <Link
              href={`${selectedChoice}/learn`}
              className="nav-icon-btn"
              style={{
                textDecoration: "none",
                padding: "0.6rem 0.5rem",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.2rem",
                background: pathname.includes("/learn")
                  ? theme.gradient
                  : "transparent",
                color: pathname.includes("/learn")
                  ? "white"
                  : "rgba(255, 255, 255, 0.6)",
                transition: "all 0.3s ease",
                boxShadow: pathname.includes("/learn")
                  ? `0 4px 12px ${theme.glow}`
                  : "none",
                flex: "0 0 60px",
              }}
            >
              <i className="bi bi-book" style={{ fontSize: "1.4rem" }}></i>
              <span style={{ fontSize: "0.65rem", fontWeight: "600" }}>
                Learn
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Install App Button */}
      {showInstall && (
        <button
          onClick={handleInstallClick}
          className="btn position-fixed d-none d-md-block"
          style={{
            bottom: "20px",
            right: "20px",
            zIndex: 1050,
            background: theme.gradient,
            color: "white",
            border: "none",
            padding: "0.8rem 1.8rem",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "0.95rem",
            boxShadow: `0 8px 24px ${theme.glow}`,
            animation: "pulseBtn 2s ease-in-out infinite",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
            e.currentTarget.style.boxShadow = `0 12px 32px ${theme.glow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = `0 8px 24px ${theme.glow}`;
          }}
        >
          📲 Install App
        </button>
      )}

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes pulseBtn {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @media (max-width: 767.98px) {
          body {
            padding-bottom: 85px !important;
          }

          main > section:last-child,
          main > div:last-child {
            padding-bottom: 2rem !important;
          }
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #1a1f35;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
        }
      `}</style>

      <style jsx>{`
        .nav-link {
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: ${theme.gradient};
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }

        .nav-link:hover::before {
          width: 80%;
        }

        .language-pill {
          position: relative;
          overflow: hidden;
        }

        .language-pill::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition:
            width 0.4s ease,
            height 0.4s ease;
        }

        .language-pill:hover::after {
          width: 100%;
          height: 100%;
        }

        .nav-icon-btn:active {
          transform: scale(0.95);
        }

        .dropdown-item {
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateX(5px);
        }

        .navbar-brand {
          filter: drop-shadow(0 4px 12px ${theme.glow});
        }

        @media (max-width: 768px) {
          .nav-icon-btn {
            min-width: 55px;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .navbar {
          animation: fadeIn 0.5s ease;
        }

        .nav-link,
        .language-pill,
        .nav-icon-btn {
          position: relative;
          overflow: hidden;
        }

        .nav-link::after,
        .language-pill::after,
        .nav-icon-btn::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: translate(-50%, -50%);
          transition:
            width 0.6s,
            height 0.6s;
        }

        .nav-link:active::after,
        .language-pill:active::after,
        .nav-icon-btn:active::after {
          width: 200px;
          height: 200px;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
