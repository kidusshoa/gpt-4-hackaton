import { NextRequest, NextResponse } from "next/server";
import { queryGPT4o } from "@/utils/openai";

export async function POST(req: NextRequest) {
  try {
    const { ingredients, preferences } = await req.json();

    const preferencesText = Object.entries(preferences)
      .filter(([_, value]) => value)
      .map(([key]) => key.replace(/([A-Z])/g, " $1"))
      .join(", ");

    const prompt = `
      Based on the following ingredients: ${ingredients.join(", ")}, 
      and these dietary preferences: ${preferencesText}, 
      generate a few recipe ideas that fit these preferences.
    `;

    const recipeText = await queryGPT4o({
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ success: true, recipes: recipeText });
  } catch (error: any) {
    console.error("Error generating recipes:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}