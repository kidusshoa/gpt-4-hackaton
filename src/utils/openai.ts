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

// Function to query GPT-4o
export const queryGPT4o = async (
  payload: OpenAIRequestPayload
): Promise<string> => {
  try {
    const response = await axios.post<OpenAIResponse>(
      OPENAI_API_URL,
      {
        model: "gpt-4o", // Specify the model (if required, e.g., GPT-4o)
        prompt: payload.inputs,
        max_tokens: payload.parameters?.max_new_tokens || 100,
        temperature: payload.parameters?.temperature || 0.7,
        top_p: payload.parameters?.top_p || 1.0,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract and return the text from the first completion choice
    const outputText = response.data.choices[0]?.text.trim();
    return outputText || "No output from the model.";
  } catch (error) {
    console.error("Error querying GPT-4o:", error);
    throw new Error("Failed to fetch data from GPT-4o");
  }
};
