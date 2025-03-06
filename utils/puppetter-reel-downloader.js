import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { config } from "dotenv";
config();

chromium.setGraphicsMode=false;

export async function downloadReelV3() {


  const isLocal = !!process.env.CHROME_DEV_PATH

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    channel: 'chrome',
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.goto("https://google.com");
  const pageTitle = await page.title();
  await browser.close();
  return pageTitle;
}

