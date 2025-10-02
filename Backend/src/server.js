import app from "./app.js";
import config from "./app/config/index.js";
import MongoDB from "./app/utils/mongodb.util.js";

async function startSerer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("Kết nối với cơ sở dữ liệu thành công");

    const PORT = config.app.port;

    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}/api/`);
    });
  } catch (error) {
    console.log("Có lỗi kết nối với database", error);
    process.exit();
  }
}

startSerer();
