import React, { useCallback, useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import dp from "../assets/dp.webp"
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";

const getErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong'

function Network() {
const {serverUrl}=useContext(authDataContext)
const [connections,setConnections]=useState([])
const [isLoading,setIsLoading]=useState(false)

    const handleGetRequests=useCallback(async ()=>{
        setIsLoading(true)
        try {
            const result=await axios.get(`${serverUrl}/api/connection/requests`,{withCredentials:true})
            setConnections(Array.isArray(result.data) ? result.data : [])
        } catch (error) {
           console.error('Failed to fetch connection requests:', getErrorMessage(error)) 
           setConnections([])
        } finally {
            setIsLoading(false)
        }
    },[serverUrl])
    const handleAcceptConnection=async (requestId)=>{
if(!requestId){
    return
}
try {
    await axios.put(`${serverUrl}/api/connection/accept/${requestId}`,{},{withCredentials:true})
    setConnections((prev)=>prev.filter((con)=>con?._id!==requestId))
} catch (error) {
    console.error('Failed to accept connection:', getErrorMessage(error))
}
    }
    const handleRejectConnection=async (requestId)=>{
        if(!requestId){
            return
        }
        try {
            await axios.put(`${serverUrl}/api/connection/reject/${requestId}`,{},{withCredentials:true})
            setConnections((prev)=>prev.filter((con)=>con?._id!==requestId))
        } catch (error) {
            console.error('Failed to reject connection:', getErrorMessage(error))
        }
            }

            
    useEffect(()=>{
        handleGetRequests()
    },[handleGetRequests])

    const pendingRequests = Array.isArray(connections) ? connections : []

  return (
    <div className='min-h-screen w-full bg-slate-100 pb-16 pt-[90px]'>
        <Nav/>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 px-4'>
      <div className='flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow'>
<span className='text-lg font-semibold text-slate-800'>Invitations <span className='text-sky-500'>{pendingRequests.length}</span></span>
      </div>

      {isLoading && (
        <div className='rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow'>
          Loading requests...
        </div>
      )}

      {!isLoading && pendingRequests.length>0 &&  <div className='flex flex-col gap-4'>
    {pendingRequests.map((connection)=>(
        <div className='flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow transition hover:shadow-lg' key={connection?._id}>
          <div className='flex items-center gap-4'>
<div className='h-14 w-14 overflow-hidden rounded-full border border-slate-200'>
            <img src={connection?.sender?.profileImage || dp} alt={`${connection?.sender?.firstName ?? ''} ${connection?.sender?.lastName ?? ''}`.trim() || 'User profile'} className='h-full w-full object-cover'/>
        </div>
        <div className='flex flex-col'>
        <div className='text-base font-semibold text-slate-800'>{`${connection?.sender?.firstName ?? 'LinkedIn'} ${connection?.sender?.lastName ?? 'Member'}`.trim()}</div>
        <span className='text-xs font-medium uppercase tracking-wide text-slate-400'>Pending invitation</span>
        </div>
            </div>  
        <div className='flex items-center gap-3'>
<button className='flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600' onClick={()=>handleAcceptConnection(connection?._id)}>
<IoIosCheckmarkCircleOutline className='h-5 w-5'/>
Accept
</button>
<button className='flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-100' onClick={()=>handleRejectConnection(connection?._id)}>
<RxCrossCircled className='h-5 w-5'/>
Decline
</button>
        </div> 
        </div>
    ))}
  </div>}
 
      {!isLoading && pendingRequests.length===0 && (
        <div className='rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-slate-500 shadow'>
          No pending invitations.
        </div>
      )}

      </div>
    </div>
  )
}

export default Network
