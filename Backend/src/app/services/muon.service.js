import { ObjectId } from "mongodb";

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
}

export default MuonService;
