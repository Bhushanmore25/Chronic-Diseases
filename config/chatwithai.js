import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in the environment variables');
}

const googleAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiConfig = {
  temperature: 0.9, 
  topP: 1,          
  topK: 1,          
  maxOutputTokens: 4096, 
};

const geminiModel = googleAI.getGenerativeModel({
  model: 'gemini-pro',
  geminiConfig, 
});

const generate = async (input) => {
  try {
    const prompt = `Tell me about ${input}.`;
    // console.log('Generated Prompt:', prompt); 

    const result = await geminiModel.generateContent(prompt, geminiConfig);
    // console.log('Raw API Response:', JSON.stringify(result, null, 2));

    if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const rawText = result.response.candidates[0].content.parts[0].text;

      const structuredResponse = formatResponse(rawText);
      return structuredResponse;
    }

    throw new Error('No content generated in the response candidates');
  } catch (error) {
    console.error('Error in generate function:', error);
    throw new Error('Error generating content');
  }
};

function formatResponse(text) {
  let formattedText = text;

  formattedText = formattedText.replace(/(\*\*[^:]+:\*\*)/g, "<h3 class='section-header'>$1</h3>");

  formattedText = formattedText.replace(/\* (.+)/g, "<ul><li>$1</li></ul>");

  return `<div class="ai-response-container">
            <div class="ai-response">
              ${formattedText}
            </div>
          </div>`;
}

export default generate;
