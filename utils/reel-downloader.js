import { fallBackTitleGenerator, reelToShortsAiPromptGenerator } from "./gemini-helper.js";
import dotenv from "dotenv";
dotenv.config();

export async function downloadReel(reelUrl, reelType) {
  const url = `${process.env.RAPID_API_URL}?url=${reelUrl}&reelType=${reelType}`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': process.env.RAPID_API_HOST
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    const reelToShortsAiInputJSON  = {
      title: result.title,
      reelType,
    }

    const { youtubeTitle, description } = await reelToShortsAiPromptGenerator(reelToShortsAiInputJSON);

    let title;
    if (result.links.length > 0) {

      if(!youtubeTitle) {
        title = await fallBackTitleGenerator(reelType);
      } else {
        title = youtubeTitle;
        }

      return {
        downloadUrl: result.links[1].link,
        youtubeTitle: title,
        description: description ?? '#shorts #shortsvideo #youtubeshorts'
      };
    }
    return null;
  }
  catch (error) {
    console.error("Error downloading reel: ", error);
    return null;
  }

}