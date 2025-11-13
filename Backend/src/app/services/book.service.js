import { ObjectId } from "mongodb";

class BookService {
  constructor(client) {
    this.Book = client.db().collection("Book");
    this.Counter = client.db().collection("Counter"); // Collection để lưu counter
  }

  // Hàm tạo mã sách tự động tăng
  async getNextMASACH() {
    try {
      const result = await this.Counter.findOneAndUpdate(
        { _id: "MASACH" }, // Document ID cho counter của MASACH
        { $inc: { sequence_value: 1 } }, // Tăng giá trị lên 1
        {
          upsert: true, // Tạo mới nếu chưa có
          returnDocument: "after", // Trả về document sau khi update
        }
      );

      // Format: S001, S002, S003, ...
      const sequenceNumber = result.sequence_value || 1;
      return `S${String(sequenceNumber).padStart(3, "0")}`;
    } catch (error) {
      console.error("Lỗi khi tạo mã sách:", error);
      throw error;
    }
  }

  // giai ma du lieu
  extractBookData(payload) {
    const book = {
      MASACH: payload.MASACH,
      TENSACH: payload.TENSACH,
      DONGIA: payload.DONGIA,
      SOQUYEN: payload.SOQUYEN,
      NAMXUATBAN: payload.NAMXUATBAN,
      TENNXB: payload.TENNXB,
      TACGIA: payload.TACGIA,
      NGONNGU: payload.NGONNGU,
      SOTRANG: payload.SOTRANG,
      THELOAI: payload.THELOAI,
      YEUTHICH: payload.YEUTHICH,
      TRANGTHAI: payload.TRANGTHAI,
      IMAGE: payload.IMAGE,
      MOTA: payload.MOTA,
    };

    // xoa nhung truong khong xac dinh
    Object.keys(book).forEach((key) => {
      book[key] == undefined && delete book[key];
    });

    return book;
  }

  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findByName(name) {
    return await this.Book.find({
      name: { $regex: new RegExp(new RegExp(name)), $option: "i" },
    });
  }

  async findByPrimary(primary) {
    return await this.Book.findOne({
      MASACH: primary,
    });
  }

  async create(data) {
    // Tự động tạo MASACH nếu chưa có
    if (!data.MASACH) {
      data.MASACH = await this.getNextMASACH();
    }

    const book = this.extractBookData(data);
    const result = await this.Book.insertOne(book);
    // Trả về document vừa tạo kèm _id
    return { _id: result.insertedId, ...book };
  }

  async update(id, data) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const update = this.extractBookData(data);
    // returnDocument: 'after' để lấy document sau khi update
    let result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result; // Trả về document đã update
  }

  async delete(id) {
    const result = await this.Book.deleteOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });

    return result;
  }

  async getCount() {
    const count = await this.Book.countDocuments();
    return count;
  }

  async findFavorite() {
    return await this.Book.find({ YEUTHICH: "true" }).toArray();
  }

  async deleteAll() {
    const result = await this.Book.deleteMany();
    return result.deleteCount;
  }

  async getApproveAll() {
    return await this.Book.find({ TRANGTHAI: 2 }).toArray();
  }

  async getWaitingAll() {
    return await this.Book.find({ TRANGTHAI: 1 }).toArray();
  }

  async getReturnedAll() {
    return await this.Book.find({ TRANGTHAI: 3 }).toArray();
  }

  async getNoneAll() {
    return await this.Book.find({ TRANGTHAI: 0 }).toArray();
  }
}

export default BookService;
