import MongoDB from "./mongodb.util.js";

/**
 * Tạo indexes cho MongoDB để tăng tốc độ truy vấn
 */
async function createIndexes() {
  try {
    const client = MongoDB.client;
    const bookCollection = client.db().collection("Book");

    console.log("Đang tạo indexes cho collection Book...");

    // Index cho _id (đã có sẵn)

    // Index cho TENSACH (tìm kiếm theo tên sách)
    await bookCollection.createIndex({ TENSACH: 1 }, { background: true });
    console.log("✓ Đã tạo index cho TENSACH");

    // Index cho TRANGTHAI (lọc theo trạng thái)
    await bookCollection.createIndex({ TRANGTHAI: 1 }, { background: true });
    console.log("✓ Đã tạo index cho TRANGTHAI");

    // Index cho YEUTHICH (tìm sách yêu thích)
    await bookCollection.createIndex({ YEUTHICH: 1 }, { background: true });
    console.log("✓ Đã tạo index cho YEUTHICH");

    // Index cho MASACH (primary key)
    await bookCollection.createIndex(
      { MASACH: 1 },
      { unique: true, background: true }
    );
    console.log("✓ Đã tạo index UNIQUE cho MASACH");

    // Compound index cho THELOAI + TRANGTHAI (lọc theo thể loại và trạng thái)
    await bookCollection.createIndex(
      { THELOAI: 1, TRANGTHAI: 1 },
      { background: true }
    );
    console.log("✓ Đã tạo compound index cho THELOAI + TRANGTHAI");

    // Text index cho tìm kiếm full-text
    await bookCollection.createIndex(
      { TENSACH: "text", TACGIA: "text", THELOAI: "text" },
      { background: true }
    );
    console.log("✓ Đã tạo text index cho tìm kiếm full-text");

    console.log("\n✅ Hoàn thành tạo indexes!");
    console.log("📊 Danh sách indexes hiện tại:");

    const indexes = await bookCollection.indexes();
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, JSON.stringify(index.key));
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo indexes:", error);
  }
}

export default createIndexes;
