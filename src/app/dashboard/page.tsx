"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    vegan: false,
    keto: false,
    glutenFree: false,
    dairyFree: false,
  });
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
    }
  }, [user, router]);

  const handleGenerateRecipes = async () => {
    try {
      setLoading(true);
      setRecipes(null);

      const response = await fetch("/api/generate-recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user?.getIdToken()}`,
        },
        body: JSON.stringify({
          ingredients: ingredients.split("\n"),
          preferences,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok && data.success) {
        setRecipes(data.recipes);
      } else {
        throw new Error(data.message || "Failed to generate recipes");
      }
    } catch (error: any) {
      console.error(error.message);
      toast("generating recipe failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/auth/signin");
    } catch (error) {
      console.error(error);
    }
  };
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  console.log("OpenAI API Key:", apiKey ? "Loaded" : "Not Loaded");

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Recipe Generator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={user?.photoURL || "https://via.placeholder.com/32"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-gray-700">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white rounded-lg py-2 px-4 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Generate Your Recipe
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">
                Enter your ingredients (one per line)
              </label>
              <textarea
                className="w-full h-32 px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g.&#10;2 chicken breasts&#10;1 cup rice&#10;carrots"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Dietary Preferences
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(preferences).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          [key]: e.target.checked,
                        })
                      }
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateRecipes}
              disabled={loading || !ingredients.trim()}
              className={`w-full bg-purple-600 text-white rounded-lg py-3 px-4 font-medium
                ${
                  loading || !ingredients.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-purple-700 transform transition-all hover:-translate-y-0.5"
                }
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Recipes"
              )}
            </button>

            {recipes && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  AI-Generated Recipes
                </h3>
                <pre className="whitespace-pre-wrap">{recipes}</pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
