import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

export async function generateAIContent(prompt) {
  try{
    const aiContent = await model.generateContent(prompt);
    return aiContent.response.text();
  }
  catch(err) {
    console.log("Error while generating notification: ", err)
    return ""
  }
}

export async function reelToShortsAiPromptGenerator(promptJSON) {

  const basePrompt = `I need to transform Instagram reel content into optimized YouTube Shorts content. I'll provide you with JSON input as given below:
  JSON Input:
  
  ${JSON.stringify(promptJSON)}

Please analyze this input and generate appropriate YouTube Shorts content as follows:

1. ANALYZE THE TITLE:
   - Parse the title from the JSON
   - Extract any hashtags
   - Clean the title by removing unnecessary dots, spaces, and unparsed characters
   - Determine if there's meaningful title content beyond just hashtags

2. GENERATE YOUTUBE TITLE:
   - If a meaningful title exists:
     - Evaluate if the title relates to the "reelType" provided
     - Check if the title makes sense or is just promotional content
     - Ignore any emails, phone numbers, or URLs in the title
     - Create a catchy, short YouTube Shorts title that matches the theme
   - If no meaningful title OR No title Key OR No value in title key exists:
     - Generate a new catchy YouTube Shorts title based solely on the "reelType"
   - IMPORTANT: All titles must include #shorts #shortsvideo #youtubeshorts at the end
   - IMPORTANT: The title must be less than 100 characters
   - IMPORTANT: The title must be unique and not already used
   - IMPORTANT: The title must be SEO friendly
   - IMPORTANT: The title must have any 1 related emoji not more than 3
   - IMPORTANT: The title must have its grammar checked

3. GENERATE YOUTUBE HASHTAGS:
   - If the original content had hashtags:
     - Filter out Instagram-specific hashtags and personal hashtags
     - Select hashtags appropriate for YouTube Shorts
     - Add relevant new hashtags for YouTube
     - Remove any duplicate hashtags
     - Remove any brand, other company or product hashtags like #tiktok, #instagram, #facebook, etc. except for youtube related hashtags
   - If no hashtags were present:
     - Generate approximately 25 popular hashtags related to the "reelType"

4. PROVIDE THE RESPONSE IN THIS EXACT JSON FORMAT:
{
  "youtubeTitle": "[generated title including #shorts #shortsvideo #youtubeshorts]",
  "description": "[generated hashtags]"
}

Please provide a sample response for the input example I've shared above.

`

  const finalOp = await generateAIContent(basePrompt)
  return parseAIResponseToJSON(finalOp)

}

export async function fallBackTitleGenerator(reelType) {
  const fallbackTitlePrompt = `Generate a title for a YouTube Shorts video about ${reelType} with a catchy and engaging title. 
    Append #shorts #shortsvideo #youtubeshorts at the end of the title.`;
  return await generateAIContent(fallbackTitlePrompt)
}

export function parseAIResponseToJSON(aiResponse) {
  try {
    // Extract the JSON string from between the ```json and ``` markers
    const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);

    if (jsonMatch && jsonMatch[1]) {
      // Parse the extracted JSON string
      return JSON.parse(jsonMatch[1]);
    } else {
      // If there are no code blocks, try parsing the entire string as JSON
      return JSON.parse(aiResponse);
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}