import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainHeader() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="navbar navbar-expand-md navbar-light bg-light shadow d-none d-md-block">
        <div className="container">
          <h1 className="navbar-brand">eSignMo</h1>
          <div className="collapse navbar-collapse show">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/about" className={`nav-link ${pathname === "/about" ? "active" : ""}`}>
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contact" className={`nav-link ${pathname === "/contact" ? "active" : ""}`}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar with Logos (Shopee-style) */}
      <nav className="navbar fixed-bottom navbar-light bg-light shadow d-md-none">
        <div className="container d-flex justify-content-around">
          <Link href="/" className={`text-center nav-link ${pathname === "/" ? "text-success" : "text-muted"}`}>
            <i className="bi bi-house-door-fill fs-4"></i>
            <div style={{ fontSize: "12px" }}>Home</div>
          </Link>
          <Link href="/about" className={`text-center nav-link ${pathname === "/about" ? "text-success" : "text-muted"}`}>
            <i className="bi bi-info-circle-fill fs-4"></i>
            <div style={{ fontSize: "12px" }}>About</div>
          </Link>
          <Link href="/contact" className={`text-center nav-link ${pathname === "/contact" ? "text-success" : "text-muted"}`}>
            <i className="bi bi-envelope-fill fs-4"></i>
            <div style={{ fontSize: "12px" }}>Contact</div>
          </Link>
          <Link href="/signIn" className={`text-center nav-link ${pathname === "/signIn" ? "text-success" : "text-muted"}`}>
            <i className="bi bi-person-circle fs-4"></i>
            <div style={{ fontSize: "12px" }}>Account</div>
          </Link>
        </div>
      </nav>
    </>
  );
}
