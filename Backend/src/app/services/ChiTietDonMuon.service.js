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
}

export default ChiTietDonMuonService;
