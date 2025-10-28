import React, { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl } = useContext(authDataContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmailName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err,setErr] = useState("")

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!firstName || !lastName || !userName || !email || !password) {
      alert("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { firstName, lastName, userName, email, password },
        { withCredentials: true }
      );

      console.log(result);
      alert("Signup successful! Please log in.");

      // Reset form and loader
      setErr("");
      setFirstName("");
      setLastName("");
      setEmailName("");
      setPassword("");
      setUserName("");
      setLoading(false);

      navigate("/login");
    } catch (error) {
      setErr(error.response.data.message)
      setLoading(false);
      alert(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col items-center justify-start gap-[10px]">
      {/* Logo */}
      <div className="p-[30px] lg:p-[35px] w-full h-[80px] flex items-center">
        <img src={logo} alt="Logo" className="w-24 h-auto" />
      </div>

      {/* Form */}
      <form
        className="w-[90%] max-w-[400px] md:shadow-xl bg-white rounded-xl p-6 flex flex-col gap-5"
        onSubmit={handleSignUp}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>

        <input
          type="text"
          placeholder="First Name"
          disabled={loading}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          disabled={loading}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          disabled={loading}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          disabled={loading}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmailName(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            disabled={loading}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-2.5 text-blue-500"
            disabled={loading}
          >
            {showPassword ? "Hide" : "show"}
          </button>
        </div>
        {err && <p className="text-center text-red-500">
        *{err}
        </p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-[50px] rounded-full mt-[20px] text-white font-semibold transition-all 
          ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-600 mt-2">
          Already have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
