import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import logo2 from "../assets/logo2.png"
import { IoSearchSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotificationsSharp } from "react-icons/io5";
import dp from "../assets/dp.webp"
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong'

function Nav() {
    const [activeSearch,setActiveSearch]=useState(false)
    const {userData,setUserData,handleGetProfile}=useContext(userDataContext)
    const [showPopup,setShowPopup]=useState(false)
    const navigate=useNavigate()
const {serverUrl}=useContext(authDataContext)
const [searchInput,setSearchInput]=useState("")
const [searchData,setSearchData]=useState([])
const [isSearching,setIsSearching]=useState(false)

const handleSignOut=async ()=>{
    try {
        await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
        setUserData(null)
        navigate("/login")
      
    } catch (error) {
        console.error('Failed to sign out:', getErrorMessage(error));
    }
}

const handleSearch=useCallback(async (query)=>{
const trimmedQuery = query.trim()
if(!trimmedQuery){
  setSearchData([])
  setIsSearching(false)
  return
}
setIsSearching(true)
try {
  const result=await axios.get(`${serverUrl}/api/user/search?query=${encodeURIComponent(trimmedQuery)}`,{withCredentials:true})
setSearchData(Array.isArray(result.data) ? result.data : [])
} catch (error) {
  setSearchData([])
  console.error('Failed to search users:', getErrorMessage(error))
} finally {
  setIsSearching(false)
}
},[serverUrl])

useEffect(()=>{
  handleSearch(searchInput)
},[searchInput,handleSearch])

const profileImage = userData?.profileImage || dp
const userFullName = useMemo(()=>`${userData?.firstName ?? ''} ${userData?.lastName ?? ''}`.trim(),[userData])

  if(!userData){
    return null
  }

  return (
    <div className='fixed top-0 z-[80] w-full border-b border-slate-200 bg-white/80 backdrop-blur'>
      <div className='mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-4 lg:px-8'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            className='flex items-center justify-center rounded-full bg-sky-100 p-2 transition hover:bg-sky-200'
            onClick={()=>{
              setActiveSearch(false)
              navigate("/")
            }}>
            <img src={logo2}alt="LinkedIn logo" className='w-10 object-contain lg:w-12'/>
          </button>
          {!activeSearch && (
            <button
              type='button'
              className='flex items-center justify-center rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 lg:hidden'
              onClick={()=>setActiveSearch(true)}>
              <IoSearchSharp className='h-5 w-5'/>
            </button>
          )}
          {(isSearching || searchData.length>0) && (
            <div className='absolute left-0 top-[80px] w-full px-4 lg:left-1/2 lg:-translate-x-1/2 lg:px-0'>
              <div className='mx-auto flex max-h-[26rem] w-full max-w-3xl flex-col gap-4 overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl backdrop-blur'>
                {isSearching && <div className='text-center text-sm font-medium text-slate-500'>Searching...</div>}
                {!isSearching && searchData.length===0 && (
                  <div className='text-center text-sm font-medium text-slate-400'>No users found</div>
                )}
                {!isSearching && searchData.map((sea)=>(
                  <button
                    type='button'
                    key={sea?._id ?? sea?.userName}
                    className='flex items-center gap-4 rounded-xl border border-transparent bg-slate-50/40 p-3 text-left transition hover:border-sky-200 hover:bg-sky-50'
                    onClick={()=>sea?.userName && handleGetProfile(sea.userName)}>
                    <div className='h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200'>
                      <img src={sea?.profileImage || dp} alt={`${sea?.firstName ?? ''} ${sea?.lastName ?? ''}`} className='h-full w-full object-cover'/>
                    </div>
                    <div>
                      <div className='text-base font-semibold text-slate-800'>{`${sea?.firstName ?? ''} ${sea?.lastName ?? ''}`.trim() || 'LinkedIn Member'}</div>
                      <div className='text-sm font-medium text-slate-500'>{sea?.headline ?? 'No headline provided'}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <form
            className={`hidden h-11 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 ring-1 ring-transparent transition focus-within:ring-sky-300 lg:flex ${!activeSearch?'':'flex'}` }
            onSubmit={(e)=>e.preventDefault()}>
            <IoSearchSharp className='h-5 w-5 text-slate-500'/>
            <input
              type="text"
              className='w-full bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none'
              placeholder='Search users...'
              onChange={(e)=>setSearchInput(e.target.value)}
              value={searchInput}/>
          </form>
        </div>

        <div className='flex items-center gap-5'>
          {showPopup && (
            <div className='absolute right-4 top-[78px] w-[300px] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl'>
              <div className='flex flex-col items-center gap-4 text-center'>
                <div className='h-20 w-20 overflow-hidden rounded-full border border-slate-200'>
                  <img src={profileImage} alt={userFullName || 'Your profile'} className='h-full w-full object-cover'/>
                </div>
                <div>
                  <div className='text-lg font-semibold text-slate-900'>{userFullName || 'LinkedIn Member'}</div>
                  <p className='text-sm text-slate-500'>Stay connected and manage your profile</p>
                </div>
                <button
                  className='w-full rounded-full bg-sky-500 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600'
                  onClick={()=>userData?.userName && handleGetProfile(userData.userName)}>
                  View Profile
                </button>
                <div className='h-px w-full bg-slate-200'></div>
                <button
                  className='flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-slate-100 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200'
                  onClick={()=>navigate("/network")}>
                  <FaUserGroup className='h-4 w-4'/>
                  <span>My Network</span>
                </button>
                <button
                  className='w-full rounded-full border border-red-200 bg-red-50 py-2 text-sm font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-100'
                  onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            </div>
          )}

          <button
            className='hidden flex-col items-center justify-center text-slate-500 transition hover:text-sky-500 lg:flex'
            onClick={()=>navigate("/")}>
            <TiHome className='h-6 w-6'/>
            <span className='text-xs font-semibold'>Home</span>
          </button>
          <button
            className='hidden cursor-pointer flex-col items-center justify-center text-slate-500 transition hover:text-sky-500 md:flex'
            onClick={()=>navigate("/network")}>
            <FaUserGroup className='h-5 w-5'/>
            <span className='text-xs font-semibold'>Network</span>
          </button>
          <button
            className='flex flex-col items-center justify-center text-slate-500 transition hover:text-sky-500'
            onClick={()=>navigate("/notification")}>
            <IoNotificationsSharp className='h-5 w-5'/>
            <span className='hidden text-xs font-semibold md:block'>Notifications</span>
          </button>
          <button
            className='h-11 w-11 overflow-hidden rounded-full border border-slate-200 shadow-sm transition hover:scale-[1.03]'
            onClick={()=>setShowPopup(prev=>!prev)}>
            <img src={profileImage} alt={userFullName || 'Your profile'} className='h-full w-full object-cover'/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Nav
