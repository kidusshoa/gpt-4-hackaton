"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/config/firebase"; // Ensure this path is correct

const LoginPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard"); // Redirect after successful login
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 transform transition-all hover:scale-105">
          <div className="text-center">
            <img
              className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-purple-400"
              src={user.photoURL || "https://via.placeholder.com/100"}
              alt="Profile"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back!
            </h2>
            <p className="text-lg text-gray-600 mb-6">{user.displayName}</p>
            <p className="text-sm text-gray-500 mb-6">{user.email}</p>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white rounded-lg py-3 px-4 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transform transition-all hover:-translate-y-0.5"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 transform transition-all hover:scale-105">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome</h2>
          <p className="text-gray-600 mb-8">
            Please sign in to continue to your account
          </p>
          <button
            onClick={signInWithGoogle}
            className="w-full bg-purple-600 text-white rounded-lg py-3 px-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
