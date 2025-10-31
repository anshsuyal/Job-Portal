import React, { useContext, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { UserDataContext } from "../context/userContext";
import dp from "../assets/dp.jpg";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

function EditProfile() {
  const { edit, setEdit, userData, setUserData } = useContext(UserDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [firstName, setFirstName] = useState(userData.firstName || "");
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [userName, setUserName] = useState(userData.userName || "");
  const [headline, setHeadline] = useState(userData.headline || "");
  const [location, setLocation] = useState(userData.location || "");
  const [gender, setGender] = useState(userData.gender || "");
  const [skills, setSkills] = useState(userData.skills || []);
  const [newSkill, setNewSkill] = useState("");

  // For image preview
  const [profilePreview, setProfilePreview] = useState(
    userData.profileImage || dp
  );
  const [coverPreview, setCoverPreview] = useState(userData.coverImage || "");

  const profileImage = useRef();
  const coverImage = useRef();

  // Handle image upload preview
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  {
    /* Save Profile Handle */
  }
  const handleSaveProfile = async () => {
    try {
      let formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("userName", userName);
      formdata.append("headline", headline);
      formdata.append("location", location);
      formdata.append("skills", skills);
      formdata.append("experience", experience);

      if (backendProfileImage) {
        formdata.append("profileImage", backendProfileImage);
      }

      if (backendCoverImage) {
        formdata.append("coverImage", backendCoverImage);
      }

      let result = await axios.put(
        serverUrl + "/api/user/updateprofile",
        formdata,
        { withCredentials: true }
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUserData({
      ...userData,
      firstName,
      lastName,
      userName,
      headline,
      location,
      gender,
      skills,
      profileImage: profilePreview,
      coverImage: coverPreview,
    });
    setEdit(false);
  };

  return (
    <div className="w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center overflow-scroll">
      {/* Hidden file inputs */}
      <input
        type="file"
        accept="image/*"
        hidden
        ref={profileImage}
        onChange={handleProfileChange}
      />
      <input
        type="file"
        accept="image/*"
        hidden
        ref={coverImage}
        onChange={handleCoverChange}
      />

      {/* Overlay */}
      <div className="w-full h-full bg-black opacity-[0.5] absolute"></div>

      {/* Main Card */}
      <div className="w-[90%] max-w-[500px] bg-white relative z-[200] shadow-xl rounded-lg overflow-hidden animate-fadeIn">
        {/* Close Button */}
        <div
          className="absolute top-[20px] right-[20px] cursor-pointer hover:scale-110 transition"
          onClick={() => setEdit(false)}
        >
          <RxCross1 className="text-gray-800 w-[25px] h-[25px]" />
        </div>

        {/* Cover Photo */}
        <div
          className="w-full h-[180px] bg-gray-200 relative flex items-center justify-center cursor-pointer"
          onClick={() => coverImage.current.click()}
        >
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-gray-500">Click to upload cover photo</p>
          )}
          <FaCamera className="absolute right-4 top-4 text-white text-xl opacity-80 hover:opacity-100" />
        </div>

        {/* Profile Picture */}
        <div
          className="absolute top-[120px] left-6 w-[80px] h-[80px] rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer"
          onClick={() => profileImage.current.click()}
        >
          <img
            src={profilePreview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form Section */}
        <form
          className="w-full flex flex-col items-center justify-center gap-5 mt-20 px-6 pb-6"
          onSubmit={handleSave}
        >
          {/* FIRST + LAST NAME */}
          <div className="w-full flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none shadow-sm transition-all duration-200"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none shadow-sm transition-all duration-200"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* USERNAME */}
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          {/* HEADLINE */}
          <input
            type="text"
            placeholder="Headline (e.g., Full Stack Developer)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />

          {/* LOCATION */}
          <input
            type="text"
            placeholder="Location"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* GENDER */}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 shadow-sm bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* SKILLS */}
          <div className="w-full border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No skills added yet.</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
              />
              <button
                onClick={handleAddSkill}
                className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition-all duration-200 mt-3"
            onClick={()=>handleSaveProfile()}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
