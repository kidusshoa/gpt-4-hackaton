import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/completions";

if (!OPENAI_API_KEY) {
  throw new Error(
    "Missing OpenAI API key. Please add it to your environment variables."
  );
}

interface OpenAIRequestPayload {
  inputs: string;
  parameters?: {
    max_new_tokens?: number;
    temperature?: number;
    top_p?: number;
    return_text?: boolean;
    [key: string]: any;
  };
}

interface OpenAIResponse {
  choices: Array<{
    text: string;
  }>;
}

export async function queryGPT4o({
  inputs,
  parameters,
}: OpenAIRequestPayload): Promise<string> {
  try {
    const response = await axios.post<OpenAIResponse>(
      OPENAI_API_URL,
      {
        model: "text-davinci-004", // Replace with appropriate model name if different
        prompt: inputs,
        max_tokens: parameters?.max_new_tokens || 100,
        temperature: parameters?.temperature || 0.5,
        top_p: parameters?.top_p || 1.0,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0]?.text.trim() || "No recipe generated.";
  } catch (error: any) {
    console.error(
      "Error querying GPT-4o:",
      error.response?.data || error.message
    );
    throw new Error("Failed to query GPT-4o.");
  }
}
