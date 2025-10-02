import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const config = {
  app: {
    port: process.env.PORT,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/CTUBook",
  },
  cloudinary,
};

export default config;
