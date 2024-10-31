"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./../../../config/firebase";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign In</h2>
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className={`w-full bg-purple-600 text-white rounded-lg py-3 px-4 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
          >
            {loading ? "Loading..." : "Sign in with Google"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
