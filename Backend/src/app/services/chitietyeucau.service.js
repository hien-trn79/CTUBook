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
}

export default ChiTietYeuCauService;
