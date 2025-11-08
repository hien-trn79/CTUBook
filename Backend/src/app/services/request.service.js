import { ObjectId } from "mongodb";
import MongoDB from "../utils/mongodb.util.js";
import ChiTietYeuCauService from "./chitietyeucau.service.js";

class RequestService {
  constructor(client) {
    this.Request = client.db().collection("YeuCau");
  }

  extractRequestData(payload) {
    const request = {
      THOIGIANDAT: payload.THOIGIANDAT,
      MADOCGIA: payload.MADOCGIA,
      TRANGTHAI: payload.TRANGTHAI,
      MAGIOHANG: payload.MAGIOHANG,
    };

    Object.keys(request).forEach((key) => {
      request[key] == undefined && delete request[key];
    });
    return request;
  }

  async find(filter) {
    const cursor = await this.Request.find(filter);
    return cursor.toArray();
  }

  // /api/books/request/:maDocGia
  async findByMaDocGia(maDocGia) {
    return await this.Request.find({
      MADOCGIA: ObjectId.isValid(maDocGia) ? new ObjectId(maDocGia) : null,
    }).toArray();
  }

  // Them yeu cau moi trong YeuCau
  async create(data) {
    await Promise.all(
      data.map(async (item) => {
        item.MAGIOHANG = new ObjectId(item._id);
        item.MADOCGIA = new ObjectId(item.MADOCGIA);
        item.THOIGIANDAT = new Date();
        item.TRANGTHAI = 0;

        const request = this.extractRequestData(item);
        const chiTietService = new ChiTietYeuCauService(MongoDB.client);

        const resultRequest = await this.Request.insertOne(request);
        const idYeuCau = resultRequest.insertedId;

        item._id = idYeuCau;

        console.log("Creating Chi Tiet Yeu Cau with data:", item);

        const result = await chiTietService.create(item);
        return result;
      })
    );
  }

  // Cap nhat yeu cau theo _id yeu cau
  async update(id, data) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const updateData = this.extractRequestData(data);
    const result = await this.Request.findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: "after" }
    );
    return result;
  }
}

export default RequestService;
