import { jsonClient, formClient } from "./api.service.js";

class MuonService {
  constructor(baseUrl = "/api/books/muon-tra") {
    this.api = jsonClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
}

export default new MuonService();
