import express from "express";

const app = express();

app.get("/api", (req, res, next) => {
  res.send("Hello Backend");
});

export default app;
