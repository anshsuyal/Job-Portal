import React, { useContext, useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import dp from "../assets/dp.jpg";
import { FiPlus, FiCamera } from "react-icons/fi";
import { HiPencil } from "react-icons/hi2";
import { RxCross1 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
import EditProfile from "../components/EditProfile";

function Home() {
  const {
    userData,
    edit,
    setEdit,
    postData,
    getPost,
    handleGetProfile,
  } = useContext(userDataContext);

  const { serverUrl } = useContext(authDataContext);

  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState("");
  const [description, setDescription] = useState("");
  const [uploadPost, setUploadPost] = useState(false);
  const [posting, setPosting] = useState(false);
  const [suggestedUser, setSuggestedUser] = useState([]);
  const image = useRef();

  // Handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  // Handle post upload
  const handleUploadPost = async () => {
    setPosting(true);
    try {
      const formdata = new FormData();
      formdata.append("description", description);
      if (backendImage) formdata.append("image", backendImage);

      await axios.post(`${serverUrl}/api/post/create`, formdata, {
        withCredentials: true,
      });
      setPosting(false);
      setUploadPost(false);
      setDescription("");
      setFrontendImage("");
      getPost();
    } catch (error) {
      setPosting(false);
      console.log(error);
    }
  };

  const handleSuggestedUsers = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/suggestedusers`, {
        withCredentials: true,
      });
      setSuggestedUser(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSuggestedUsers();
    getPost();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f9fafb] to-[#eef2f3] pt-[90px] flex flex-col lg:flex-row items-start justify-center gap-6 px-4 pb-10">
      <Nav />
      {edit && <EditProfile />}

      {/* LEFT SIDEBAR */}
      <div className="w-full lg:w-[25%] bg-white rounded-2xl shadow-lg overflow-hidden sticky top-[90px]">
        {/* Cover Section */}
        <div
          className="relative w-full h-[120px] bg-gradient-to-r from-[#24b2ff] to-[#0077b6] cursor-pointer"
          onClick={() => setEdit(true)}
        >
          <img
            src={userData.coverImage || ""}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <FiCamera className="absolute right-4 top-4 text-white bg-black/40 p-2 rounded-full w-8 h-8" />
        </div>

        {/* Profile Section */}
        <div className="relative flex flex-col items-center -mt-12 pb-4">
          <div
            className="w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-white shadow-md cursor-pointer"
            onClick={() => setEdit(true)}
          >
            <img
              src={userData.profileImage || dp}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <FiPlus className="absolute right-[43%] top-[72px] bg-[#17c1ff] text-white rounded-full p-[2px] w-5 h-5 cursor-pointer" />
          <h2 className="mt-3 text-lg font-semibold text-gray-800">
            {userData.firstName} {userData.lastName}
          </h2>
          <p className="text-sm text-gray-500">{userData.headline}</p>
          <p className="text-xs text-gray-400 mt-1">{userData.location}</p>

          <button
            className="mt-4 w-[90%] py-2 border border-[#24b2ff] text-[#24b2ff] rounded-full flex items-center justify-center gap-2 hover:bg-[#24b2ff] hover:text-white transition-all duration-300"
            onClick={() => setEdit(true)}
          >
            Edit Profile <HiPencil />
          </button>
        </div>
      </div>

      {/* CENTER FEED */}
      <div className="w-full lg:w-[50%] flex flex-col gap-6">
        {/* Post Creator */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
          <img
            src={userData.profileImage || dp}
            alt=""
            className="w-[55px] h-[55px] rounded-full object-cover"
          />
          <button
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-gray-500 hover:bg-gray-100 transition-all text-left"
            onClick={() => setUploadPost(true)}
          >
            start post 
          </button>
        </div>

        {/* Posts Section */}
        {postData.map((post, index) => (
          <Post
            key={index}
            id={post._id}
            description={post.description}
            author={post.author}
            image={post.image}
            like={post.like}
            comment={post.comment}
            createdAt={post.createdAt}
          />
        ))}
      </div>

      {/* RIGHT SIDEBAR - SUGGESTED USERS */}
      <div className="hidden lg:flex flex-col w-[25%] bg-white rounded-2xl shadow-lg p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Suggested Users
        </h2>
        {suggestedUser.length > 0 ? (
          <div className="flex flex-col gap-3">
            {suggestedUser.map((su) => (
              <div
                key={su._id}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all"
                onClick={() => handleGetProfile(su.userName)}
              >
                <img
                  src={su.profileImage || dp}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {su.firstName} {su.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">{su.headline}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            No Suggested Users
          </p>
        )}
      </div>

      {/* POST MODAL */}
      {uploadPost && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40"></div>
          <div className="fixed top-1/2 left-1/2 w-[90%] max-w-[500px] bg-white rounded-2xl shadow-2xl p-6 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Create a Post
              </h2>
              <RxCross1
                className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-500 transition"
                onClick={() => setUploadPost(false)}
              />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={userData.profileImage || dp}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <h3 className="text-md font-semibold text-gray-700">
                {userData.firstName} {userData.lastName}
              </h3>
            </div>

            <textarea
              placeholder="Share your thoughts..."
              className="w-full h-[120px] resize-none border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#24b2ff]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {frontendImage && (
              <div className="w-full h-[250px] rounded-lg overflow-hidden mt-3 flex items-center justify-center bg-gray-100">
                <img
                  src={frontendImage}
                  alt=""
                  className="object-contain h-full w-full"
                />
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <BsImage
                className="w-6 h-6 text-gray-600 cursor-pointer hover:text-[#24b2ff] transition"
                onClick={() => image.current.click()}
              />
              <input type="file" hidden ref={image} onChange={handleImage} />
              <button
                className="bg-[#24b2ff] text-white px-6 py-2 rounded-full hover:bg-[#1a9bdf] transition"
                disabled={posting}
                onClick={handleUploadPost}
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
