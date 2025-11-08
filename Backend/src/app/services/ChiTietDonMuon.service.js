class ChiTietDonMuonService {
  constructor(client) {
    this.ChiTietDonMuon = client.db().collection("ChiTietDonMuon");
  }

  extractChiTietDonMuonData(payload) {
    const chiTietDonMuon = {
      IDDONMUON: payload.IDDONMUON,
      MASACH: payload.MASACH,
      SOLUONG: payload.SOLUONG,
    };

    Object.keys(chiTietDonMuon).forEach((key) => {
      chiTietDonMuon[key] == undefined && delete chiTietDonMuon[key];
    });

    return chiTietDonMuon;
  }

  async find(filter) {
    const cursor = await this.ChiTietDonMuon.find(filter);
    return cursor.toArray();
  }

  async create(data) {
    const chiTietDonMuon = this.extractChiTietDonMuonData(data);
    const result = await this.ChiTietDonMuon.insertOne(chiTietDonMuon);
    return result;
  }
}

export default ChiTietDonMuonService;
