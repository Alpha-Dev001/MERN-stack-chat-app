import React, { useState } from 'react'
import assets from '../assets/assets'

function LoginPage() {
   
  const [currState,setCurrState] = useState("Sign up");
  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [bio,setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center 
    justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />

      {/* right */}

      <form className='border-2 bg-white/8 text-white border-gray-500 p-6 flex 
      flex-col gap-6 rounded-lg shadow-lg' action="">
        <h2 className='text-2xl font-medium flex justify-between items-center'>
          {currState}
          <img src={assets.arrow_icon} alt=""  className='w-5 cursor-pointer'/>
        </h2>

        {currState === 'Sign up' && !isDataSubmitted && (
        <input type="text" className='p-2 border border-gray-500 rounded-md 
        focus:outline-none' placeholder='Full name' required/>
         )}

         {!isDataSubmitted && (
          <>
          <input onChange={(e)=>setEmail(e.target.value)} value={email} 
           type="email" className='p-2 border border-gray-500 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Email Address' required/>

          <input onChange={(e)=>setPassword(e.target.value)} value={password} 
           type="password" className='p-2 border border-gray-500 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Password' required/>
          </>
         )}

         {
          currState === 'Sign up' && isDataSubmitted && (
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
            rows={4} className='p-2 border border-gray-500 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-indigo-500'
             placeholder='provide a short bio... ' required/>
          )
         }
         <button type='submit' className='py-3 bg-gradient-to-r from-purple-400
         to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
         </button>
         <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
         </div>
      </form>
    </div>
  )
}


export default LoginPage
