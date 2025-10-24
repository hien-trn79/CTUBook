import { ObjectId } from "mongodb";

class UserService {
  constructor(client) {
    this.User = client.db().collection("User");
    this.Counter = client.db().collection("Counter"); // Collection để lưu counter
  }

  async getNextMADOCGIA() {
    try {
      const result = await this.Counter.findOneAndUpdate(
        {
          _id: "MADOCGIA",
        },
        { $inc: { sequence_value: 1 } },
        {
          upsert: true,
          returnDocument: "after",
        }
      );
      const sequenceNumber = result.sequence_value || 1;
      return `DG${String(sequenceNumber).padStart(4, "0")}`;
    } catch (error) {
      console.error("Lỗi khi tạo mã độc giả", error);
      throw error;
    }
  }

  extractUserData(payload) {
    const user = {
      MADOCGIA: payload.MADOCGIA,
      HOLOT: payload.HOLOT,
      TEN: payload.TEN,
      PASSWORD: payload.PASSWORD,
      EMAIL: payload.EMAIL,
      NGAYSINH: payload.NGAYSINH,
      PHAI: payload.PHAI,
      DIACHI: payload.DIACHI,
      DIENTHOAI: payload.DIENTHOAI,
      LOAITK: payload.LOAITK,
      USERNAME: payload.USERNAME,
    };

    Object.keys(user).forEach((key) => {
      user[key] == undefined && delete user[key];
    });

    return user;
  }

  // [GET] /api/users/
  async find(filter) {
    const cursor = await this.User.find(filter);
    console.log(cursor);
    return await cursor.toArray();
  }

  // [GET] /api/users/:username
  async findByUsername(username) {
    console.log("Tìm kiếm user với username:", username);
    const result = await this.User.find({ USERNAME: username });
    return result;
  }

  // [POST] /api/users/
  async create(data) {
    console.log(data);
    const user = this.extractUserData(data);
    const result = await this.User.insertOne(user);
    return result;
  }

  // [PUT] /api/users/:id
  async update(id, data) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const updateData = this.extractUserData(data);
    const result = await this.User.findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: false }
    );
    return result.value;
  }

  // [DELETE] /api/users/:id
  async delete(id) {
    const result = await this.User.deleteOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  // [DELETE] /api/users/
  async deleteAll() {
    const result = await this.User.deleteMany();
    return result.deleteCount;
  }
}

export default UserService;
