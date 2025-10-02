import "dotenv/config";

const config = {
  app: {
    port: process.env.PORT,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/CTUBook",
  },
};

export default config;
