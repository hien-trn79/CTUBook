import { ObjectId } from "mongodb";

class UserService {
  constructor(client) {
    this.User = client.db().collection("User");
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

  // [GET] /api/users/:id
  async findById(id) {
    return await this.User.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // [POST] /api/users/
  async create(data) {
    const user = this.extractUserData(data);
    const result = await this.User.insertOne(user);
    return result.value;
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
