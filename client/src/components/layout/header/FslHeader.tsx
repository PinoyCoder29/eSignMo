import Link from "next/link";

export default function FslHeader() {
  return (
    <div>
      <nav
        className="navbar navbar-expand-md navbar-light "
        style={{
          background: "linear-gradient(135deg, #1a1f35 0%, #2d3561 100%)",
        }}
      >
        <div className="container">
          <div className="collapse navbar-collapse">
            <h1 className="navbar-brand text-success">eSIGN Mo</h1>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link href="" className="nav-link text-white">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link href="" className="nav-link text-white">
                  Translate
                </Link>
              </li>
              <li className="nav-item">
                <Link href="" className="nav-link text-white">
                  Learn
                </Link>
              </li>
              <li className="nav-item">
                <Link href="" className="nav-link text-white">
                  About us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
