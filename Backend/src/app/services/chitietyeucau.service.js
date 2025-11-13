import { ObjectId } from "mongodb";

class ChiTietYeuCauService {
  constructor(client) {
    this.ChiTietYeuCau = client.db().collection("ChiTietYeuCau");
  }

  extractChiTietYeuCauData(payload) {
    const chiTietYeuCau = {
      MAYEUCAU: payload.MAYEUCAU,
      MASACH: payload.MASACH,
      SOLUONG: payload.SOLUONG,
      MAGIOHANG: payload.MAGIOHANG,
    };

    Object.keys(chiTietYeuCau).forEach((key) => {
      chiTietYeuCau[key] == undefined && delete chiTietYeuCau[key];
    });

    return chiTietYeuCau;
  }

  async find(filter) {
    const cursor = await this.ChiTietYeuCau.find(filter);
    return cursor.toArray();
  }

  async create(data) {
    const chiTietMoi = await this.ChiTietYeuCau.insertOne(data);
    return { _id: chiTietMoi.insertedId, ...data };
  }
}

export default ChiTietYeuCauService;
