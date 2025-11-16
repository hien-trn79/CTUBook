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

  async update(idChiTiet, data) {
    const result = await this.ChiTietYeuCau.findOneAndUpdate(
      {
        _id: ObjectId.isValid(idChiTiet) ? new ObjectId(idChiTiet) : null,
      },
      { $set: data },
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(idChiTiet) {
    const result = await this.ChiTietYeuCau.deleteOne({
      _id: ObjectId.isValid(idChiTiet) ? new ObjectId(idChiTiet) : null,
    });
    return result.deletedCount;
  }
}

export default ChiTietYeuCauService;
