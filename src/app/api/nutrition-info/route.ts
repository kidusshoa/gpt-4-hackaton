import { NextRequest, NextResponse } from "next/server";
import { queryGPT4o } from "@/utils/openai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { recipe } = body;

  if (!recipe || !recipe.ingredients) {
    return NextResponse.json(
      { error: "Recipe and ingredients are required" },
      { status: 400 }
    );
  }

  try {
    const result = await queryGPT4o({
      inputs: `Provide detailed nutrition information (calories, fats, carbs, protein, etc.) for the following ingredients: ${recipe.ingredients.join(
        ", "
      )}`,
      parameters: { max_new_tokens: 150, temperature: 0.7 },
    });

    return NextResponse.json({ nutrition: result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch nutrition information" },
      { status: 500 }
    );
  }
}
