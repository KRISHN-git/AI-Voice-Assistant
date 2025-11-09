import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.AssistantName || ""
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      setLoading(false);
      console.log(result.data);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#82d1ff] to-[#04152d] flex justify-center items-center relative">
      <MdKeyboardBackspace
        className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[30px] h-[30px]"
        onClick={() => navigate("/customize")}
      />

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl px-10 py-14 flex flex-col items-center gap-8 w-[450px]">
        <div className="w-[130px] h-[130px] rounded-full bg-white/20 border border-white/40 shadow-xl overflow-hidden flex justify-center items-center">
          {backendImage || selectedImage ? (
            <img
              src={
                backendImage ? URL.createObjectURL(backendImage) : selectedImage
              }
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white/60 text-sm">AI Avatar</span>
          )}
        </div>

        <h1 className="text-white text-[28px] font-semibold text-center">
          Enter Your <span className="text-teal-300">Assistant Name</span>
        </h1>

        <input
          type="text"
          placeholder="Enter name"
          className="w-[320px] h-[60px] text-center border border-white/50 bg-transparent rounded-full text-white outline-none text-[18px] placeholder-gray-300 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(0,136,255,0.7)] transition"
          required
          value={assistantName}
          onChange={(e) => setAssistantName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && assistantName.trim())
              handleUpdateAssistant();
          }}
        />

        {assistantName && (
          <button
            className="mt-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-3 rounded-full text-lg font-semibold hover:scale-[1.03] transition"
            disabled={loading}
            onClick={handleUpdateAssistant}
          >
            {!loading ? "Continue" : "Loading..."}
          </button>
        )}
      </div>
    </div>
  );
}

export default Customize2;
