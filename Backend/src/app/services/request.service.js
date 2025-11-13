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
      THOIGIANTRA: payload.THOIGIANTRA,
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
    const YeuCauData = {
      MADOCGIA: new ObjectId(data[0].MADOCGIA),
      THOIGIANDAT: new Date(data[0].THOIGIANDAT),
      THOIGIANTRA: new Date(data[0].THOIGIANTRA),
      TRANGTHAI: 0,
    };

    // Tao yeu cau
    const request = this.extractRequestData(YeuCauData);
    const resultRequest = await this.Request.insertOne(request);
    const idYeuCau = resultRequest.insertedId;

    // Them chi tiet yeu cau
    await Promise.all(
      data.map(async (item) => {
        const itemData = {
          MAYEUCAU: idYeuCau,
          MASACH: new ObjectId(item.bookDetails._id),
          SOLUONG: item.SOLUONG,
          MAGIOHANG: new ObjectId(item._id),
        };
        const chiTietService = new ChiTietYeuCauService(MongoDB.client);
        const result = await chiTietService.create(itemData);
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

  async getCount() {
    return await this.Request.countDocuments();
  }
}

export default RequestService;
