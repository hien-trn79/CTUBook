import MongoDB from "./mongodb.util.js";

/**
 * Khởi tạo Counter cho MASACH tự động tăng
 */
async function initializeCounter() {
  try {
    const client = MongoDB.client;
    const counterCollection = client.db().collection("Counter");

    console.log("Đang khởi tạo Counter cho MASACH...");

    // Kiểm tra xem counter đã tồn tại chưa
    const existingCounter = await counterCollection.findOne({ _id: "MASACH" });

    if (existingCounter) {
      console.log(
        `✓ Counter đã tồn tại với giá trị: ${existingCounter.sequence_value}`
      );
      return existingCounter.sequence_value;
    }

    // Lấy số lượng sách hiện có trong DB để set counter
    const bookCollection = client.db().collection("Book");
    const bookCount = await bookCollection.countDocuments();

    // Nếu có sách trong DB, lấy MASACH lớn nhất
    let startValue = bookCount;

    if (bookCount > 0) {
      const lastBook = await bookCollection
        .find({})
        .sort({ MASACH: -1 })
        .limit(1)
        .toArray();

      if (lastBook.length > 0 && lastBook[0].MASACH) {
        // Trích xuất số từ MASACH (ví dụ: MS0001 -> 1)
        const match = lastBook[0].MASACH.match(/\d+/);
        if (match) {
          startValue = parseInt(match[0]);
        }
      }
    }

    // Tạo counter mới
    await counterCollection.insertOne({
      _id: "MASACH",
      sequence_value: startValue,
      description: "Counter tự động tăng cho mã sách",
      created_at: new Date(),
    });

    console.log(`✅ Đã tạo Counter mới với giá trị khởi đầu: ${startValue}`);
    console.log(
      `📖 Mã sách tiếp theo sẽ là: MS${String(startValue + 1).padStart(4, "0")}`
    );

    return startValue;
  } catch (error) {
    console.error("❌ Lỗi khi khởi tạo Counter:", error);
    throw error;
  }
}

export default initializeCounter;
