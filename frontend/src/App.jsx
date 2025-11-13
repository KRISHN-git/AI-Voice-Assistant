import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Customize from "./pages/Customize";
import Customize2 from "./pages/Customize2";
import Home from "./pages/Home";
import { userDataContext } from "./context/UserContext";

function App() {
  const { userData, loading } = useContext(userDataContext);

  // wait here until backend verifies session
  if (loading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName
            ? <Home />
            : <Navigate to={"/customize"} />
        }
      />

      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path="/customize" element={userData ? <Customize /> : <Navigate to="/signup" />} />
      <Route path="/customize2" element={userData ? <Customize2 /> : <Navigate to="/signup" />} />
    </Routes>
  );
}

export default App;
