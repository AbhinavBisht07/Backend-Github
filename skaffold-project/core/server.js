import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Core Service! V2");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});