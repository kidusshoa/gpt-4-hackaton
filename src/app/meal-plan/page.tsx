// pages/meal-plan.tsx
import { useEffect, useState } from "react";

const MealPlanPage = () => {
  const [mealPlan, setMealPlan] = useState([]);

  useEffect(() => {
    // Fetch the generated meal plan
    const fetchMealPlan = async () => {
      const response = await fetch("/api/generate-meal-plan");
      const data = await response.json();
      setMealPlan(data.meals);
    };
    fetchMealPlan();
  }, []);

  return (
    <div>
      <h2>Your Meal Plan</h2>
      {mealPlan.map((meal, index) => (
        <div key={index}>
          <h3>{meal.name}</h3>
          <p>Ingredients: {meal.ingredients.join(", ")}</p>
          <p>Nutrition: {meal.nutrition}</p>
        </div>
      ))}
    </div>
  );
};

export default MealPlanPage;
