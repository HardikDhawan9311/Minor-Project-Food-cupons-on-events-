// import { useState } from "react";
// import { FaUser, FaLock } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { saveToken } from "../../utils/auth";



// const SignIn = () => {
//   // Step 1: State for form data
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState(""); 
//   const navigate = useNavigate();


//   // Step 2: Update input values
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Step 3: Handle form submission
//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const response = await fetch("http://localhost:5000/auth/signin", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Invalid credentials");
//     }

//     // ✅ Save JWT token
//     if (data.token) {
//       saveToken(data.token);
//     }



    
//       setMessageType("success");
//       setMessage("✅ Login successful! Redirecting to your home page...");

//       // Wait 2 seconds before redirect
//       setTimeout(() => navigate("/home"), 2000);
//   } catch (err) {
//     alert(`Login failed: ${err.message}`);
//   }
// };



//   // Step 4: Handle Google login
//   const handleGoogleLogin = () => {
//     alert("Google login logic goes here!");
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-300 px-4">
//       <div className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-sm border border-white/40">
//         {/* Title */}
//         <h2 className="text-3xl font-extrabold text-center mb-6 text-indigo-900 drop-shadow">
//           Welcome Back
//         </h2>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Username */}
//           <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white/60">
//             <FaUser className="text-gray-500 mr-2" />
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               onChange={handleChange}
//               className="w-full bg-transparent focus:outline-none text-sm"
//             />
//           </div>

//           {/* Password */}
//           <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white/60">
//             <FaLock className="text-gray-500 mr-2" />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               onChange={handleChange}
//               className="w-full bg-transparent focus:outline-none text-sm"
//             />
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold transition shadow-lg"
//           >
//             Log In
//           </button>
//         </form>

//         {/* Google Login */}
//         <div className="mt-5">
//           <button
//             onClick={handleGoogleLogin}
//             className="w-full bg-white hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 border border-gray-300 shadow-md"
//           >
//             <img
//               src="https://www.svgrepo.com/show/475656/google-color.svg"
//               alt="Google"
//               className="w-5 h-5"
//             />
//             Log In with Google
//           </button>
//         </div>

//         {/* Footer */}
//         <p className="mt-5 text-center text-xs text-gray-700">
//           Don’t have an account?{" "}
//           <a
//             href="/"
//             className="text-indigo-600 font-semibold hover:underline"
//           >
//             Sign Up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignIn;


import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";

const SignIn = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      saveToken(data.token);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E]">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">

        <h2 className="text-3xl font-bold text-white text-center">
          Welcome Back 👋
        </h2>
        <p className="text-gray-300 text-center mb-6">
          Login to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full pl-12 py-3 rounded-xl bg-white/15 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7F5AF0]"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full pl-12 py-3 rounded-xl bg-white/15 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7F5AF0]"
            />
          </div>

          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7F5AF0] to-[#C77DFF] text-white font-semibold hover:scale-[1.02] transition">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Don’t have an account?{" "}
          <a href="/" className="text-[#C77DFF] font-semibold">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
