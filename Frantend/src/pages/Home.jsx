import React, { useState, useContext } from "react";
import Nav from "../components/Nav";
import dp from "../assets/dp.jpg";
import { CiCirclePlus } from "react-icons/ci";
import { FaCamera } from "react-icons/fa";
import { UserDataContext } from "../context/userContext";
import EditProfile from "../components/EditProfile";

const Home = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ✅ Pull everything you need from context
  const { userData, edit, setEdit } = useContext(UserDataContext);

  const suggestions = ["Priya Sharma", "Rohit Verma", "Karan Singh", "Meera Patel"];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#eef2f3] to-[#ffffff] flex flex-col items-center pt-[80px] transition-all duration-300">
      {/* Navbar */}
      <Nav />

      {/* ✅ Edit Profile Modal */}
      {edit && <EditProfile />}

      {/* MAIN CONTAINER */}
      <div className="w-full px-3 sm:px-6 lg:px-10 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT SIDEBAR */}
        <div className="w-full h-[400px] lg:w-[25%] bg-white shadow-md hover:shadow-xl transition-all rounded-2xl relative overflow-hidden">
          {/* Cover */}
          <div
            className="w-full h-[130px] bg-gradient-to-r from-blue-500 to-cyan-400 relative"
            onClick={() => setEdit(true)} // ✅ Now works
          >
            <FaCamera className="absolute right-[15px] top-[15px] w-[20px] text-white opacity-80 hover:opacity-100 cursor-pointer" />
          </div>

          {/* Profile Picture */}
          <div
            className="absolute top-[70px] left-[30px] w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-white cursor-pointer group shadow-md"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img src={dp} alt="Profile" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-[4px] flex items-center justify-center group-hover:scale-110 transition-all shadow">
              <CiCirclePlus size={18} />
            </div>
          </div>

          {/* Info */}
          <div className="mt-[80px] justify-start items-start px-4 pb-5">
            <div className="text-lg font-semibold text-gray-800">
              {`${userData.firstName} ${userData.lastName}`}
            </div>
            <div className="text-ls font-semibold text-gray-800">{userData.headline || ""}</div>
            <div className="text-ls font-semibold text-gray-800">{userData.location}</div>
            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] mt-7 my-6"
              onClick={() => setEdit(true)} // ✅ Fix applied
            >
              Edit Profile
            </button>
          </div>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute top-[180px] left-[30px] bg-white shadow-lg rounded-md w-[160px] py-2 z-10 border border-gray-100 animate-fadeIn">
              {["View Profile", "Settings", "Logout"].map((item, i) => (
                <p
                  key={i}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors"
                >
                  {item}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* MIDDLE SECTION (FEED) */}
        <div className="w-full lg:w-[50%] bg-white shadow-md hover:shadow-xl transition-all rounded-2xl p-4 min-h-[400px]">
          {/* Create Post */}
          <div className="flex items-center gap-3 border-b pb-4 mb-5">
            <img
              src={dp}
              alt="dp"
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            <input
              type="text"
              placeholder="What's on your mind, Ansh?"
              className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          {/* Posts */}
          <div className="flex flex-col gap-5">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-3 p-3">
                  <img
                    src={dp}
                    alt="profile"
                    className="w-[40px] h-[40px] rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Ansh</p>
                    <p className="text-xs text-gray-500">2 hrs ago</p>
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800"
                  alt="post"
                  className="w-full h-[300px] object-cover transition-transform duration-300 hover:scale-[1.01]"
                />
                <div className="p-3">
                  <p className="text-sm text-gray-700 leading-snug">
                    Another great workout day 💪🔥 #FitnessJourney
                  </p>
                  <div className="flex gap-6 mt-3 text-gray-600 text-sm">
                    {["❤️ Like", "💬 Comment", "↗️ Share"].map((action, idx) => (
                      <button
                        key={idx}
                        className="hover:text-blue-500 font-medium transition"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-full lg:w-[25%] bg-white shadow-md hover:shadow-xl transition-all rounded-2xl p-4">
          <h2 className="font-semibold text-gray-800 mb-4 text-lg">
            People You May Know
          </h2>
          <div className="flex flex-col gap-4">
            {suggestions.map((name, i) => (
              <div
                key={i}
                className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={dp}
                    alt={name}
                    className="w-[40px] h-[40px] rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{name}</p>
                    <p className="text-xs text-gray-500">Followed by Rahul</p>
                  </div>
                </div>
                <button className="text-blue-600 text-sm font-semibold hover:underline transition">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
