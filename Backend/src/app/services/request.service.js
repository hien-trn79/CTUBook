import { ObjectId } from "mongodb";

class RequestService {
  constructor(client) {
    this.Request = client.db().collection("YeuCau");
  }

  extractRequestData(payload) {
    const request = {
      THOIGIANYEUCAU: payload.THOIGIANYEUCAU,
      MADOCGIA: payload.MADOCGIA,
      TRANGTHAI: payload.TRANGTHAI,
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
}

export default RequestService;
