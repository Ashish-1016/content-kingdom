import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { downloadReelV3 } from "./utils/puppetter-reel-downloader.js";
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
  const { url: reelUrl, reelType } = req.query;

  if(reelUrl === "" || !reelUrl) {
    res.status(400).send({ success: false, message: "Invalid URL" });
    return;
  }

  if(!reelType) {
    res.status(400).send({ success: false, message: "Invalid or No reelType" });
    return;
  }

  const { youtubeTitle, downloadUrl, description } = await downloadReelV3(reelUrl, reelType);

  if(!downloadUrl || !youtubeTitle || !description) {

    res.status(500).send({
      success: false,
      message: "Error downloading reel or generating youtube title or generating description"
    });

    return;
  }

    res.status(200).send({
      success: true,
      downloadUrl,
      youtubeTitle,
      description
    });

});

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: "Hello From Content Kingdom"
  });
})

app.listen(process.env.PORT, () => {
  console.log(`Content Kingdom server is running...`);
});

