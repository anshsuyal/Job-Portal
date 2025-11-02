import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/UserContext'
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiArrowLeft } from "react-icons/fi"

function Signup() {
  let [show, setShow] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  let { userData, setUserData } = useContext(userDataContext)
  let navigate = useNavigate()
  let [firstName, setFirstName] = useState("")
  let [lastName, setLastName] = useState("")
  let [userName, setUserName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl + "/api/auth/signup", {
        firstName,
        lastName,
        userName,
        email,
        password
      }, { withCredentials: true })
      console.log(result)
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setUserName("")
    } catch (error) {
      setErr(error.response.data.message)
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4'>
      {/* Back Button */}
      <button 
        onClick={() => navigate("/")}
        className='absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 p-2 rounded-lg hover:bg-white/50'
      >
        <FiArrowLeft className="w-5 h-5" />
        <span className="hidden sm:block">Back to Home</span>
      </button>

      {/* Card Container */}
      <div className='w-full max-w-md'>
        {/* Logo Header */}
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <img src={logo} alt="Logo" className='w-16 h-16' />
          </div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Join Our Community</h1>
          <p className='text-gray-600'>Create your account and start connecting</p>
        </div>

        {/* Signup Form */}
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <form onSubmit={handleSignUp} className='space-y-6'>
            {/* Name Row */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>First Name</label>
                <div className='relative'>
                  <FiUser className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input 
                    type="text" 
                    placeholder='Ansh'
                    required 
                    className='w-full h-12 pl-12 pr-4 border border-gray-300 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white'
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Last Name</label>
                <div className='relative'>
                  <FiUser className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input 
                    type="text" 
                    placeholder='Suyal'
                    required 
                    className='w-full h-12 pl-12 pr-4 border border-gray-300 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white'
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>Username</label>
              <div className='relative'>
                <FiUser className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input 
                  type="text" 
                  placeholder='Anshu'
                  required 
                  className='w-full h-12 pl-12 pr-4 border border-gray-300 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white'
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>Email</label>
              <div className='relative'>
                <FiMail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input 
                  type="email" 
                  placeholder='Ansh@example.com'
                  required 
                  className='w-full h-12 pl-12 pr-4 border border-gray-300 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white'
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>Password</label>
              <div className='relative'>
                <FiLock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input 
                  type={show ? "text" : "password"} 
                  placeholder='Enter your password'
                  required 
                  className='w-full h-12 pl-12 pr-12 border border-gray-300 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white'
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200'
                  onClick={() => setShow(prev => !prev)}
                >
                  {show ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {err && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-xl'>
                <p className='text-red-600 text-sm text-center font-medium'>
                  {err}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button 
              className={`w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-700'
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Redirect */}
            <div className='text-center pt-4 border-t border-gray-200'>
              <p className='text-gray-600'>
                Already have an account?{' '}
                <button 
                  type="button"
                  className='text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-200'
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className='text-center mt-6'>
          <p className='text-sm text-gray-500'>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup