import MongoDB from "./mongodb.util.js";

/**
 * Tạo indexes cho MongoDB để tăng tốc độ truy vấn
 */
async function createIndexes() {
  try {
    const client = MongoDB.client;
    const bookCollection = client.db().collection("Book");

    // Index cho _id (đã có sẵn)

    // Index cho TENSACH (tìm kiếm theo tên sách)
    await bookCollection.createIndex({ TENSACH: 1 }, { background: true });

    // Index cho TRANGTHAI (lọc theo trạng thái)
    await bookCollection.createIndex({ TRANGTHAI: 1 }, { background: true });

    // Index cho YEUTHICH (tìm sách yêu thích)
    await bookCollection.createIndex({ YEUTHICH: 1 }, { background: true });

    // Index cho MASACH (primary key)
    await bookCollection.createIndex(
      { MASACH: 1 },
      { unique: true, background: true }
    );

    // Compound index cho THELOAI + TRANGTHAI (lọc theo thể loại và trạng thái)
    await bookCollection.createIndex(
      { THELOAI: 1, TRANGTHAI: 1 },
      { background: true }
    );

    // Text index cho tìm kiếm full-text
    await bookCollection.createIndex(
      { TENSACH: "text", TACGIA: "text", THELOAI: "text" },
      { background: true }
    );

    // const indexes = await bookCollection.indexes();
    // indexes.forEach((index, i) => {
    //   console.log(`${i + 1}. ${index.name}:`, JSON.stringify(index.key));
    // });
  } catch (error) {
    console.error("❌ Lỗi khi tạo indexes:", error);
  }
}

export default createIndexes;
