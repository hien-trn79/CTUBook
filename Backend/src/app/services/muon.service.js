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
  async create(donMuonData, chiTietDonMuon) {
    // Tao don muon chung
    const resultMuon = await this.Muon.insertOne(donMuonData);
    const idDonMuon = resultMuon.insertedId;
    if (chiTietDonMuon && chiTietDonMuon.length > 0) {
      // Them chi tiet don muon
      await Promise.all(
        chiTietDonMuon.map(async (chiTiet) => {
          const chiTietData = {
            IDDONMUON: idDonMuon,
            MASACH: chiTiet.MASACH,
            SOLUONG: chiTiet.SOLUONG,
          };
          const chiTietService = new chiTietDonMuonService(MongoDB.client);
          const result = await chiTietService.create(chiTietData);
          return result;
        })
      );
    }
  }

  // Xoa don muon va chi tiet don muon
  async delete(idDonMuon) {
    const chiTietService = new chiTietDonMuonService(MongoDB.client);

    const chiTietList = await chiTietService.find({
      IDDONMUON: ObjectId.isValid(idDonMuon) ? new ObjectId(idDonMuon) : null,
    });

    if (chiTietList.length > 0) {
      // Xoa chi tiet don muon
      await Promise.all(
        chiTietList.map(async (chiTiet) => {
          const resultDeleteChiTiet = await chiTietService.delete(chiTiet._id);
          return resultDeleteChiTiet;
        })
      );
    }

    // Xoa don muon
    const result = await this.Muon.deleteOne({
      _id: ObjectId.isValid(idDonMuon) ? new ObjectId(idDonMuon) : null,
    });
    return result.deletedCount;
  }
}

export default MuonService;
