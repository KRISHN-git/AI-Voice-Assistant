import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaBrain, FaHistory, FaPalette } from "react-icons/fa";
import bg from "../assets/authBg.jpeg";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen w-full bg-cover flex flex-col font-sans overflow-x-hidden text-white"
      style={{ backgroundImage: `url(${bg})`, backgroundPosition: 'center' }}
    >
      
      {/* HEADER / NAVBAR */}
      <header className="flex justify-between items-center px-8 py-6 w-full mx-auto relative z-10 bg-[#00000062] backdrop-blur shadow-lg shadow-black/50">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl font-semibold text-white">
            Voice <span className="text-teal-400">Buddy</span>
          </span>
        </div>
        <nav className="flex gap-4">
          <button 
            onClick={() => navigate("/signin")}
            className="text-white hover:text-teal-400 transition px-4 py-2 font-medium"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate("/signup")}
            className="text-black bg-white px-6 py-2 rounded-full font-semibold transition-all hover:bg-gray-200"
          >
            Sign Up
          </button>
        </nav>
      </header>

      {/* MAIN HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 my-10">
        
        <div className="w-[90%] max-w-[800px] bg-[#00000062] backdrop-blur shadow-lg shadow-black p-10 md:p-16 rounded-3xl flex flex-col items-center justify-center gap-6">
          <div className="inline-block px-4 py-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-400 text-sm font-semibold tracking-wide backdrop-blur-md">
            Powered by Google Gemini
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-white mb-2">
            Welcome to <br />
            <span className="text-teal-400">Voice Buddy</span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-xl">
            Interact naturally with an advanced AI that listens, speaks, remembers your history, and executes web commands. No typing required.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mt-6">
            <button 
              onClick={() => navigate("/signup")}
              className="min-w-[150px] h-[60px] px-8 bg-white text-black rounded-full font-semibold text-[19px] transition-all hover:bg-gray-200"
            >
              Get Started Now
            </button>
            <button 
              onClick={() => navigate("/signin")}
              className="min-w-[150px] h-[60px] px-8 bg-transparent border-2 border-white text-white rounded-full font-semibold text-[19px] transition-all hover:bg-white/10"
            >
              Sign In
            </button>
          </div>
        </div>

      </main>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto w-full px-6 py-10 pb-20 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <FeatureCard 
          icon={<FaMicrophone className="text-teal-400 text-4xl" />}
          title="Voice Command"
          desc="Speak naturally. The AI understands context and responds verbally in real-time."
        />
        <FeatureCard 
          icon={<FaBrain className="text-teal-400 text-4xl" />}
          title="Gemini Powered"
          desc="Integrated with cutting edge AI models to answer complex queries immediately."
        />
        <FeatureCard 
          icon={<FaPalette className="text-teal-400 text-4xl" />}
          title="Custom Avatars"
          desc="Personalize your assistant with custom names and visual appearance."
        />
        <FeatureCard 
          icon={<FaHistory className="text-teal-400 text-4xl" />}
          title="Smart History"
          desc="Access your entire conversation history feed directly on your dashboard."
        />

      </section>

      {/* FOOTER */}
      <footer className="w-full text-center py-6 bg-[#00000062] backdrop-blur text-gray-300 text-sm relative z-10">
        © {new Date().getFullYear()} Voice Buddy. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-[#00000062] backdrop-blur shadow-lg shadow-black p-8 rounded-2xl group flex flex-col items-center text-center border border-white/10">
      <div className="flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-300 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

export default LandingPage;
