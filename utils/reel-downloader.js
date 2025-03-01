
export async function downloadReel(reelUrl) {
  const url = `${process.env.RAPID_API_URL}?url=${reelUrl}`;

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
    if (result.links.length > 0) {
      return result.links[1].link;
    }
    return null;
  }
  catch (error) {
    console.error(error);
    return null;
  }

}