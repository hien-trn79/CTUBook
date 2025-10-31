import { jsonClient, formClient } from "./api.service.js";

class RequestService {
  constructor(baseUrl = "/api/books/request") {
    this.api = jsonClient(baseUrl);
  }

  // [GET] http://localhost:8080/api/books/request
  async getAll() {
    return (await this.api.get("/")).data;
  }

  async getByMaDocGia(maDocGia) {
    return (await this.api.get(`/${maDocGia}`)).data;
  }
}

export default new RequestService();
