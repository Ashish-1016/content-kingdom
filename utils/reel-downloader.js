import chromeAWS from "chrome-aws-lambda";
import puppeteerCore from "puppeteer-core";
import puppeteerDev  from "puppeteer";

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = chromeAWS
  puppeteer = puppeteerCore
} else {
  puppeteer = puppeteerDev
}

export async function downloadReel(reelUrl) {

  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [
              ...chrome.args,
             "--hide-scrollbars",
             "--disable-web-security",
             '--no-sandbox',
             '--disable-setuid-sandbox',
             '--disable-dev-shm-usage',
             '--disable-accelerated-2d-canvas',
             '--disable-gpu',
             '--disable-extensions',
             '--disable-infobars',
      ],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }
  else {
    options = {
      args: [
        "--hide-scrollbars",
        "--disable-web-security",
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-infobars',
      ],
        defaultViewport: null,
        headless: true,
        ignoreHTTPSErrors: true,
    };
  }

  try {

    let browser = await puppeteer.launch(options);

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