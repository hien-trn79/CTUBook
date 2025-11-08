import { ObjectId } from "mongodb";
import chiTietDonMuonService from "./chitietdonmuon.service.js";
import MongoDB from "../utils/mongodb.util.js";

class MuonService {
  constructor(client) {
    this.Muon = client.db().collection("Muon");
  }

  extractMuonData(payload) {
    const muon = {
      MADOCGIA: payload.MADOCGIA,
      EMAIL: payload.EMAIL,
      SOQUYEN: payload.SOQUYEN,
      THOIGIANMUON: payload.THOIGIANMUON,
      THOIGIANTRA: payload.THOIGIANTRA,
      HINHTHUC: payload.HINHTHUC,
      TRANGTHAI: payload.TRANGTHAI,
    };

    Object.keys(muon).forEach((key) => {
      muon[key] == undefined && delete muon[key];
    });

    return muon;
  }

  async find(filter) {
    const cursor = await this.Muon.find(filter);
    return cursor.toArray();
  }

  // Them muon moi trong Muon
  async create(data) {
    const muon = this.extractMuonData(data);
    const result = await this.Muon.insertOne(muon);
    const chiTietData = {
      IDDONMUON: result.insertedId,
      MASACH: data.MASACH,
      SOLUONG: muon.SOQUYEN,
    };

    const chiTietDonMuonSvc = new chiTietDonMuonService(MongoDB.client);
    const resultChiTiet = await chiTietDonMuonSvc.create(chiTietData);

    console.log("Dữ liệu đơn mượn sách được tạo trong MuonService:", muon);

    return result;
  }
}

export default MuonService;
