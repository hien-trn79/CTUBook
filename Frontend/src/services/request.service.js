import { jsonClient, formClient } from "./api.service.js";

class RequestService {
  constructor(baseUrl = "/api/books/request") {
    this.api = jsonClient(baseUrl);
    this.formApi = formClient(baseUrl);
  }

  // [GET] http://localhost:8080/api/books/request/
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // [POST] http://localhost:8080/api/books/request/
  async createRequest(data) {
    return (await this.api.post("/", data)).data;
  }

  // [GET] http://localhost:8080/api/books/request/:maDocGia
  async getByMaDocGia(maDocGia) {
    return (await this.api.get(`/${maDocGia}`)).data;
  }

  // [PUT] http://localhost:8080/api/books/request/:id
  async updateRequestById(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
}

export default new RequestService();
