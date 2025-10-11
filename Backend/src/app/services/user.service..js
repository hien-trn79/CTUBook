import { ObjectId } from "mongodb";

class UserService {
  constructor(client) {
    this.User = client.db().collection("User");
  },

  extractUserData(payload) {
    const User = {
        MADOCGIA: payload.MADOCGIA,
        HOLOT: payload.HOLOT,
        TEN: payload.TEN,
        PASSWORD: payload.PASSWORD,
        EMAIL: payload.EMAIL,
        NGAYSINH: payload.NGAYSINH,
        PHAI: payload.PHAI,
        DIACHI: payload.DIACHI,
        DIENTHOAI: payload.DIENTHOAI,
        LOAITK: payload.LOAITK
    }

    Object.key(User).forEach(key => {
        User[key] == undefined && delete User[key]
     })

     return User;
  }

  async find(filter) {
    const cursor = await this.User.find(filter);
    return await cursor.toArray();
  }
}
