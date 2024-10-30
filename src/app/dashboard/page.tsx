import { useState } from "react";
import { useRouter } from "next/router";

const Dashboard = () => {
  const [ingredients, setIngredients] = useState("");
  const [preferences, setPreferences] = useState({
    vegan: false,
    keto: false,
    // Add more preferences as needed
  });
  const router = useRouter();

  const handleGenerateRecipes = async () => {
    // Call API to generate recipes
    await fetch("/api/generate-recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients, preferences }),
    });
    router.push("/recipes");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <textarea
        placeholder="Enter ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={preferences.vegan}
          onChange={(e) =>
            setPreferences({ ...preferences, vegan: e.target.checked })
          }
        />
        Vegan
      </label>
      <label>
        <input
          type="checkbox"
          checked={preferences.keto}
          onChange={(e) =>
            setPreferences({ ...preferences, keto: e.target.checked })
          }
        />
        Keto
      </label>
      <button onClick={handleGenerateRecipes}>Generate Recipes</button>
    </div>
  );
};

export default Dashboard;
