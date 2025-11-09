import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif"
function Home() {
  const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext)
  const navigate=useNavigate()
  const [listening,setListening]=useState(false)
  const [userText,setUserText]=useState("")
  const [aiText,setAiText]=useState("")
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const [ham,setHam]=useState(false)
  const isRecognizingRef=useRef(false)
  const synth=window.speechSynthesis
  const [historyOpen,setHistoryOpen] = useState(false)


  const handleLogOut=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    
   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    try {
      recognitionRef.current?.start();
      console.log("Recognition requested to start");
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Start error:", error);
      }
    }
  }
    
  }

  const speak=(text)=>{
    const utterence=new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN';
    const voices =window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }


    isSpeakingRef.current=true
    utterence.onend=()=>{
        setAiText("");
  isSpeakingRef.current = false;
  setTimeout(() => {
    startRecognition(); // Delay se race condition avoid hoti hai
  }, 800);
    }
   synth.cancel(); // pehle se koi speech ho to band karo
synth.speak(utterence);
  }

const handleCommand = (data)=>{

  if(!data || !data.response){
    console.log("invalid ai response", data)
    return;
  }

  const type = data.type || "";
  const userInput = data.userInput || "";
  const response = data.response;

  speak(response);

  if (type === 'google-search') {
    const query = encodeURIComponent(userInput);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  }

  if (type === 'calculator-open') window.open(`https://www.google.com/search?q=calculator`,'_blank');
  if (type === 'instagram-open') window.open(`https://www.instagram.com/`,'_blank');
  if (type === 'facebook-open') window.open(`https://www.facebook.com/`,'_blank');
  if (type === 'weather-show') window.open(`https://www.google.com/search?q=weather`,'_blank');

  if (type === 'youtube-search' || type === 'youtube-play') {
    const query = encodeURIComponent(userInput);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  }

}


useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognitionRef.current = recognition;

  let isMounted = true;  // flag to avoid setState on unmounted component

  // Start recognition after 1 second delay only if component still mounted
  const startTimeout = setTimeout(() => {
    if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognition.start();
        console.log("Recognition requested to start");
      } catch (e) {
        if (e.name !== "InvalidStateError") {
          console.error(e);
        }
      }
    }
  }, 1000);

  recognition.onstart = () => {
    isRecognizingRef.current = true;
    setListening(true);
  };

  recognition.onend = () => {
    isRecognizingRef.current = false;
    setListening(false);
    if (isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if (isMounted) {
          try {
            recognition.start();
            console.log("Recognition restarted");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }
      }, 1000);
    }
  };

  recognition.onerror = (event) => {
    console.warn("Recognition error:", event.error);
    isRecognizingRef.current = false;
    setListening(false);
    if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if (isMounted) {
          try {
            recognition.start();
            console.log("Recognition restarted after error");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }
      }, 1000);
    }
  };

  recognition.onresult = async (e) => {
  const transcript = e.results[e.results.length - 1][0].transcript.trim();
  if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
    setAiText("");
    setUserText(transcript);
    recognition.stop();
    isRecognizingRef.current = false;
    setListening(false);
    
    const data = await getGeminiResponse(transcript);
    console.log("GEMINI RAW RESPONSE => ", data);   // <-- THIS WILL PRINT GEN RESPONSE
    handleCommand(data);

    setAiText(data.response);
    setUserText("");
  }
};



    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
    greeting.lang = 'hi-IN';
   
    window.speechSynthesis.speak(greeting);
 

  return () => {
    isMounted = false;
    clearTimeout(startTimeout);
    recognition.stop();
    setListening(false);
    isRecognizingRef.current = false;
  };
}, []);

return (
  <div className='w-full h-[100vh] bg-gradient-to-b from-[#361434] via-[#1d212c] to-[#1d212c] flex justify-center items-center flex-col gap-[20px] overflow-x-hidden'>

    <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)}/>

    {/* MOBILE MENU */}
    <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
      <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)}/>
      <button className='min-w-[150px] h-[60px] text-white font-semibold bg-white/20 backdrop-blur-xl border border-white/30 rounded-full cursor-pointer text-[19px] shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:bg-white/30 transition' onClick={handleLogOut}>Log Out</button>

<button className='min-w-[150px] h-[60px] text-white font-semibold bg-white/20 backdrop-blur-xl border border-white/30 rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:bg-white/30 transition' onClick={()=>navigate("/customize")}>Customize your Assistant</button>

    </div>

    {/* DESKTOP Buttons */}
    <button 
  className='min-w-[150px] h-[60px] mt-[30px] text-white font-semibold absolute hidden lg:block top-[20px] right-[20px]  
  bg-white/20 backdrop-blur-xl border border-white/30 rounded-full cursor-pointer text-[19px] shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:bg-white/30 transition' 
  onClick={handleLogOut}
>
  Log Out
</button>

<button 
  className='min-w-[180px] h-[60px] mt-[30px] text-white font-semibold bg-white/20 backdrop-blur-xl border border-white/30 absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:bg-white/30 transition' 
  onClick={()=>navigate("/customize")}
>
  Customize your Assistant
</button>

    {/* ASSISTANT IMAGE */}
    <div className={`w-[260px] h-[360px] flex justify-center items-center overflow-hidden rounded-3xl transition-all duration-300 ${
      aiText ? "shadow-[0_0_25px_rgba(0,255,255,0.45)] border border-teal-300" : "shadow-lg border border-transparent"
    }`}>
      <img src={userData?.assistantImage} alt="" className='h-full w-full object-cover'/>
    </div>

    <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>

    <div className="relative flex justify-center items-center w-[200px] h-[220px] -mt-9">

      {!isSpeakingRef.current && listening && <div className="pulse-ring"></div>}
      {!aiText && <img src={userImg} alt="" className='w-[200px] relative z-10'/>}
      {aiText && <img src={aiImg} alt="" className='w-[200px] relative z-10'/>}
    </div>

    <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>

    {/* hint bar */}
    {(!userText && !aiText) && (
      <div className='absolute bottom-6 text-gray-300 text-[14px] text-center'>
        <p className='opacity-80'>Try saying:</p>
        <div className='flex flex-col gap-[2px]'>
          <span>“{userData?.assistantName} open Instagram”</span>
          <span>“{userData?.assistantName} search Virat Kohli on Google”</span>
        </div>
      </div>
    )}

    {/* HISTORY BUTTON BOTTOM RIGHT */}
    <button 
      className='fixed bottom-[30px] right-[30px] bg-white/20 backdrop-blur-xl border border-white/30 text-white px-6 py-2 rounded-full text-[15px] font-semibold shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:bg-white/30 transition'
      onClick={()=>setHistoryOpen(prev=>!prev)}
    >
      History
    </button>

    {/* SMALL POPUP BOX */}
    {historyOpen && (
      <div className='fixed bottom-[90px] right-[30px] w-[300px] h-[350px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 overflow-y-auto flex flex-col gap-3 shadow-[0_0_35px_rgba(0,255,255,0.3)]'>
        <h1 className='text-white font-semibold text-[17px] mb-1'>History</h1>
        {userData?.history?.map((his,index)=>(
          <div key={index} className='w-full flex justify-end'>
            <div className='bg-[#1e1b4b] text-white px-4 py-2 rounded-2xl max-w-[85%] text-[14px] shadow-md'>
              {his}
            </div>
          </div>
        ))}
      </div>
    )}

  </div>
)
}

export default Home



