import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}))
app.use(express.json())
dotenv.config();
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  if(req.headers.authorization === process.env.AUTH_HEADER) {
    next()
  } else {
    res.status(401).send({ success: false, message: "Unauthorized" });
  }
})

app.get("/test", (req, res) => {
  const { url } = req.query;
  res.status(200).send({ success: true, url });
});

app.listen(8080, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


