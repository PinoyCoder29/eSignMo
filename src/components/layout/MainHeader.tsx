"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function MainHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Determine current selected choice based on pathname
  const getCurrentChoice = () => {
    if (pathname.startsWith("/asl")) return "/asl";
    if (pathname.startsWith("/fsl")) return "/fsl";
    if (pathname.startsWith("/other")) return "/other";
    return "/asl"; // default
  };

  const [selectedChoice, setSelectedChoice] = useState("/asl");

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Update selected choice when pathname changes
  useEffect(() => {
    const choice = getCurrentChoice();
    setSelectedChoice(choice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Handle dropdown selection and navigate
  const handleChoiceSelect = (choice: string) => {
    setSelectedChoice(choice);
    router.push(choice);
  };

  if (!mounted) {
    return (
      <nav className="navbar navbar-light bg-light shadow">
        <div className="container">Loading...</div>
      </nav>
    );
  }

  return (
    <div>
      {/* Desktop Navbar */}
      <nav
        className="navbar navbar-expand-md navbar-light shadow d-none d-md-block"
        style={{
          backgroundColor: pathname.startsWith("/fsl")
            ? "skyblue"
            : pathname.startsWith("/other")
            ? "#ff9800"
            : "#599636ff",
        }}
      >
        <div className="container">
          <div className="collapse navbar-collapse show">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link
                  href="/asl"
                  className={`nav-link fw-bold fs-5 ${
                    pathname.startsWith("/asl") ? "active text-white" : "text-dark"
                  }`}
                >
                  ASL
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/fsl"
                  className={`nav-link fw-bold fs-5 ${
                    pathname.startsWith("/fsl") ? "active text-white" : "text-dark"
                  }`}
                >
                  FSL
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/other"
                  className={`nav-link fw-bold fs-5 ${
                    pathname.startsWith("/other") ? "active text-white" : "text-dark"
                  }`}
                >
                  Other
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Top Navbar with eSIGN Mo + Dropdown */}
      <nav 
        className="navbar navbar-light shadow d-md-none"
        style={{
          backgroundColor: pathname.startsWith("/fsl")
            ? "skyblue"
            : pathname.startsWith("/other")
            ? "#ff9800"
            : "#599636ff",
        }}
      >
        <div className="container d-flex justify-content-between">
          <h5 className="m-0 fw-bold text-white">eSIGN Mo</h5>
          <div className="dropdown">
            <button
              className="btn btn-outline-light dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedChoice === "/asl" && "ASL"}
              {selectedChoice === "/fsl" && "FSL"}
              {selectedChoice === "/other" && "Other"}
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton"
            >
              <li>
                <button
                  className={`dropdown-item ${
                    selectedChoice === "/asl" ? "active bg-success text-white" : ""
                  }`}
                  onClick={() => handleChoiceSelect("/asl")}
                >
                  ASL
                </button>
              </li>
              <li>
                <button
                  className={`dropdown-item ${
                    selectedChoice === "/fsl" ? "active bg-success text-white" : ""
                  }`}
                  onClick={() => handleChoiceSelect("/fsl")}
                >
                  FSL
                </button>
              </li>
              <li>
                <button
                  className={`dropdown-item ${
                    selectedChoice === "/other"
                      ? "active bg-success text-white"
                      : ""
                  }`}
                  onClick={() => handleChoiceSelect("/other")}
                >
                  Other
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav 
        className="navbar fixed-bottom navbar-light shadow d-md-none"
        style={{
          backgroundColor: pathname.startsWith("/fsl")
            ? "skyblue"
            : pathname.startsWith("/other")
            ? "#ff9800"
            : pathname === "/about" || pathname === "/contact" || pathname === "/signIn"
            ? "#f8f9fa"
            : "#599636ff",
        }}
      >
        <div className="container d-flex justify-content-around">
          <Link
            href={`${selectedChoice}/sign-to-text`}
            className={`text-center nav-link position-relative ${
              pathname.includes("/sign-to-text")
                ? "text-white bg-dark bg-opacity-25 rounded px-2"
                : "text-dark"
            }`}
            title="Sign to Text"
          >
            <i className="bi bi-hand-index-thumb fs-4"></i>
          </Link>
          <Link
            href={`${selectedChoice}/speech-to-sign`}
            className={`text-center nav-link position-relative ${
              pathname.includes("/speech-to-sign")
                ? "text-white bg-dark bg-opacity-25 rounded px-2"
                : "text-dark"
            }`}
            title="Speech to Sign"
          >
            <i className="bi bi-mic-fill fs-4"></i>
          </Link>
          <Link
            href={selectedChoice}
            className={`text-center nav-link position-relative ${
              pathname === selectedChoice
                ? "text-white bg-dark bg-opacity-25 rounded px-2"
                : "text-dark"
            }`}
            title="Home"
          >
            <i className="bi bi-house-door-fill fs-4"></i>
          </Link>
          <Link
            href={`${selectedChoice}/test`}
            className={`text-center nav-link position-relative ${
              pathname.includes("/test")
                ? "text-white bg-dark bg-opacity-25 rounded px-2"
                : "text-dark"
            }`}
            title="Test"
          >
            <i className="bi bi-clipboard-check fs-4"></i>
          </Link>
          <Link
            href={`${selectedChoice}/learn`}
            className={`text-center nav-link position-relative ${
              pathname.includes("/learn")
                ? "text-white bg-dark bg-opacity-25 rounded px-2"
                : "text-dark"
            }`}
            title="Learn"
          >
            <i className="bi bi-book fs-4"></i>
          </Link>
        </div>
      </nav>

      {/* Install App Button */}
      {showInstall && (
        <button
          onClick={handleInstallClick}
          className="btn btn-success position-fixed bottom-0 start-50 translate-middle-x mb-5"
          style={{ zIndex: 1050 }}
        >
          📲 Install App
        </button>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        .nav-link:focus,
        .nav-link:hover {
          color: white !important;
          background-color: #28a745 !important;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}