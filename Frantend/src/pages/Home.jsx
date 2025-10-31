import React, { useState, useContext, memo, useRef } from "react";
import Nav from "../components/Nav";
import dp from "../assets/dp.jpg";
import { CiCirclePlus } from "react-icons/ci";
import { FaCamera } from "react-icons/fa";
import { UserDataContext } from "../context/userContext";
import EditProfile from "../components/EditProfile";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

// ✅ Suggestion Card
const SuggestionCard = memo(({ name }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-none">
    <div className="flex items-center gap-3">
      <img src={dp} alt={name} className="w-10 h-10 rounded-full object-cover border" />
      <p className="text-sm font-medium text-gray-700">{name}</p>
    </div>
    <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
      Connect
    </button>
  </div>
));

// ✅ Suggestion List
const SuggestionList = memo(({ suggestions }) => (
  <div className="space-y-2">
    {suggestions.map((name, index) => (
      <SuggestionCard key={index} name={name} />
    ))}
  </div>
));

const Home = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { userData = {}, edit, setEdit } = useContext(UserDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState("");
  const [description, setDescription] = useState("");
  const [uploadPost, setUploadPost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const image = useRef();

  const suggestions = ["Priya Sharma", "Rohit Verma", "Karan Singh", "Meera Patel"];

  const handleToggleProfileMenu = () => setShowProfileMenu((prev) => !prev);
  const handleEditProfile = () => setEdit(true);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleUploadPost = async (e) => {
    e.preventDefault();
    if (!description && !backendImage) return setMessage("⚠️ Add text or image");

    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("description", description);
      if (backendImage) formdata.append("image", backendImage);

      const res = await axios.post(`${serverUrl}/api/post/create`, formdata, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMessage("✅ Post uploaded successfully!");
        setDescription("");
        setFrontendImage("");
        setBackendImage("");
        setUploadPost(false);
      } else {
        setMessage("❌ Upload failed, please try again");
      }
    } catch (err) {
      console.error("Upload Error:", err.response?.data || err.message);
      setMessage("⚠️ Server error: " + (err.response?.data?.message || "try again later"));
    } finally {
      setLoading(false);
    }
  };

  const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
  const profileImage = userData.profileImage || dp;
  const coverImage = userData.coverImage || "";

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#eef2f3] to-[#ffffff] flex flex-col items-center pt-[80px] relative">
      <Nav />
      {edit && <EditProfile />}

      <div className="w-full px-3 sm:px-6 lg:px-10 py-6 flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDEBAR */}
        <aside className="w-full lg:w-[25%] bg-white shadow-md rounded-2xl relative overflow-hidden">
          <div
            className="w-full h-[130px] bg-gradient-to-r from-blue-500 to-cyan-400 relative cursor-pointer"
            onClick={handleEditProfile}
          >
            {coverImage ? (
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <p className="text-gray-100 text-center pt-[50px]">Add Cover Photo</p>
            )}
            <FaCamera className="absolute right-4 top-4 w-5 text-white opacity-80" />
          </div>

          <div
            className="absolute top-[70px] left-[30px] w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-white shadow-md cursor-pointer"
            onClick={handleToggleProfileMenu}
          >
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-[4px]">
              <CiCirclePlus size={18} />
            </div>
          </div>

          <div className="mt-[80px] px-4 pb-5">
            <h3 className="text-lg font-semibold text-gray-800">{fullName || "User"}</h3>
            <p className="text-sm text-gray-600">{userData.headline || "No headline provided"}</p>
            <p className="text-sm text-gray-500">{userData.location || "No location"}</p>

            <button
              className="w-full h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] mt-7 hover:bg-[#2dc0ff] hover:text-white transition"
              onClick={handleEditProfile}
            >
              Edit Profile
            </button>
          </div>
        </aside>

        {/* CREATE POST MODAL */}
        {uploadPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="w-[90%] max-w-[500px] bg-white rounded-2xl shadow-2xl p-6 relative">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Create Post</h2>
                <button
                  onClick={() => setUploadPost(false)}
                  className="text-gray-600 hover:text-gray-800 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border" />
                <div>
                  <p className="font-semibold text-gray-800">{fullName || "User"}</p>
                  <p className="text-xs text-gray-500">Public 🌍</p>
                </div>
              </div>

              <textarea
                placeholder="What's on your mind?"
                className="w-full h-[120px] resize-none text-gray-700 border-none outline-none mb-4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div className="border border-gray-200 rounded-lg p-3 mb-4 flex items-center justify-between">
                <label htmlFor="uploadImg" className="text-blue-500 cursor-pointer hover:text-blue-600">
                  📷 Add Photo
                </label>
                <input id="uploadImg" type="file" ref={image} className="hidden" onChange={handleImage} />
                {frontendImage ? (
                  <img src={frontendImage} alt="preview" className="w-14 h-14 rounded-lg object-cover border ml-2" />
                ) : (
                  <span className="text-gray-400 text-sm">Optional</span>
                )}
              </div>

              <button
                className={`w-full py-2.5 rounded-full font-medium text-white ${
                  loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-400"
                }`}
                onClick={handleUploadPost}
                disabled={loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>

              {message && <p className="text-center text-sm text-gray-700 mt-3">{message}</p>}
            </div>
          </div>
        )}

        {/* FEED + RIGHT SIDEBAR */}
        <div className="w-full lg:w-[50%] bg-white shadow-md rounded-2xl p-4 min-h-[400px]">
          <div className="flex items-center gap-3 border-b pb-4 mb-5">
            <img src={profileImage} alt="dp" className="w-[45px] h-[45px] rounded-full object-cover" />
            <button
              className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100"
              onClick={() => setUploadPost(true)}
            >
              Start a post
            </button>
          </div>
        </div>

        <aside className="w-full lg:w-[25%] bg-white shadow-md rounded-2xl p-4">
          <h2 className="font-semibold text-gray-800 mb-4 text-lg">People You May Know</h2>
          <SuggestionList suggestions={suggestions} />
        </aside>
      </div>
    </div>
  );
};

export default memo(Home);
