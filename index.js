import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { downloadReel } from "./utils/reel-downloader.js";
import playwright from "playwright-aws-lambda";

dotenv.config();

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}))
app.use(express.json())


app.use((req, res, next) => {
  if(req.headers.authorization === process.env.AUTH_HEADER) {
    next()
  } else {
    res.status(401).send({ success: false, message: "Unauthorized" });
  }
})

app.get("/get-download-url", async (req, res) => {
  const { url: reelUrl } = req.query;

  if(reelUrl === "" || !reelUrl) {
    res.status(400).send({ success: false, message: "Invalid URL" });
    return;
  }

  const downloadUrl = await downloadReel(reelUrl);

  if(downloadUrl) {
    res.status(200).send({ success: true, downloadUrl });
  } else {
    res.status(500).send({ success: false });
  }

});

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: "Hello From Content Kingdom"
  });
})

app.get('/playwright', async (req, res) => {
  const browser = await playwright.launchChromium({ headless: true });
  const googlePage = await browser.newPage()
  await googlePage.goto('https://www.google.com');
  res.send({ success: true, res:'Google reached'  });
})

app.listen(process.env.PORT, () => {
  console.log(`Content Kingdom server is running...`);
});


