import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.jpeg"
import image2 from "../assets/image2.jpeg"
import image3 from "../assets/image3.jpeg"
import image4 from "../assets/image4.jpeg"
import image5 from "../assets/image5.jpeg"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";
function Customize() {
  const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  const scrollRef = useRef()
  const navigate=useNavigate()
  const inputImage=useRef()
  const handleImage=(e)=>{
  const file=e.target.files[0]
  setBackendImage(file)
  setFrontendImage(URL.createObjectURL(file))
  }
return (
  <div className="w-full h-screen bg-gradient-to-b from-[#82d1ff] to-[#04152d] flex justify-center items-center relative p-[20px]"
  onKeyDown={(e)=>{ if(e.key==="Enter" && selectedImage) navigate("/customize2") }}
  tabIndex={0}>

    <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[30px] h-[30px]' onClick={()=>navigate("/")}/>

    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl px-12 py-12 flex flex-col items-center gap-10 w-[550px] max-w-[90%] relative">

      <h1 className='text-white text-[28px] font-semibold text-center'>
        Select your <span className='text-teal-300'>Assistant Image</span>
      </h1>

      {/* MAIN CENTER PREVIEW */}
      <div className="w-[160px] h-[160px] rounded-full bg-white/15 border border-white/25 shadow-xl overflow-hidden flex justify-center items-center">
        {frontendImage || selectedImage ?
          <img src={selectedImage === "input" ? frontendImage : selectedImage} className='w-full h-full object-cover'/>
          :
          <span className="text-white/60 text-sm">No Image Selected</span>
        }
      </div>

      {/* HORIZONTAL SCROLL LIST */}
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto w-full px-3 py-2 scroll-smooth hide-scroll">

        {[image1, image2, image3, image4, image5, image6, image7].map((img, i) => (
          <div key={i}
            className={`min-w-[90px] h-[130px] rounded-2xl overflow-hidden cursor-pointer border border-white/30 hover:border-teal-300 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition ${selectedImage===img ? "border-2 border-teal-300 shadow-[0_0_15px_rgba(0,255,255,0.5)]" : ""}`}
            onClick={()=>{ setSelectedImage(img); setFrontendImage(null); setBackendImage(null); }}>
              <img src={img} className="w-full h-full object-cover" />
          </div>
        ))}

        {/* upload custom */}
        <div className={`min-w-[90px] h-[130px] bg-white/10 border border-white/30 rounded-2xl overflow-hidden cursor-pointer hover:border-teal-300 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition flex items-center justify-center ${selectedImage=="input"?"border-2 border-teal-300 shadow-[0_0_15px_rgba(0,255,255,0.5)]":""}`}
          onClick={()=>{ inputImage.current.click(); setSelectedImage("input") }}>
          {!frontendImage && <RiImageAddLine className='text-white w-[28px] h-[28px]'/>}
          {frontendImage && <img src={frontendImage} className='w-full h-full object-cover'/>}
        </div>

        <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
      </div>

      {selectedImage && 
        <button className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-3 rounded-full text-lg font-semibold hover:scale-[1.03] transition'
        onClick={()=>navigate("/customize2")}>
          Next
        </button>
      }

    </div>
  </div>
)
}

export default Customize
