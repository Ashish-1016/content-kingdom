import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}))
app.use(express.json())


app.use((req, res, next) => {
  console.log('-->', process.env.AUTH_HEADER)
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

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: "Hello From Content Kingdom"
  });
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


