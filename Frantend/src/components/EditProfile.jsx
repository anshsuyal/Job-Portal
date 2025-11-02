import React, { useContext, useRef, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from '../context/UserContext';
import dp from "../assets/dp.jpg";
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';

function EditProfile() {
  let { edit, setEdit, userData, setUserData, edit2, setEdit2 } = useContext(userDataContext)
  let { serverUrl } = useContext(authDataContext)
  let [firstName, setFirstName] = useState(userData.firstName || "")
  let [lastName, setLastName] = useState(userData.lastName || "")
  let [userName, setUserName] = useState(userData.userName || "")
  let [headline, setHeadline] = useState(userData.headline || "")
  let [location, setLocation] = useState(userData.location || "")
  let [gender, setGender] = useState(userData.gender || "")
  let [skills, setSkills] = useState(userData.skills || [])
  let [newSkills, setNewSkills] = useState("")
  let [education, setEducation] = useState(userData.education || [])
  let [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: ""
  })
  let [experience, setExperience] = useState(userData.experience || [])
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: ""
  })

  let [frontendProfileImage, setFrontendProfileImage] = useState(userData.profileImage || dp)
  let [backendProfileImage, setBackendProfileImage] = useState(null)
  let [frontendCoverImage, setFrontendCoverImage] = useState(userData.coverImage || null)
  let [backendCoverImage, setBackendCoverImage] = useState(null)
  let [saving, setSaving] = useState(false)
  const profileImage = useRef()
  const coverImage = useRef()

  function addSkill(e) {
    e.preventDefault()
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills])
    }
    setNewSkills("")
  }

  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill))
    }
  }

  function addEducation(e) {
    e.preventDefault()
    if (newEducation.college && newEducation.degree && newEducation.fieldOfStudy) {
      setEducation([...education, newEducation])
    }
    setNewEducation({
      college: "",
      degree: "",
      fieldOfStudy: ""
    })
  }

  function addExperience(e) {
    e.preventDefault()
    if (newExperience.title && newExperience.company && newExperience.description) {
      setExperience([...experience, newExperience])
    }
    setNewExperience({
      title: "",
      company: "",
      description: ""
    })
  }

  function removeEducation(edu) {
    if (education.includes(edu)) {
      setEducation(education.filter((e) => e !== edu))
    }
  }

  function removeExperience(exp) {
    if (experience.includes(exp)) {
      setExperience(experience.filter((e) => e !== exp))
    }
  }

  function handleProfileImage(e) {
    let file = e.target.files[0]
    setBackendProfileImage(file)
    setFrontendProfileImage(URL.createObjectURL(file))
  }

  function handleCoverImage(e) {
    let file = e.target.files[0]
    setBackendCoverImage(file)
    setFrontendCoverImage(URL.createObjectURL(file))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      let formdata = new FormData()
      formdata.append("firstName", firstName)
      formdata.append("lastName", lastName)
      formdata.append("userName", userName)
      formdata.append("headline", headline)
      formdata.append("location", location)
      formdata.append("skills", JSON.stringify(skills))
      formdata.append("education", JSON.stringify(education))
      formdata.append("experience", JSON.stringify(experience))

      if (backendProfileImage) {
        formdata.append("profileImage", backendProfileImage)
      }
      if (backendCoverImage) {
        formdata.append("coverImage", backendCoverImage)
      }

      let result = await axios.put(serverUrl + "/api/user/updateprofile", formdata, { withCredentials: true })
      setUserData(result.data)
      setSaving(false)
      setEdit(false)

    } catch (error) {
      console.log(error);
      setSaving(false)
    }
  }

  return (
    <div className='w-full h-[100vh] fixed top-0 left-0 z-[100] flex justify-center items-center p-4'>
      <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfileImage} />
      <input type="file" accept='image/*' hidden ref={coverImage} onChange={handleCoverImage} />
      
      {/* Backdrop */}
      <div 
        className='w-full h-full bg-black/60 absolute top-0 left-0 backdrop-blur-sm transition-opacity duration-300'
        onClick={() => setEdit(false)}
      ></div>
      
      {/* Modal */}
      <div className='w-full max-w-2xl max-h-[90vh] bg-white relative overflow-auto z-[200] shadow-2xl rounded-xl p-6 animate-fade-in'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-800'>Edit Profile</h2>
          <button 
            onClick={() => setEdit(false)}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
          >
            <RxCross1 className='w-6 h-6 text-gray-600 hover:text-gray-800' />
          </button>
        </div>

        {/* Cover Photo */}
        <div className='relative mb-16'>
          <div 
            className='w-full h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl overflow-hidden cursor-pointer group relative'
            onClick={() => coverImage.current.click()}
          >
            {frontendCoverImage && (
              <img src={frontendCoverImage} alt="Cover" className='w-full h-full object-cover' />
            )}
            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
              <FiCamera className='w-6 h-6 text-white' />
            </div>
          </div>
          
          {/* Profile Photo */}
          <div className='absolute -bottom-12 left-6'>
            <div 
              className='w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden cursor-pointer group relative'
              onClick={() => profileImage.current.click()}
            >
              <img src={frontendProfileImage} alt="Profile" className='w-full h-full object-cover' />
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                <FiCamera className='w-5 h-5 text-white' />
              </div>
            </div>
            <div className='absolute bottom-1 right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-sm'>
              <FiPlus className='w-3 h-3 text-white' />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className='space-y-4 max-h-[60vh] overflow-y-auto pr-2'>
          {/* Basic Info Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>First Name</label>
              <input 
                type="text" 
                className='w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none'
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Last Name</label>
              <input 
                type="text" 
                className='w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none'
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Username</label>
            <input 
              type="text" 
              className='w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none'
              value={userName} 
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Headline</label>
            <input 
              type="text" 
              className='w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none'
              value={headline} 
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Location</label>
              <input 
                type="text" 
                className='w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none'
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Gender</label>
              <input 
                type="text" 
                placeholder="Male/Female/Other"
                className='w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none'
                value={gender} 
                onChange={(e) => setGender(e.target.value)}
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Skills</h3>
            {skills.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-3'>
                {skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className='flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm'
                  >
                    <span className='text-sm text-gray-700'>{skill}</span>
                    <button 
                      onClick={() => removeSkill(skill)}
                      className='p-1 hover:bg-gray-100 rounded transition-colors'
                    >
                      <RxCross1 className='w-3 h-3 text-gray-500 hover:text-gray-700' />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className='flex gap-2'>
              <input 
                type="text" 
                placeholder="Add new skill"
                value={newSkills} 
                onChange={(e) => setNewSkills(e.target.value)}
                className='flex-1 h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm'
              />
              <button 
                onClick={addSkill}
                className='px-4 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-sm'
              >
                Add
              </button>
            </div>
          </div>

          {/* Education Section */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Education</h3>
            {education.length > 0 && (
              <div className='space-y-3 mb-4'>
                {education.map((edu, index) => (
                  <div 
                    key={index} 
                    className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-start'
                  >
                    <div className='flex-1'>
                      <div className='font-medium text-gray-900'>{edu.college}</div>
                      <div className='text-sm text-gray-600'>{edu.degree} in {edu.fieldOfStudy}</div>
                    </div>
                    <button 
                      onClick={() => removeEducation(edu)}
                      className='p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2'
                    >
                      <RxCross1 className='w-4 h-4 text-gray-500 hover:text-gray-700' />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className='space-y-3'>
              <input 
                type="text" 
                placeholder="College/University"
                value={newEducation.college} 
                onChange={(e) => setNewEducation({...newEducation, college: e.target.value})}
                className='w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm'
              />
              <input 
                type="text" 
                placeholder="Degree"
                value={newEducation.degree} 
                onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                className='w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm'
              />
              <input 
                type="text" 
                placeholder="Field of Study"
                value={newEducation.fieldOfStudy} 
                onChange={(e) => setNewEducation({...newEducation, fieldOfStudy: e.target.value})}
                className='w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm'
              />
              <button 
                onClick={addEducation}
                className='w-full h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-sm'
              >
                Add Education
              </button>
            </div>
          </div>

          {/* Experience Section */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Experience</h3>
            {experience.length > 0 && (
              <div className='space-y-3 mb-4'>
                {experience.map((exp, index) => (
                  <div 
                    key={index} 
                    className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-start'
                  >
                    <div className='flex-1'>
                      <div className='font-medium text-gray-900'>{exp.title}</div>
                      <div className='text-sm text-gray-600'>{exp.company}</div>
                      <div className='text-sm text-gray-500 mt-1'>{exp.description}</div>
                    </div>
                    <button 
                      onClick={() => removeExperience(exp)}
                      className='p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2'
                    >
                      <RxCross1 className='w-4 h-4 text-gray-500 hover:text-gray-700' />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className='space-y-3'>
              <input 
                type="text" 
                placeholder="Job Title"
                value={newExperience.title} 
                onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                className='w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm'
              />
              <input 
                type="text" 
                placeholder="Company"
                value={newExperience.company} 
                onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                className='w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm'
              />
              <input 
                type="text" 
                placeholder="Description"
                value={newExperience.description} 
                onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                className='w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm'
              />
              <button 
                onClick={addExperience}
                className='w-full h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-sm'
              >
                Add Experience
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className='flex gap-3 pt-6 mt-4 border-t border-gray-200'>
          <button 
            onClick={() => setEdit(false)}
            className='flex-1 h-12 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium'
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveProfile}
            disabled={saving}
            className={`flex-1 h-12 rounded-lg font-medium transition-all duration-200 ${
              saving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {saving ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                Saving...
              </div>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfile