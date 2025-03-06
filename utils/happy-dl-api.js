import happyDL from 'happy-dl';

export async function fetchInstagramData(url) {
  try {
    const result = await happyDL.instagramDownloader(url);

    return result.results[0].variants[0].url;
  } catch (error) {
    console.error("Error fetching Instagram media details: HappyDL", error);
    return null
  }
}