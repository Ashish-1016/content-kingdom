import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';

export async function downloadReel(reelUrl) {
  try {
    const browser = await puppeteer.launch({
      headless: 'shell',
      slowMo: 300,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-infobars',
      ],
    });

    const page = await browser.newPage();

    await page.goto('https://indown.io/reels');

    await new Promise(resolve => setTimeout(resolve, 3000));

    const reelLinkInputSelector = '#link'
    await page.waitForSelector(reelLinkInputSelector);


    await page.evaluate((reelUrl, reelLinkInputSelector) => {
      const reelLinkInput = document.querySelector(reelLinkInputSelector);
      reelLinkInput.value = reelUrl;
    }, reelUrl, reelLinkInputSelector);

    const searchButtonSelector = '#get'
    const searchReelButton = await page.waitForSelector(searchButtonSelector);
    await searchReelButton.click();

    await new Promise(resolve => setTimeout(resolve, 10000));

    let reelDownloadLink;

    const downloadButtonSelector = '#result > div > div > div.mt-3 > div > a.mb-2'
    reelDownloadLink = await page.evaluate((downloadButtonSelector) => {
      return document.querySelector(downloadButtonSelector).getAttribute('href');
    }, downloadButtonSelector);

    return reelDownloadLink;

  }
  catch (error) {
    console.error("ERROR occurred while downloading reel", error);
    return null;
  }
}