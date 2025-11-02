import React, { useContext, useEffect, useState } from 'react'
import logo2 from "../assets/icon.png"
import { IoSearchSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotificationsSharp } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import dp from "../assets/dp.jpg";
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

function Nav() {
    let [activeSearch, setActiveSearch] = useState(false)
    let { userData, setUserData, handleGetProfile } = useContext(userDataContext)
    let [showPopup, setShowPopup] = useState(false)
    let navigate = useNavigate()
    let { serverUrl } = useContext(authDataContext)
    let [searchInput, setSearchInput] = useState("")
    let [searchData, setSearchData] = useState([])

    const handleSignOut = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            setUserData(null)
            navigate("/login")
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearch = async () => {
        try {
            if (searchInput.trim()) {
                let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`, { withCredentials: true })
                setSearchData(result.data)
            } else {
                setSearchData([])
            }
        } catch (error) {
            setSearchData([])
            console.log(error)
        }
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch()
        }, 300) // Debounce search

        return () => clearTimeout(timeoutId)
    }, [searchInput])

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setSearchData([])
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    return (
        <div className='w-full h-20 bg-white fixed top-0 shadow-sm border-b border-gray-100 flex justify-between items-center px-4 md:px-8 lg:px-16 left-0 z-50'>
            {/* Left Section - Logo & Search */}
            <div className='flex items-center gap-4 flex-1'>
                {/* Logo */}
                <div 
                    onClick={() => {
                        setActiveSearch(false)
                        navigate("/")
                    }}
                    className='cursor-pointer transform hover:scale-105 transition-transform duration-200'
                >
                    <img src={logo2} alt="Logo" className='w-12 h-12 md:w-14 md:h-14' />
                </div>

                {/* Mobile Search Toggle */}
                {!activeSearch && (
                    <button 
                        className='lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
                        onClick={() => setActiveSearch(true)}
                    >
                        <IoSearchSharp className='w-6 h-6 text-gray-600' />
                    </button>
                )}

                {/* Search Bar */}
                <div className={`relative ${!activeSearch ? "hidden lg:block" : "block"} flex-1 max-w-2xl`}>
                    <form className='w-full h-12 bg-gray-50 flex items-center gap-3 px-4 py-2 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200'>
                        <IoSearchSharp className='w-5 h-5 text-gray-400' />
                        <input 
                            type="text" 
                            className='w-full h-full bg-transparent outline-none border-0 text-gray-700 placeholder-gray-500'
                            placeholder='Search users...' 
                            onChange={(e) => setSearchInput(e.target.value)}
                            value={searchInput}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </form>

                    {/* Search Results */}
                    {searchData.length > 0 && (
                        <div 
                            className='absolute top-14 left-0 right-0 max-h-96 bg-white shadow-xl rounded-xl border border-gray-200 flex flex-col overflow-hidden z-50'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className='p-3 border-b border-gray-100'>
                                <h3 className='text-sm font-semibold text-gray-600'>Search Results</h3>
                            </div>
                            <div className='overflow-y-auto'>
                                {searchData.map((sea, index) => (
                                    <div 
                                        key={sea._id || index}
                                        className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200'
                                        onClick={() => {
                                            handleGetProfile(sea.userName)
                                            setSearchData([])
                                            setSearchInput("")
                                            setActiveSearch(false)
                                        }}
                                    >
                                        <div className='w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0'>
                                            <img 
                                                src={sea.profileImage || dp} 
                                                alt={`${sea.firstName} ${sea.lastName}`}
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <div className='text-base font-semibold text-gray-800 truncate'>{`${sea.firstName} ${sea.lastName}`}</div>
                                            <div className='text-sm text-gray-600 truncate'>{sea.headline}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Section - Navigation & Profile */}
            <div className='flex items-center gap-4 md:gap-6'>
                {/* Navigation Items */}
                <button 
                    className='flex flex-col items-center justify-center cursor-pointer text-gray-600 hover:text-blue-600 group p-2 rounded-lg hover:bg-blue-50 transition-all duration-200'
                    onClick={() => navigate("/")}
                >
                    <TiHome className='w-6 h-6 group-hover:scale-110 transition-transform duration-200' />
                    <div className='text-xs mt-1 hidden md:block'>Home</div>
                </button>

                <button 
                    className='flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 group p-2 rounded-lg hover:bg-blue-50 transition-all duration-200'
                    onClick={() => navigate("/network")}
                >
                    <FaUserGroup className='w-6 h-6 group-hover:scale-110 transition-transform duration-200' />
                    <div className='text-xs mt-1 hidden md:block'>Network</div>
                </button>

                <button 
                    className='flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 group p-2 rounded-lg hover:bg-blue-50 transition-all duration-200'
                    onClick={() => navigate("/notification")}
                >
                    <div className='relative'>
                        <IoNotificationsSharp className='w-6 h-6 group-hover:scale-110 transition-transform duration-200' />
                        {/* Notification badge - you can add logic for count */}
                        {/* <div className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                            3
                        </div> */}
                    </div>
                    <div className='text-xs mt-1 hidden md:block'>Notifications</div>
                </button>

                {/* Profile Dropdown */}
                <div className='relative'>
                    <button 
                        className='w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200'
                        onClick={() => setShowPopup(prev => !prev)}
                    >
                        <img 
                            src={userData?.profileImage || dp} 
                            alt="Profile" 
                            className='w-full h-full object-cover'
                        />
                    </button>

                    {/* Profile Popup */}
                    {showPopup && (
                        <div className='absolute top-14 right-0 w-80 bg-white shadow-2xl rounded-xl border border-gray-200 flex flex-col p-4 z-50 animate-fade-in'>
                            {/* Profile Header */}
                            <div className='flex items-center gap-3 p-3 border-b border-gray-100'>
                                <div className='w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200'>
                                    <img 
                                        src={userData?.profileImage || dp} 
                                        alt="Profile" 
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='text-lg font-semibold text-gray-800 truncate'>{`${userData?.firstName} ${userData?.lastName}`}</div>
                                    <div className='text-sm text-gray-600 truncate'>{userData?.headline || "Update your headline"}</div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <button 
                                className='w-full h-11 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium mt-3 flex items-center justify-center gap-2'
                                onClick={() => {
                                    handleGetProfile(userData?.userName)
                                    setShowPopup(false)
                                }}
                            >
                                View Profile
                            </button>

                            {/* Menu Items */}
                            <div className='space-y-1 mt-3'>
                                <button 
                                    className='w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200'
                                    onClick={() => {
                                        navigate("/network")
                                        setShowPopup(false)
                                    }}
                                >
                                    <FaUserGroup className='w-5 h-5' />
                                    <span>My Network</span>
                                </button>
                                
                                <button 
                                    className='w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200'
                                    onClick={() => {
                                        navigate("/settings")
                                        setShowPopup(false)
                                    }}
                                >
                                    <IoSettingsOutline className='w-5 h-5' />
                                    <span>Settings</span>
                                </button>
                            </div>

                            {/* Sign Out */}
                            <button 
                                className='w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 mt-2 border-t border-gray-100 pt-3'
                                onClick={handleSignOut}
                            >
                                <MdLogout className='w-5 h-5' />
                                <span className='font-medium'>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop for mobile search */}
            {activeSearch && (
                <div 
                    className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
                    onClick={() => setActiveSearch(false)}
                />
            )}
        </div>
    )
}

export default Nav