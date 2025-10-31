import { jsonClient, formClient } from "./api.service.js";

class ChiTietYeuCauService {
  constructor(baseUrl = "/api/books/chi-tiet-yeu-cau") {
    this.api = jsonClient(baseUrl);
  }

  // GET /api/books/chi-tiet-yeu-cau
  async getAll(query = {}) {
    return (await this.api.get("/", { params: query })).data;
  }

  // GET /api/books/chi-tiet-yeu-cau/:MAYEUCAU
  async getMAYEUCAU(MAYEUCAU) {
    return (await this.api.get(`/${MAYEUCAU}`)).data;
  }
}

export default new ChiTietYeuCauService();
