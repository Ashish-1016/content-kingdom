import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { config } from "dotenv";
config();

chromium.setGraphicsMode=false;

export async function downloadReelV3() {


  const isProd = !!process.env.CHROME_PROD_PATH

  const browser = await puppeteer.launch({
    args: !isProd ? puppeteer.defaultArgs() : [...chromium.args, '--hide-scrollbars', '--incognito', '--no-sandbox'],
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
    ...(isProd ?
      { executablePath: process.env.CHROME_PROD_PATH, }:
      { channel: 'chrome' })
  });

  const page = await browser.newPage();
  await page.goto("https://google.com");
  const pageTitle = await page.title();
  await browser.close();
  return pageTitle;
}

