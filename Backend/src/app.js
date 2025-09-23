import express from "express";
import bookRouter from "./app/routes/book.route.js";

const app = express();

// /api/books/
app.use("/api/books/", bookRouter);

export default app;
