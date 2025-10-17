import app from "./app.js";
import config from "./app/config/index.js";
import MongoDB from "./app/utils/mongodb.util.js";
import createIndexes from "./app/utils/create-indexes.js";
import initializeCounter from "./app/utils/initialize-counter.js";

async function startSerer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("Kết nối với cơ sở dữ liệu thành công");

    // Tạo indexes để tối ưu hóa truy vấn
    await createIndexes();
    console.log("Indexes đã được tạo/cập nhật");

    // Khởi tạo Counter cho MASACH tự động tăng
    await initializeCounter();
    console.log("Counter đã được khởi tạo");

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
