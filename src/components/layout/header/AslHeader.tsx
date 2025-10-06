import Link from "next/link";

export default function AslHeader() {
    return(
        <div>
            <nav className="navbar navbar-expand-md navbar-light bg-light">
                <div className="container">
                   <div className="collapse navbar-collapse">
                      <h1 className="navbar-brand text-success">eSIGN Mo</h1>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">   
                            <Link href="" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="" className="nav-link">Translate</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="" className="nav-link">Learn</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="" className="nav-link">About us</Link>
                        </li>
                    </ul>
                    </div>      
                </div>
            </nav>
        </div>
    )
}