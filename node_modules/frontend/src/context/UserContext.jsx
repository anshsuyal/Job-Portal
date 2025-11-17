import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const userDataContext=createContext()

const getErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong'

function UserContext({children}) {
const [userData,setUserData]=useState(null)
const {serverUrl}=useContext(authDataContext)
const [edit,setEdit]=useState(false)
const [postData,setPostData]=useState([])
const [profileData,setProfileData]=useState(null)
const [errorMessage,setErrorMessage]=useState(null)
const navigate=useNavigate()
const getCurrentUser=useCallback(async ()=>{
    try {
        const result=await axios.get(`${serverUrl}/api/user/currentuser`,{withCredentials:true})
        setUserData(result.data)
        setErrorMessage(null)
    } catch (error) {
        console.error('Failed to fetch current user:', getErrorMessage(error))
        setUserData(null)
        setErrorMessage(getErrorMessage(error))
    }
},[serverUrl])

const getPost=useCallback(async ()=>{
  try {
    const result=await axios.get(`${serverUrl}/api/post/getpost`,{
      withCredentials:true
    })
    setPostData(Array.isArray(result.data) ? result.data : [])
    setErrorMessage(null)
   
  } catch (error) {
    console.error('Failed to fetch posts:', getErrorMessage(error))
    setPostData([])
    setErrorMessage(getErrorMessage(error))
  }
},[serverUrl])

const handleGetProfile=useCallback(async (userName)=>{
   if(!userName){
    return
   }
   try {
    const result=await axios.get(`${serverUrl}/api/user/profile/${userName}`,{
      withCredentials:true
    })
    setProfileData(result.data ?? null)
    setErrorMessage(null)
    navigate("/profile")
   } catch (error) {
    console.error('Failed to fetch profile:', getErrorMessage(error))
    setProfileData(null)
    setErrorMessage(getErrorMessage(error))
   }
},[navigate,serverUrl])



useEffect(() => {
getCurrentUser();
 getPost()
}, [getCurrentUser,getPost]);


    const value=useMemo(()=>({
        userData,
        setUserData,
        edit,
        setEdit,
        postData,
        setPostData,
        getPost,
        handleGetProfile,
        profileData,
        setProfileData,
        errorMessage,
        setErrorMessage
    }),[
        userData,
        edit,
        postData,
        profileData,
        errorMessage,
        getPost,
        handleGetProfile,
        setProfileData
    ])
  return (
        <userDataContext.Provider value={value}>
      {children}
      </userDataContext.Provider>
  )
}

export default UserContext
