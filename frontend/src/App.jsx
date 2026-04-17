import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Customize from "./pages/Customize";
import Customize2 from "./pages/Customize2";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import { userDataContext } from "./context/UserContext";

function App() {
  const { userData, loading } = useContext(userDataContext);

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-[#361434] via-[#1d212c] to-[#1d212c] flex flex-col justify-center items-center gap-6">
        <div className="relative flex justify-center items-center">
          <div className="absolute w-[80px] h-[80px] border-4 border-transparent border-t-cyan-400 border-b-cyan-400 rounded-full animate-spin"></div>
          <div className="absolute w-[60px] h-[60px] border-4 border-transparent border-l-purple-500 border-r-purple-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
          <div className="w-[40px] h-[40px] bg-cyan-400/20 rounded-full animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.6)]"></div>
        </div>
        <p className="text-cyan-300 font-medium tracking-widest text-[16px] animate-pulse">
          INITIALIZING AI CORE...
        </p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData
            ? (userData.assistantImage && userData.assistantName ? <Home /> : <Navigate to="/customize" />)
            : <LandingPage />
        }
      />

      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path="/customize" element={userData ? <Customize /> : <Navigate to="/signup" />} />
      <Route path="/customize2" element={userData ? <Customize2 /> : <Navigate to="/signup" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
