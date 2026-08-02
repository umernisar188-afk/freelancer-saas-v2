"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  async function login() {

  if (!email.trim()) {
    setError("Email is required.");
    return;
  }
console.log("Email being sent:", email);
console.log("Password length:", password.length);
  if (!password.trim()) {
    setError("Password is required.");
    return;
  }

  setError("");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setError(error.message);
    return;
  }

  router.push("/dashboard");
}
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 flex items-center justify-center px-6">

      {/* Background Blur Circles */}

      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute w-72 h-72 bg-blue-300/30 rounded-full blur-3xl top-10 left-10"
      />

      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
        }}
        className="absolute w-96 h-96 bg-green-300/30 rounded-full blur-3xl bottom-10 right-10"
      />

      {/* Login Card */}

      <motion.div
      whileHover={{
  scale: 1.02,
}}
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="
          w-full
          max-w-md
          rounded-3xl
          backdrop-blur-xl
          bg-white/15
          border
          border-white/30
          shadow-2xl
          p-10
        "
      >

        {/* Logo */}

        <img
          src="/logo.png"
          alt="Logo"
          className="w-20 mx-auto mb-6"
        />

        <h1 className="text-4xl font-extrabold text-white text-center">
          Welcome Back
        </h1>

        <p className="text-white/80 text-center mt-3 mb-8">
          Sign in to continue managing your business.
        </p>
{error && (
  <p className="text-red-300 text-sm mb-4">
    {error}
  </p>
)}
        <input
          placeholder="Email"
          value={email}
onChange={(e) => setEmail(e.target.value)}
          className="
            w-full
            mb-4
            p-4
            rounded-xl
            bg-white/20
            border
            border-white/30
            placeholder:text-white/70
            text-white
            outline-none
          "

          
        />
<div className="relative mb-6">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
onChange={(e) => setPassword(e.target.value)}
    className="
      w-full
      p-4
      rounded-xl
      bg-white/20
      border
      border-white/30
      placeholder:text-white/70
      text-white
      outline-none
    "
    
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
  >
    {showPassword ? "🙈" : "👁"}
  </button>

</div>
<motion.button
  whileHover={{
    scale: 1.05,
  }}
  whileTap={{
    scale: 0.96,
  }}
  onClick={login}
          className="
            w-full
            py-4
            rounded-xl
            bg-white
            text-blue-600
            font-bold
            hover:scale-105
            transition
            duration-300
            shadow-xl
          "
        >
          Login
        </motion.button>
        

        <p className="text-center text-white/80 mt-8">
          Don't have an account?
        </p>
<motion.button
  whileHover={{ scale: 1.05 }}
  onClick={() => router.push("/signup")}
  className="text-white font-bold w-full mt-2"
>
  Create Account
</motion.button>

      </motion.div>

    </main>
  );
}