import React, { useContext, useState, useRef, useEffect } from "react";
import icon from "../assets/icon.png";
import { CiSearch } from "react-icons/ci";
import { IoMdHome } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoNotifications, IoClose } from "react-icons/io5";
import dp from "../assets/dp.jpg";
import { UserDataContext } from "../context/userContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const [activeSearch, setActiveSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { userData,setUserData } = useContext(UserDataContext);
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();
  const menuRef = useRef();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null)
      navigate("/login"); // ✅ Redirects to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full h-[80px] bg-white fixed top-0 shadow-md flex justify-between md:justify-around items-center px-4 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <img src={icon} alt="Logo" className="w-[45px] h-[45px]" />

        {/* Search Icon (mobile only) */}
        {!activeSearch && (
          <CiSearch
            className="w-[25px] h-[25px] text-gray-600 lg:hidden cursor-pointer"
            onClick={() => setActiveSearch(true)}
          />
        )}

        {/* Search Bar */}
        <form
          className={`flex items-center gap-2 border border-gray-300 px-4 py-2 bg-gray-100 rounded-full transition-all duration-300 ${
            activeSearch ? "flex animate-fadeIn" : "hidden"
          } lg:flex`}
          aria-label="Search"
        >
          <CiSearch className="text-xl text-gray-600" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-gray-700 w-[200px] sm:w-[300px]"
          />
          <IoClose
            className="text-2xl text-gray-500 cursor-pointer lg:hidden"
            onClick={() => setActiveSearch(false)}
          />
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 relative">
        {/* Home */}
        <div className="hidden lg:flex flex-col items-center cursor-pointer hover:text-blue-600">
          <IoMdHome className="text-2xl" />
          <span className="text-sm">Home</span>
        </div>

        {/* My Network */}
        <div className="hidden lg:flex flex-col items-center cursor-pointer hover:text-blue-600">
          <FaUser className="text-2xl" />
          <span className="text-sm">My Network</span>
        </div>

        {/* Notifications */}
        <div className="flex flex-col items-center cursor-pointer hover:text-blue-600">
          <IoNotifications className="text-2xl" />
          <span className="text-sm hidden md:block">Notifications</span>
        </div>

        {/* Profile Picture */}
        <div
          className="w-[45px] h-[45px] rounded-full overflow-hidden border border-gray-300 cursor-pointer"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <img src={dp} alt="Profile" className="w-full h-full object-cover" />
        </div>

        {/* Profile Dropdown */}
        {showProfileMenu && (
          <div
            ref={menuRef}
            className="w-[280px] bg-white shadow-xl absolute top-[75px] right-0 rounded-lg flex flex-col items-center p-[20px] gap-[12px] animate-fadeIn"
          >
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden border border-gray-300">
              <img src={dp} alt="Profile" className="w-full h-full object-cover" />
            </div>

            <div className="font-semibold text-gray-800 text-lg text-center">
              {userData?.firstName} {userData?.lastName}
            </div>

            <button className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 w-[80%] transition-all">
              View Profile
            </button>

            <button className="flex items-center justify-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 w-[80%] transition-all">
              <FaUser className="text-md" />
              <span>My Network</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 w-[80%] transition-all"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
