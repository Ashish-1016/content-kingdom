import { fallBackTitleGenerator, reelToShortsAiPromptGenerator } from "./gemini-helper.js";
import dotenv from "dotenv";
dotenv.config();

export async function downloadReelV1(reelUrl, reelType) {
  const url = `${process.env.RAPID_API_URL}?url=${reelUrl}`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': process.env.RAPID_API_HOST
    }
  };

  try {
    const rapidApiResponse = await fetch(url, options);
    const rapidApiData = await rapidApiResponse.json();

    const reelToShortsAiInputJSON  = {
      title: rapidApiData.title,
      reelType,
    }

    const { youtubeTitle, description } = await reelToShortsAiPromptGenerator(reelToShortsAiInputJSON);

    let title;
    if (rapidApiData.links.length > 0) {

      if(!youtubeTitle) {
        title = await fallBackTitleGenerator(reelType);
      } else {
        title = youtubeTitle;
        }

      return {
        downloadUrl: rapidApiData.links[1].link,
        youtubeTitle: title,
        description: description ?? '#shorts #shortsvideo #youtubeshorts'
      };
    }
    return null;
  }
  catch (error) {
    console.error("Error downloading reel: V1", error);
    return null;
  }

}