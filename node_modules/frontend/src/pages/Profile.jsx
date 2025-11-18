import React, { useContext, useMemo } from 'react'
import Nav from '../components/Nav'
import dp from "../assets/dp.webp"
import { FiPlus, FiCamera } from "react-icons/fi";
import { userDataContext } from '../context/UserContext';
import { HiPencil } from "react-icons/hi2";
import EditProfile from '../components/EditProfile';
import Post from '../components/Post';
import ConnectionButton from '../components/ConnectionButton';

function Profile() {

    const {userData,edit,setEdit,postData,profileData}=useContext(userDataContext)
    const profileId = profileData?._id ?? null
    const isOwnProfile = Boolean(profileId && userData?._id === profileId)

    const profilePosts=useMemo(()=>(
      profileId
        ? (Array.isArray(postData) ? postData : []).filter(
            (post)=>post?.author?._id === profileId
          )
        : []
    ),[postData,profileId])

    const connectionCount = Array.isArray(profileData?.connection) ? profileData.connection.length : 0
    const skills = Array.isArray(profileData?.skills) ? profileData.skills : []
    const education = Array.isArray(profileData?.education) ? profileData.education : []
    const experience = Array.isArray(profileData?.experience) ? profileData.experience : []
    const fullName = `${profileData?.firstName ?? ''} ${profileData?.lastName ?? ''}`.trim() || 'LinkedIn Member'
    const headline = profileData?.headline ?? ''
    const location = profileData?.location ?? ''

  if(!userData){
    return null
  }

  if(!profileId){
    return (
      <div className='flex min-h-screen w-full flex-col items-center bg-slate-100 pt-[90px]'>
        <Nav/>
        {edit && <EditProfile/>}
        <div className='mt-32 rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center text-slate-500 shadow-lg'>Loading profile...</div>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-slate-100'>
      <Nav/>
      {edit && <EditProfile/>}
      
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 pt-[90px]'>

        <div className='relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl'>
            <button className='relative h-52 w-full overflow-hidden bg-gradient-to-br from-sky-200 via-slate-200 to-white' onClick={()=>setEdit(true)}>
                    {profileData?.coverImage ? (
                      <img src={profileData.coverImage} alt={`${fullName}'s cover`} loading="lazy" className='h-full w-full object-cover'/>
                    ) : (
                      <div className='flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500'>Click to add a cover photo</div>
                    )}
                    <FiCamera className='absolute right-6 top-6 h-7 w-7 text-white drop-shadow'/>
                   </button>
                   <div className='px-8 pb-8 pt-4'>
                     <div className='-mt-16 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between'>
                     <button className='h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg transition hover:scale-[1.02]' onClick={()=>setEdit(true)}>
                        <img src={profileData?.profileImage || dp} alt={`${fullName}'s profile`} loading="lazy" className='h-full w-full object-cover'/>
                      
                    </button>
                    <div className='flex flex-1 flex-col gap-2'>
                    <div className='text-2xl font-semibold text-slate-900'>{fullName}</div>
                    <div className='text-sm font-medium text-slate-500'>{headline}</div>
                    <div className='text-xs font-semibold uppercase tracking-wide text-slate-400'>{location}</div>
                    <div className='text-xs font-semibold text-slate-500'>{`${connectionCount} connection${connectionCount===1 ? '' : 's'}`}</div>
                   </div>
                   {isOwnProfile ? (
                     <button className='flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600' onClick={()=>setEdit(true)}>Edit Profile <HiPencil className='h-4 w-4'/></button>
                   ) : (
                     <div className="mt-4"><ConnectionButton userId={profileId}/></div>
                   )}
                     </div>
                   </div>
        </div>
<div className='rounded-3xl border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-800 shadow'>{`Posts (${profilePosts.length})`}</div>

{profilePosts.map((post,index)=>(
    <Post key={post?._id ?? `profile-post-${index}`} id={post?._id} description={post?.description} author={post?.author} image={post?.image} like={post?.like} comment={post?.comment} createdAt={post?.createdAt}/>
))}

{profilePosts.length===0 && (
  <div className='rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-slate-500 shadow'>
    No posts to display yet.
  </div>
)}
{skills.length>0 && <div  className='rounded-3xl border border-slate-200 bg-white p-6 shadow'>
    <div className='text-lg font-semibold text-slate-900'>Skills</div>
    <div className='mt-4 flex flex-wrap gap-3 text-sm text-slate-600'>
{skills.map((skill,index)=>(
    <span key={`skill-${index}`} className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm'>{skill}</span>
))}
{isOwnProfile && <button className='mt-3 self-start rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50' onClick={()=>setEdit(true)}>Add Skills</button>}

</div>
</div> }
{education.length>0 && <div  className='rounded-3xl border border-slate-200 bg-white p-6 shadow'>
    <div className='text-lg font-semibold text-slate-900 '>Education</div>
    <div className='mt-4 flex flex-col gap-3 text-sm text-slate-600'>
{education.map((edu,index)=>(
    <div key={`education-${index}`} className='rounded-2xl border border-slate-200 bg-slate-50/60 p-4'>
    <div className='font-semibold text-slate-800'>College : <span className='font-medium text-slate-600'>{edu?.college ?? 'N/A'}</span></div>
    <div className='font-semibold text-slate-800'>Degree : <span className='font-medium text-slate-600'>{edu?.degree ?? 'N/A'}</span></div>
    <div className='font-semibold text-slate-800'>Field Of Study : <span className='font-medium text-slate-600'>{edu?.fieldOfStudy ?? 'N/A'}</span></div>
    </div>
))}

{isOwnProfile && <button className='mt-3 self-start rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50' onClick={()=>setEdit(true)}>Add Education</button>}

</div>
</div> }
{experience.length>0 && <div  className='rounded-3xl border border-slate-200 bg-white p-6 shadow'>
    <div className='text-lg font-semibold text-slate-900 '>Experience</div>
    <div className='mt-4 flex flex-col gap-3 text-sm text-slate-600'>
{experience.map((ex,index)=>(
    <div key={`experience-${index}`} className='rounded-2xl border border-slate-200 bg-slate-50/60 p-4'>
    <div className='font-semibold text-slate-800'>Title : <span className='font-medium text-slate-600'>{ex?.title ?? 'N/A'}</span></div>
    <div className='font-semibold text-slate-800'>Company : <span className='font-medium text-slate-600'>{ex?.company ?? 'N/A'}</span></div>
    <div className='font-semibold text-slate-800'>Description : <span className='font-medium text-slate-600'>{ex?.description ?? 'N/A'}</span></div>
    </div>
))}
{isOwnProfile && <button className='mt-3 self-start rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50' onClick={()=>setEdit(true)}>Add Experience</button>}

</div>
</div> }

        </div>
      </div>
  )
}

export default Profile

