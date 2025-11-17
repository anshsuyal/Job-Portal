import React, { useCallback, useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { RxCross1 } from "react-icons/rx";
import dp from "../assets/dp.webp"
import { userDataContext } from '../context/UserContext';

const getErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong'

function Notification() {

const {serverUrl}=useContext(authDataContext)
const [notificationData,setNotificationData]=useState([])
const {userData}=useContext(userDataContext)

const handleGetNotification=useCallback(async ()=>{
    try {
        const result=await axios.get(`${serverUrl}/api/notification/get`,{withCredentials:true})
        setNotificationData(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
        console.error('Failed to fetch notifications:', getErrorMessage(error))
        setNotificationData([])
    }
},[serverUrl])
const handledeleteNotification=useCallback(async (id)=>{
    if(!id){
        return
    }
    try {
        await axios.delete(`${serverUrl}/api/notification/deleteone/${id}`,{withCredentials:true})
        await handleGetNotification()
    } catch (error) {
        console.error('Failed to delete notification:', getErrorMessage(error))
    }
},[handleGetNotification,serverUrl])
const handleClearAllNotification=useCallback(async ()=>{
    try {
        await axios.delete(`${serverUrl}/api/notification`,{withCredentials:true})
        setNotificationData([])
    } catch (error) {
        console.error('Failed to clear notifications:', getErrorMessage(error))
    }
},[serverUrl])
const handleMessage=(type)=>{
if(type==="like"){
    return "liked your post"
}else if(type==="comment"){
    return "commented on your post"
}else{
    return "accepted your connection"
}
}

useEffect(()=>{
    handleGetNotification()
},[handleGetNotification])

if(!userData){
    return null
}

const notifications = Array.isArray(notificationData) ? notificationData : []

  return (
    <div className='min-h-screen w-full bg-slate-100 pb-16 pt-[90px]'>
      <Nav/>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-6 px-4'>
        <div className='flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow'>
        <div className='text-lg font-semibold text-slate-800'>
Notifications <span className='text-sky-500'>{notifications.length}</span>
</div>
{notifications.length>0 && <button className='rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-100' onClick={handleClearAllNotification}>Clear all</button>}

        </div>
      
            {notifications.length>0 && <div className='flex flex-col gap-4'>
          {notifications.map((noti)=>(
              <div className='flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow transition hover:shadow-lg' key={noti?._id ?? `${noti?.type}-${noti?.createdAt}`}>
                <div className='flex items-center justify-between gap-4'>
                <button className='flex flex-1 items-center gap-4 text-left'>
      <div className='h-14 w-14 overflow-hidden rounded-full border border-slate-200'>
                  <img src={noti?.relatedUser?.profileImage || dp} alt={`${noti?.relatedUser?.firstName ?? ''} ${noti?.relatedUser?.lastName ?? ''}`.trim() || 'User profile'} className='h-full w-full object-cover'/>
              </div>
              <div className='text-sm font-semibold text-slate-700'>
                {`${noti?.relatedUser?.firstName ?? 'Someone'} ${noti?.relatedUser?.lastName ?? ''}`.trim()} {handleMessage(noti?.type)}
                </div>
                </button>
              <button className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-red-100 hover:text-red-500' onClick={()=>handledeleteNotification(noti?._id)}>
      <RxCross1 className='h-5 w-5' />
              </button> 
              </div>
                  {noti?.relatedPost?.image && 
                  <div className='ml-16 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3'>
                  <div className='h-16 w-20 overflow-hidden rounded-xl border border-slate-200'>
                  <img src={noti.relatedPost.image} alt="Post preview" className='h-full w-full object-cover'/>
                  </div>
                  <div className='text-sm font-medium text-slate-600'>{noti.relatedPost.description}</div>
               </div>
                  }
 

                  </div>
          ))}
        </div>}
        {notifications.length===0 && (
          <div className='rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-slate-500 shadow'>
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification
