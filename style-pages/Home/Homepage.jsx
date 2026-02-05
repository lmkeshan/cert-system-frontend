import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import heroImage from "../../assets/images/hero-image.png";
import howItWorksImage from "../../assets/images/how-it-works.png";
import backgroundImage from "../../assets/images/background.png";
import num_1 from "../../assets/icons/num-1.png";
import num_2 from "../../assets/icons/num-2.png";
import num_3 from "../../assets/icons/num-3.png";


export default function Homepage() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash?.replace("#", "");
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <div id="top" style={{ backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'repeat' }}>
      <Navbar />

      <header className="py-8 px-4 md:py-10 lg:py-20">
        <div className="max-w-312 mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <h1 className="font-bold mb-4 md:mb-6 text-center">
              <span className="text-black text-4xl md:text-6xl lg:text-[75px] leading-tight">
                Certi
              </span>
              <span className="text-(--color-primary-violet) text-4xl md:text-6xl lg:text-[75px] leading-tight">
                Chain
              </span>
            </h1>
            <h3 className="font-bold text-xl md:text-2xl lg:text-[30px] mb-4 md:mb-6 text-gray-800 text-center">
              Blockchain-Based Certificate Verification
            </h3>

            <p className="text-base md:text-lg lg:text-[20px] text-center mb-6 md:mb-8 text-gray-700 leading-relaxed">
              CertiChain enables secure certificate verification using
              blockchain technology. Certificates are permanently recorded on
              the blockchain, preventing forgery and allowing instant
              verification without relying on centralized authorities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                id="verifyCertificate"
                className="bg-white text-(--color-primary-violet) border-2 border-(--color-primary-violet) rounded-lg px-6 py-3 text-[16px] font-bold transition-shadow hover:shadow-lg hover:bg-(--color-primary-violet) hover:text-white"
              >
                Verify Certificate
              </button>
              <button
                id="howItWorks"
                className="bg-(--color-primary-violet) text-white border-2 border-(--color-primary-violet) rounded-lg px-6 py-3 text-[16px] font-bold transition-shadow hover:shadow-lg hover:bg-white hover:text-(--color-primary-violet)"
              >
                How it Works
              </button>
            </div>
          </div>

          <div className="shrink-0">
            <img
              src={heroImage}
              alt="Hero"
              className="w-full max-w-146 h-auto aspect-584/556 object-cover rounded-lg lg:w-146"
            />
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-12 px-4 md:py-16 lg:py-20">
        <div className="max-w-312 mx-auto bg-[#F3E8FF] rounded-3xl p-6 md:p-10 lg:p-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-black mb-4">
            About CertiChain
          </h2>
          <p className="text-center text-gray-700 text-lg md:text-xl mb-12 max-w-4xl mx-auto">
            Redefining certificate issuance and verification using blockchain technology
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Card - Purple Gradient */}
            <div className="bg-gradient-primary rounded-3xl p-8 md:p-10 lg:p-12 flex items-center justify-center">
              <p className="text-white text-center text-base md:text-lg lg:text-xl leading-relaxed">
                CertiChain is a blockchain-powered platform that helps institutions issue tamper-proof digital certificates and enables students to securely store, share, and verify their academic achievements in one place.
              </p>
            </div>

            {/* Right Card - Features List */}
            <div className="bg-white border-2 border-gray-300 rounded-3xl p-8 md:p-10 lg:p-12">
              <ul className="space-y-6">
                <li className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🔐</span>
                  <span className="text-base md:text-lg font-semibold text-black">
                    Built on blockchain for trust & immutability
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">⚡</span>
                  <span className="text-base md:text-lg font-semibold text-black">
                    Bulk certificate issuance using relay technology
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🎓</span>
                  <span className="text-base md:text-lg font-semibold text-black">
                    Student portfolios with verified credentials
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🌍</span>
                  <span className="text-base md:text-lg font-semibold text-black">
                    Instantly verifiable anywhere, anytime
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">📋</span>
                  <span className="text-base md:text-lg font-semibold text-black">
                    Standardized certificate templates for consistency
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-12 px-4 md:py-16 lg:py-20 bg-white">
        <div className="max-w-312 mx-auto bg-white rounded-3xl border border-(--color-primary-violet) p-6 md:p-10 lg:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-8">How it works</h2>
          
          {/* Three Facts in a Line */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="flex items-center justify-center gap-3">
              <img
                className="w-8 h-8 max-w-8 object-contain"
                src={num_1}
                alt="Unique ID for each Certificate"
              />
              <h4 className="text-sm md:text-base lg:text-lg mb-0 text-center leading-tight">
                Unique ID for each Certificate
              </h4>
            </div>
            <div className="flex items-center justify-center gap-3">
              <img
                className="w-8 h-8 max-w-8 object-contain"
                src={num_2}
                alt="Certificate Data is stored in the Block chain"
              />
              <h4 className="text-sm md:text-base lg:text-lg mb-0 text-center leading-tight">
                Certificate Data is stored in the Block chain
              </h4>
            </div>
            <div className="flex items-center justify-center gap-3">
              <img
                className="w-8 h-8 max-w-8 object-contain"
                src={num_3}
                alt="Verify with certificate ID"
              />
              <h4 className="text-sm md:text-base lg:text-lg mb-0 text-center leading-tight">
                Verify with certificate ID
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-6 md:p-8">
              <pa className="align-justify leading-relaxed">
                Certificates are generated using trusted platform templates and issued only by authorized institutions. Each certificate is assigned a unique ID and securely recorded on the Polygon blockchain, making it tamper-proof and instantly verifiable.
                Institutions can issue certificates individually or in bulk by uploading CSV data, enabling fast and scalable certification. Students can manage and publish all their verified certificates in one place, while receiving career guidance insights based on their academic records.
              </pa>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-130 h-70 md:h-85 rounded-3xl flex items-center justify-center text-gray-600">
                <img 
                src={howItWorksImage} 
                alt="How it works" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Start Section */}
      <section id="get-start" className="py-12 px-4 md:py-16 lg:py-20">
        <div className="max-w-312 mx-auto bg-gradient-primary rounded-3xl p-6 md:p-10 lg:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">Get Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-32 max-w-5xl mx-auto">
            <div className="bg-white/95 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col h-full min-h-96">
              <h3 className="text-2xl font-bold mb-4">Student Account</h3>
              <ul className="list-disc ml-5 space-y-2 text-gray-700 text-lg">
                <li>Sign up using your email address.</li>
                <li>Verify certificates using a unique certificate code.</li>
                <li>View and manage all your verified certificates in one place.</li>
                <li>Get personalized career path suggestions based on results.</li>
              </ul>
              <div className="mt-auto pt-6 flex justify-center">
                <button className="bg-white text-(--color-primary-violet) border-2 border-(--color-primary-violet) rounded-lg px-5 py-2.5 text-[16px] font-bold transition-shadow hover:shadow-lg hover:bg-(--color-primary-violet) hover:text-white">Create Student Account</button>
              </div>
            </div>
            <div className="bg-white/95 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col h-full">
              <h3 className="text-2xl font-bold mb-4">Institute Account</h3>
              <ul className="list-disc ml-5 space-y-2 text-gray-700 text-lg">
                <li>Register and verify your institution.</li>
                <li>Generate certificates using trusted templates.</li>
                <li>Issue certificates individually or in bulk using CSV uploads.</li>
                <li>Securely record certificate proofs on the blockchain.</li>
                <li>Manage and track all issued certificates.</li>
              </ul>
              <div className="mt-auto pt-6 flex justify-center">
                <button className="bg-white text-(--color-primary-violet) border-2 border-(--color-primary-violet) rounded-lg px-5 py-2.5 text-[16px] font-bold transition-shadow hover:shadow-lg hover:bg-(--color-primary-violet) hover:text-white">Create Institute Account</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automated Certificate Generation Section */}
      <section id="auto-generation" className="py-12 px-4 md:py-16 lg:py-20" style={{ backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'repeat' }}>
        <div className="max-w-312 mx-auto bg-white rounded-3xl border border-(--color-primary-violet) p-6 md:p-10 lg:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-(--color-primary-violet) mb-8">Automated Certificate Generation</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-(--color-primary-violet) p-6 md:p-8 flex items-center justify-center">
              <div className="w-full max-w-130 h-70 md:h-85 rounded-2xl flex items-center justify-center text-gray-600">Certificate Preview</div>
            </div>
            <div className="rounded-3xl p-6 md:p-8">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg text-center md:text-justify">
                Institutions can issue certificates by uploading a simple CSV file containing student details such as name, course title, issue date, institute logo, and authorized signature. The platform automatically applies this data to secure, predefined certificate templates, generating standardized and verifiable certificates at scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
