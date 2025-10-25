import { jsonClient, formClient } from "./api.service.js";

class ChiTietDonMuonService {
  constructor(baseUrl = "/api/books/chi-tiet-don-muon") {
    this.api = jsonClient(baseUrl);
  }

  async getAll(query = {}) {
    return (await this.api.get("/", { params: query })).data;
  }

  async getIDDonMuon(MADONMUON) {
    return (await this.api.get(`/${MADONMUON}`)).data;
  }
}

export default new ChiTietDonMuonService();
