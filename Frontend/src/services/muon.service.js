import { jsonClient, formClient } from "./api.service.js";

class MuonService {
  constructor(baseUrl = "/api/books/muon-tra") {
    this.api = jsonClient(baseUrl);
  }

  // [GET] http://localhost:8080/api/books/muon-tra/
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // [GET] http://localhost:8080/api/books/muon-tra/:maDocGia
  async getByMaDocGia(maDocGia) {
    return (await this.api.get(`/${maDocGia}`)).data;
  }
}

export default new MuonService();
