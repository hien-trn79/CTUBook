import express from "express";
import bookRouter from "./app/routes/book.route.js";
import userRouter from "./app/routes/user.route.js";
import brandRouter from "./app/routes/brand.route.js";
import ApiError from "./app/api-error.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const app = express();
// xu ly json
app.use(express.json());
app.use(cors());

// config static file public
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// /api/books/
app.use("/api/books/", bookRouter);

// /api/users/
app.use("/api/users/", userRouter);

// /api/brands/
app.use("/api/brands/", brandRouter);

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
