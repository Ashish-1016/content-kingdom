import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { config } from "dotenv";
import { fallBackTitleGenerator, reelToShortsAiPromptGenerator } from "./gemini-helper.js";
config();

chromium.setGraphicsMode=false;

export async function downloadReelV3(reelUrl, reelType) {

  try {

    let browser;
    if (process.env.CHROME_PROD_PATH) {
      const executablePath = await chromium.executablePath(process.env.CHROME_PROD_PATH);
      browser = await puppeteer.launch({
        executablePath,
        args: [...chromium.args, '--hide-scrollbars', '--incognito', '--no-sandbox'],
        headless: chromium.headless,
        defaultViewport: chromium.defaultViewport
      })
    }
    else {
      browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        defaultViewport: null,
        channel: 'chrome',
        args: [...puppeteer.defaultArgs(), '--start-maximized'],
      })
    }

    const page = await browser.newPage();
    const reelsDownloadWebPageUrl = 'https://igram.world/reels-downloader';

    await page.goto(reelsDownloadWebPageUrl, { waitUntil: 'networkidle2' });

    await page.evaluate((url) => {
      const input = document.querySelector('#search-form-input');
      input.value = url;
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }, reelUrl);

    await page.evaluate(() => {
      const button = document.querySelector('#app > section.form-block > div > form > button');
      if (button) button.click();
    });

    await page.waitForSelector('#app > div.search-result.show', { timeout: 8000 });

    const downloadReelButtonSelector = '#app > div.search-result.show > div > div > ul.output-list__list.output-list__list--one-item > li > div.media-content__info > a';
    const downloadReelButton = await page.waitForSelector(downloadReelButtonSelector, { timeout: 8000 });

    const downloadUrl = await page.evaluate(element => element.href, downloadReelButton);

    const reelTitleSelector = '#app > div.search-result.show > div > div > div.output-list__caption > p'

    const reelTitleElement = await page.waitForSelector(reelTitleSelector, { timeout: 8000 });
    const reelTitle = await page.evaluate(element => element.textContent, reelTitleElement);


    await browser.close();


    const reelToShortsAiInputJSON  = {
      title: reelTitle,
      reelType,
    }

    const { youtubeTitle, description } = await reelToShortsAiPromptGenerator(reelToShortsAiInputJSON);

    let title;
    if (reelTitle) {

      if (!youtubeTitle) {
        title = await fallBackTitleGenerator(reelType);
      } else {
        title = youtubeTitle;
      }
    }

      return {
        downloadUrl,
        youtubeTitle: title,
        description: description ?? '#shorts #shortsvideo #youtubeshorts'
      };

  }
  catch (error) {
    console.error('Something really bad happened: ReeldownloadV3: \n', error);
    return {
      youtubeTitle: null,
      downloadUrl: null,
      description: null
    }
  }

}

