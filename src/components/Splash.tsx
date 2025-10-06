import Image from "next/image";
import logo from "../app/logo.png";
// import logo2 from "../../public/image/logo2.png"

export default function Splash() {
  return (
    <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white" style={{ zIndex: 1050, transition: "opacity 0.5s" }}>
      <Image src={logo} alt="Logo" width={500} height={500} />
    </div>
  );
}
