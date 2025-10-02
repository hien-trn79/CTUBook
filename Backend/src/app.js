import express from "express";
import bookRouter from "./app/routes/book.route.js";
import userRouter from "./app/routes/user.route.js";
import ApiError from "./app/api-error.js";

const app = express();

// /api/books/
app.use("/api/books/", bookRouter);

// /api/users/
app.use("/api/users/", userRouter);

// Xu ly loi
app.use((req, res, next) => {
  return next(new ApiError(404, "Not found resource"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Error from server",
  });
});
export default app;
