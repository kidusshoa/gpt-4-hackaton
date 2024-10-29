"use client";

import { useState, useEffect } from "react";

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [nutrition, setNutrition] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch("/api/generate-recipes");
      const data = await response.json();
      setRecipes(data.recipes);
    };
    fetchRecipes();
  }, []);

  const handleGetNutrition = async (recipe) => {
    const response = await fetch("/api/nutrition-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipe }),
    });

    const data = await response.json();
    setNutrition(data.nutrition);
  };

  return (
    <div>
      <h2>Generated Recipes</h2>
      {recipes.map((recipe, index) => (
        <div key={index}>
          <h3>{recipe.name}</h3>
          <p>Ingredients: {recipe.ingredients.join(", ")}</p>
          <p>Steps: {recipe.steps}</p>
          <button onClick={() => handleGetNutrition(recipe)}>
            Get Nutrition Info
          </button>
        </div>
      ))}

      {nutrition && (
        <div>
          <h3>Nutrition Info:</h3>
          <p>{JSON.stringify(nutrition)}</p>
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
