import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import {useNavigate} from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/UserContext'

const getErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Unable to sign in right now.'

function Login() {
  let [show,setShow]=useState(false)
  let {serverUrl}=useContext(authDataContext)
  let {setUserData}=useContext(userDataContext)
  let navigate=useNavigate()
  let [email,setEmail]=useState("")
  let [password,setPassword]=useState("")
  let [loading,setLoading]=useState(false)
  let [err,setErr]=useState("")

  const handleSignIn=async (e)=>{
    e.preventDefault()
    if(loading){
      return
    }
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/login`,{
email,
password
      },{withCredentials:true})
      setUserData(result.data)
      navigate("/")
      setErr("")
      setEmail("")
      setPassword("")
    } catch (error) {
      setErr(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-sky-100 px-4 py-12'>
      <div className='relative flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:flex-row'>
        <div className='hidden h-full flex-1 flex-col items-center justify-center gap-6 bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 p-10 text-white lg:flex'>
          <img src={logo} alt="LinkedIn logo" className='w-24 object-contain'/>
          <h2 className='text-3xl font-semibold leading-tight'>Welcome back to your professional community</h2>
          <p className='text-sm font-medium text-white/80'>Stay updated with your network, share insights, and build meaningful connections.</p>
        </div>
        <div className='flex w-full flex-col items-center px-6 py-10 lg:w-[420px]'>
          <div className='mb-8 flex w-full items-center justify-center lg:hidden'>
            <img src={logo} alt="LinkedIn logo" className='w-20 object-contain'/>
          </div>
   <form className='flex w-full flex-col gap-5' onSubmit={handleSignIn}>
    <div className='text-center'>
      <h1 className='text-3xl font-semibold text-slate-900'>Sign in</h1>
      <p className='text-sm font-medium text-slate-500'>Connect with peers and opportunities tailored to you.</p>
    </div>
   
    <div>
      <label className='mb-2 block text-sm font-semibold text-slate-600'>Email</label>
      <input type="email" placeholder='you@example.com' required className='h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100' value={email} onChange={(e)=>setEmail(e.target.value)}/>
    </div>
    <div>
      <label className='mb-2 block text-sm font-semibold text-slate-600'>Password</label>
    <div className='relative flex h-12 w-full items-center rounded-xl border border-slate-200 bg-slate-50'>
    <input type={show?"text":"password"} placeholder='Enter your password' required className='h-full flex-1 border-none bg-transparent px-4 text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none' value={password} onChange={(e)=>setPassword(e.target.value)}/>
    <button type='button' className='pr-4 text-sm font-semibold text-sky-500 transition hover:text-sky-600 select-none' onClick={()=>setShow(prev=>!prev)}>{show?"Hide":"Show"}</button>
    </div>
    </div>
   {err && <p className='rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-center text-sm font-medium text-red-500'>
    *{err}
    </p>}
    <button className='mt-2 rounded-full bg-sky-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300' disabled={loading}>{loading?"Signing in...":"Sign In"}</button>
    <p className='text-center text-sm font-medium text-slate-500'>Don't have an account? <button type='button' className='font-semibold text-sky-500 transition hover:text-sky-600' onClick={()=>navigate("/signup")}>Sign Up</button></p>
   </form>
        </div>
      </div>
    </div>
  )
}

export default Login
