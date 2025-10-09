import Image from "next/image";
import image from '../../../public/image/background1.png';

export default function Home() {
  return (
    <div>
      <section className="p-5 p-md-5 py-md-0 position-relative overflow-hidden">
        <div className="container position-relative">
          <div className="row">
              
            {/* TEXT AREA */}
            <div className="col-md-7 position-relative z-2 text-md-start mt-md-5">
              <h1 className="fw-bold">A place where everyone understands.</h1>
              <p className="fs-5">
                Learn ASL and FSL, Practice with test, or use real-time
                speech to sign translation
              </p>
              <button className="btn btn-primary px-5">Explore</button>
            </div>

            {/* IMAGE FOR DESKTOP */}
            <div className="col-md-5   d-none d-md-block text-center">
              <Image 
                src={image} 
                alt="Sign Language"  
                width={350} 
                className="img-fluid"
              />
            </div>
          </div>

          {/* IMAGE FOR MOBILE - ABSOLUTE RIGHT SIDE */}
          <div 
            className="d-md-none position-absolute top-50 end-0 translate-middle-y pe-2" 
            style={{ zIndex: 1 }}
          >
            <Image 
              src={image} 
              alt="Sign Language mobile" 
              width={200} 
              className="img-fluid"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
