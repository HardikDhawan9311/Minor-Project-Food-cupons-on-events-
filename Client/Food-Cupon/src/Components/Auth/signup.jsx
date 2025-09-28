import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Signup logic goes here!");
  };

  const handleGoogleSignup = () => {
    alert("Google signup logic goes here!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-300 px-4">
      <div className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-sm border border-white/40">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-indigo-900 drop-shadow">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white/60">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white/60">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-sm"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white/60">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold transition shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-5">
          <button
            onClick={handleGoogleSignup}
            className="w-full bg-white hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 border border-gray-300 shadow-md"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign Up with Google
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-gray-700">
          Already have an account?{" "}
          <a href="/signin" className="text-indigo-600 font-semibold hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
