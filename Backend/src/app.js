import express from "express";
import bookRouter from "./app/routes/book.route.js";
import userRouter from "./app/routes/user.route.js";

const app = express();

// /api/books/
app.use("/api/books/", bookRouter);

// /api/users/
app.use("/api/users/", userRouter);

export default app;
