import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/UserContext'
import { FiEye, FiEyeOff, FiLock, FiMail, FiArrowLeft, FiLogIn } from "react-icons/fi"

function Login() {
  let [show, setShow] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  let { userData, setUserData } = useContext(userDataContext)
  let navigate = useNavigate()
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl + "/api/auth/login", {
        email,
        password
      }, { withCredentials: true })
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setEmail("")
      setPassword("")
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
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Welcome Back</h1>
          <p className='text-gray-600'>Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <form onSubmit={handleSignIn} className='space-y-6'>
            {/* Email Field */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>Email Address</label>
              <div className='relative'>
                <FiMail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input 
                  type="email" 
                  placeholder='Enter your email'
                  required 
                  className='w-full h-12 pl-12 pr-4 border border-gray-300 text-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white'
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <label className='text-sm font-medium text-gray-700'>Password</label>
                <button 
                  type="button"
                  className='text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200 font-medium'
                  onClick={() => {/* Add forgot password functionality */}}
                >
                  Forgot Password?
                </button>
              </div>
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
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1'
                  onClick={() => setShow(prev => !prev)}
                >
                  {show ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {err && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2'>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className='text-red-600 text-sm font-medium'>
                  {err}
                </p>
              </div>
            )}

            {/* Remember Me & Forgot Password Row */}
            <div className='flex items-center justify-between'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input 
                  type="checkbox" 
                  className='w-4 h-4 text-blue-500 rounded focus:ring-blue-500 border-gray-300'
                />
                <span className='text-sm text-gray-600'>Remember me</span>
              </label>
            </div>

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
                  Signing In...
                </>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>

            {/* Divider */}
            <div className='relative flex items-center py-4'>
              <div className='flex-grow border-t border-gray-300'></div>
              <span className='flex-shrink mx-4 text-gray-500 text-sm'>or</span>
              <div className='flex-grow border-t border-gray-300'></div>
            </div>

            {/* Demo Account Hint */}
            <div className='p-3 bg-blue-50 border border-blue-200 rounded-xl'>
              <p className='text-blue-700 text-sm text-center'>
                 AnshSharma@example.com
              </p>
            </div>

            {/* Sign Up Redirect */}
            <div className='text-center pt-4 border-t border-gray-200'>
              <p className='text-gray-600'>
                Don't have an account?{' '}
                <button 
                  type="button"
                  className='text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-200'
                  onClick={() => navigate("/signup")}
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className='text-center mt-6'>
          <p className='text-sm text-gray-500'>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login