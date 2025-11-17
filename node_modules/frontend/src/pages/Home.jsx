import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav'
import dp from "../assets/dp.webp"
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { userDataContext } from '../context/UserContext';
import { HiPencil } from "react-icons/hi2";
import EditProfile from '../components/EditProfile';
import { RxCross1 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import Post from '../components/Post';

const getErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong'
function Home() {

  const {userData,edit,setEdit,postData,getPost,handleGetProfile}=useContext(userDataContext)
const {serverUrl}=useContext(authDataContext)
  const [frontendImage,setFrontendImage]=useState("")
  const [backendImage,setBackendImage]=useState(null)
  const [description,setDescription]=useState("")
const [uploadPost,setUploadPost]=useState(false)
const image=useRef()
const [posting,setPosting]=useState(false)
const [suggestedUser,setSuggestedUser]=useState([])
function handleImage(e){
const file=e.target.files?.[0]
if(!file){
  return
}
setBackendImage(file)
setFrontendImage(URL.createObjectURL(file))

}

async function handleUploadPost(){
  if(posting){
    return
  }
  const trimmedDescription=description.trim()
  if(!trimmedDescription && !backendImage){
    return
  }
  setPosting(true)
  try {
    const formdata=new FormData()
    formdata.append("description",trimmedDescription)
    if(backendImage){
      formdata.append("image",backendImage)
    }
await axios.post(`${serverUrl}/api/post/create`,formdata,{withCredentials:true})
setFrontendImage("")
setBackendImage(null)
setDescription("")
setUploadPost(false)
await getPost()
  } catch (error) {
    console.error('Failed to create post:', getErrorMessage(error));
  } finally {
    setPosting(false)
  }
}
const handleSuggestedUsers=useCallback(async ()=>{
  try {
    const result=await axios.get(`${serverUrl}/api/user/suggestedusers`,{withCredentials:true})
    setSuggestedUser(Array.isArray(result.data) ? result.data : [])
  } catch (error) {
    console.error('Failed to fetch suggested users:', getErrorMessage(error))
    setSuggestedUser([])
  }
},[serverUrl])

useEffect(()=>{
handleSuggestedUsers()
},[handleSuggestedUsers])

if(!userData){
  return null
}

  return (
    <div className='relative flex min-h-screen w-full flex-col items-center bg-slate-100 pt-[88px] pb-16 lg:flex-row lg:items-start lg:justify-center lg:gap-6'>
      {edit && <EditProfile/>}
       
      <Nav/>
     
       <div className='relative w-full max-w-[340px] rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur lg:sticky lg:top-28'>
       <div className='relative mb-6 h-32 w-full overflow-hidden rounded-xl bg-gradient-to-br from-sky-100 via-slate-100 to-white'>
        <button
          type='button'
          className='absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-0 transition hover:opacity-100'
          onClick={()=>setEdit(true)}>
          <FiCamera className='h-5 w-5'/>
        </button>
        {userData.coverImage ? (
          <img src={userData.coverImage} alt="Cover" className='h-full w-full object-cover'/>
        ) : (
          <div className='h-full w-full bg-gradient-to-br from-sky-200 via-slate-200 to-white'></div>
        )}
       </div>
       <div className='-mt-16 mb-4 flex items-center gap-4'>
         <button
          type='button'
          className='relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-lg transition hover:scale-[1.02]'
          onClick={()=>setEdit(true)}>
            <img src={userData.profileImage || dp} alt={`${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim() || 'Profile picture'} className='h-full w-full object-cover'/>
          
        </button>
        <div>
          <h2 className='text-lg font-semibold text-slate-900'>{`${userData.firstName} ${userData.lastName}`}</h2>
          <p className='text-sm font-medium text-slate-500'>{userData.headline || "Tell your network what's new"}</p>
          <p className='text-xs text-slate-400'>{userData.location || "Add a location"}</p>
        </div>
        </div>
        <button className='mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600' onClick={()=>setEdit(true)}>Edit Profile <HiPencil /></button>
       </div>
       {uploadPost &&  <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='relative w-[92%] max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl'>
         <button type='button' className='absolute right-5 top-5 text-slate-400 transition hover:text-slate-600' onClick={()=>setUploadPost(false)}><RxCross1 className='h-6 w-6'/></button>
         <div className='mb-4 flex items-center gap-3'>
         <div className='h-14 w-14 overflow-hidden rounded-full border border-slate-200'>
            <img src={userData.profileImage || dp} alt={`${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim() || 'Profile picture'} className='h-full w-full object-cover'/>
        </div>
        <div className='text-lg font-semibold text-slate-900'>{`${userData.firstName} ${userData.lastName}`}</div>
        </div>
      <textarea className={`w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-base text-slate-700 placeholder:text-slate-400 transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100 ${frontendImage?"h-36":"h-52"} resize-none`} placeholder='What do you want to talk about?' value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
      <input type="file" ref={image} hidden onChange={handleImage}/>
          {frontendImage && (
          <div className='mt-4 flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50'>
            <img src={frontendImage} alt="Post preview" className='h-full w-full object-cover'/>
          </div>
          )}


      <div className='mt-6 flex items-center justify-between border-t border-slate-200 pt-4'>
        <button type='button' className='flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50' onClick={()=>image.current?.click()}>
        <BsImage className='h-5 w-5 text-sky-500'/>
        Add image
        </button>
        

        <button className='rounded-full bg-sky-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300' disabled={posting} onClick={handleUploadPost}>
      {posting?"Posting..." : "Share"}
        </button>
       </div>


       </div>
       </div>}
     
 

      <div className='w-full max-w-2xl space-y-6 px-4 lg:px-0'>
        <div className='flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg'>
        <div className='h-14 w-14 overflow-hidden rounded-full border border-slate-200'>
            <img src={userData.profileImage || dp} alt={`${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim() || 'Profile picture'} className='h-full w-full object-cover'/>
        </div>
        <button className='flex h-12 flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-5 text-left text-sm font-semibold text-slate-500 transition hover:border-sky-200 hover:bg-sky-50' onClick={()=>setUploadPost(true)}>Share something with your network...</button>
        </div>

        {(Array.isArray(postData) ? postData : []).map((post,index)=>(
          <Post key={post?._id ?? `post-${index}`} id={post?._id} description={post?.description} author={post?.author} image={post?.image} like={post?.like} comment={post?.comment} createdAt={post?.createdAt}/>
        ))}

       </div>

       <div className='hidden w-full max-w-[320px] flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg lg:flex'>
        <div className='flex items-center justify-between'>
          <h1 className='text-lg font-semibold text-slate-900'>Suggested Connections</h1>
          <span className='text-xs font-semibold uppercase tracking-wide text-slate-400'>Discover</span>
        </div>
         {suggestedUser.length>0 && <div className='flex flex-col gap-3'>
{suggestedUser.map((su)=>(
  <button key={su?._id ?? su?.userName} className='flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-left transition hover:border-sky-200 hover:bg-sky-50' onClick={()=>su?.userName && handleGetProfile(su.userName)}>
  <div className='h-12 w-12 overflow-hidden rounded-full border border-slate-200'>
            <img src={su?.profileImage || dp} alt={`${su?.firstName ?? ''} ${su?.lastName ?? ''}`.trim() || 'Suggested user'} className='h-full w-full object-cover'/>
        </div>
        <div>
        <div className='text-sm font-semibold text-slate-800'>{`${su?.firstName ?? ''} ${su?.lastName ?? ''}`.trim() || 'LinkedIn Member'}</div>
        <div className='text-xs font-medium text-slate-500'>{su?.headline ?? 'Let them know what you do'}</div>
        </div>
  </button>
))}
          </div>}
          {suggestedUser.length===0 && <div className='rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center text-sm font-medium text-slate-500'>
          No suggested users right now.
          </div>}
       </div>

    </div>
  )
}

export default Home
