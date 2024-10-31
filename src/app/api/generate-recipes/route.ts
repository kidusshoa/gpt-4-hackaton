import { NextRequest, NextResponse } from "next/server";
import { queryGPT4o } from "@/utils/openai";

export async function POST(req: NextRequest) {
  try {
    const { ingredients, preferences } = await req.json();

    if (!ingredients || !preferences) {
      throw new Error("Missing ingredients or preferences");
    }

    // Convert preferences into readable text
    const preferencesText = Object.entries(preferences)
      .filter(([_, value]) => value) // Only include true values
      .map(([key]) => key.replace(/([A-Z])/g, " $1")) // Add spaces before capital letters
      .join(", ");

    // Formulate the prompt for GPT-4o
    const prompt = `
      Based on the following ingredients: ${ingredients.join(", ")}, 
      and these dietary preferences: ${preferencesText}, 
      generate a few recipe ideas that fit these preferences.
    `;

    // Call the OpenAI API via the queryGPT4o function
    const recipeText = await queryGPT4o({
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
      },
    });

    // Return the generated recipe text in the response
    return NextResponse.json({ success: true, recipes: recipeText });
  } catch (error: any) {
    console.error("Error generating recipes:", error); // Log the error for debugging
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
