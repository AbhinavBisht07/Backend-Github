import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/notification", (req, res) => {
  res.send("Hello from Notification Service!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});