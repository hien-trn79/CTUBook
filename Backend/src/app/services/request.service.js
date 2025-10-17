import { ObjectId } from "mongodb";

class RequestService {
  constructor(client) {
    this.Request = client.db().collection("YeuCau");
  }

  extractRequestData(payload) {
    const request = {
      MADOCGIA: payload.MADOCGIA,
      MASACH: payload.MASACH,
      THOIGIANDAT: payload.THOIGIANDAT,
      TRANGTHAI: payload.TRANGTHAI,
      MAYEUCAU: payload.MAYEUCAU,
    };

    ObjectId.keys(request).forEach((key) => {
      request[key] == undefined && delete request[key];
    });
    return request;
  }

  async find(filter) {
    const cursor = await this.Request.find(filter);
    return cursor.toArray();
  }

  // /api/books/request/:id
  async findById(id) {
    return await this.Request.findOne({
      MAYEUCAU: id,
    });
  }
}

export default RequestService;
