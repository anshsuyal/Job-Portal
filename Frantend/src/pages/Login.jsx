import React, { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { UserDataContext } from "../context/userContext";

const Login = () => {
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const { setUserData } = useContext(UserDataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    if (!email || !password) {
      setErr("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        {
          withCredentials: true, // Important: allow cookies
        }
      );

      console.log("Login Response:", result.data);

      alert("Login successful!");

      // Optionally store user data globally
      if (result.data.user) {
        setUserData(result.data.user);
      }

      setLoading(false);
      navigate("/"); // redirect after successful login
    } catch (error) {
      console.error("Login Error:", error);
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      setErr(message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col items-center justify-start gap-[10px]">
      {/* Logo */}
      <div className="p-[30px] lg:p-[35px] w-full h-[80px] flex items-center">
        <img src={logo} alt="Logo" className="w-24 h-auto" />
      </div>

      {/* Login Form */}
      <form
        className="w-[90%] max-w-[400px] md:shadow-xl bg-white rounded-xl p-6 flex flex-col gap-5"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <input
          type="email"
          placeholder="Email"
          disabled={loading}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            className="absolute right-3 top-2.5 text-blue-500 text-sm"
            disabled={loading}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {err && (
          <p className="text-center text-red-500 text-sm mt-[-5px]">*{err}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-[50px] rounded-full mt-[20px] text-white font-semibold transition-all 
          ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-center text-gray-600 mt-2">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
