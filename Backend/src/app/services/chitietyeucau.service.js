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
    console.log("data received in Chi tiet Yeu Cau service:", data);
    const maYeuCau = new ObjectId(data._id);
    const maSach = new ObjectId(data.IDSACH);
    const soLuong = data.SOLUONG;
    const chiTiet = {
      MAYEUCAU: maYeuCau,
      MASACH: maSach,
      SOLUONG: soLuong,
    };

    const result = this.extractChiTietYeuCauData(chiTiet);
    const chiTietMoi = await this.ChiTietYeuCau.insertOne(result);
    return { _id: chiTietMoi.insertedId, ...result };
  }
}

export default ChiTietYeuCauService;
