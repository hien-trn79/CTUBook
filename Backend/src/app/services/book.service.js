import { ObjectId } from "mongodb";

class BookService {
  constructor(client) {
    this.Book = client.db().collection("Book");
  }

  // giai ma du lieu
  extractBookData(payload) {
    const book = {
      MASACH: payload.MASACH,
      TENSACH: payload.TENSACH,
      DONGIA: payload.DONGIA,
      SOQUYEN: payload.SOQUYEN,
      NAMXUATBAN: payload.NAMXUATBAN,
      MANXB: payload.MANXB,
      TACGIA: payload.TACGIA,
      NGONNGU: payload.NGONNGU,
      SOTRANG: payload.SOTRANG,
      THELOAI: payload.THELOAI,
      YEUTHICH: payload.YEUTHICH,
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

  async create(data) {
    const book = this.extractBookData(data);
    const result = await this.Book.insertOne(book);
    return result.value;
  }

  async update(id, data) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const update = this.extractBookData(data);
    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result.value; // tra ve ket qua sau khi update
  }

  async delete(id) {
    const result = await this.Book.deleteOne({
      _id: ObjectId(id) ? new ObjectId(id) : null,
    });

    return result;
  }

  async findFavorite() {
    return await this.Book.find({ YEUTHICH: true }).toArray();
  }

  async deleteAll() {
    const result = await this.Book.deleteMany();
    return result.deleteCount;
  }
}

export default BookService;
