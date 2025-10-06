"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainHeader() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [mounted, setMounted] = useState(false);

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
          backgroundColor:
            pathname === "/about" || pathname === "/fsl"
              ? "skyblue"
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
                    pathname === "/asl" ? "active text-white" : "text-dark"
                  }`}
                >
                  ASL
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/fsl"
                  className={`nav-link fw-bold fs-5 ${
                    pathname === "/fsl" ? "active text-white" : "text-dark"
                  }`}
                >
                  FSL
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Top Navbar with eSIGN Mo + Dropdown */}
      <nav className="navbar navbar-light bg-light shadow d-md-none">
        <div className="container d-flex justify-content-between">
          <h5 className="m-0 fw-bold text-success">eSIGN Mo</h5>
          <div className="dropdown">
            <button
              className="btn btn-outline-success dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Choices
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton"
            >
              <li>
                <Link
                  href="/asl"
                  className={`dropdown-item ${
                    pathname === "/asl" ? "active bg-success text-white" : ""
                  }`}
                >
                  ASL
                </Link>
              </li>
              <li>
                <Link
                  href="/fsl"
                  className={`dropdown-item ${
                    pathname === "/fsl" ? "active bg-success text-white" : ""
                  }`}
                >
                  FSL
                </Link>
              </li>
              <li>
                <Link
                  href="/other"
                  className={`dropdown-item ${
                    pathname === "/other" ? "active bg-success text-white" : ""
                  }`}
                >
                  Other
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="navbar fixed-bottom navbar-light bg-light shadow d-md-none">
        <div className="container d-flex justify-content-around">
          <Link
            href="/"
            className={`text-center nav-link ${
              pathname === "/"
                ? "text-white bg-success rounded px-2"
                : "text-muted"
            }`}
          >
            <i className="bi bi-house-door-fill fs-4"></i>
            <div style={{ fontSize: "12px" }}>Home</div>
          </Link>
          <Link
            href="/about"
            className={`text-center nav-link ${
              pathname === "/about"
                ? "text-white bg-success rounded px-2"
                : "text-muted"
            }`}
          >
            <i className="bi bi-info-circle-fill fs-4"></i>
            <div style={{ fontSize: "12px" }}>About</div>
          </Link>
          <Link
            href="/contact"
            className={`text-center nav-link ${
              pathname === "/contact"
                ? "text-white bg-success rounded px-2"
                : "text-muted"
            }`}
          >
            <i className="bi bi-envelope-fill fs-4"></i>
            <div style={{ fontSize: "12px" }}>Contact</div>
          </Link>
          <Link
            href="/signIn"
            className={`text-center nav-link ${
              pathname === "/signIn"
                ? "text-white bg-success rounded px-2"
                : "text-muted"
            }`}
          >
            <i className="bi bi-person-circle fs-4"></i>
            <div style={{ fontSize: "12px" }}>Account</div>
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
