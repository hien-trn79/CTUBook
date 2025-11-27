import { jsonClient, formClient } from "./api.service.js";

class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = jsonClient(baseUrl);
    this.formApi = formClient(baseUrl);
  }

  // [GET] http://localhost:8080/api/books/
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // [GET] http://localhost:8080/api/books/search?search=abc
  async getQuery(query = {}) {
    return (await this.api.get("/search", { params: query })).data;
  }

  // [POST] http://localhost:8080/api/books/
  async create(data) {
    return (
      await this.formApi.post("/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }

  // [DELETE] http://localhost:8080/api/books/
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  // [GET] http://localhost:8080/api/books/count => lay tong so luong sach
  async getCount() {
    return (await this.api.get(`/count`)).data;
  }

  //[GET] http://localhost:8080/api/books/status-approved => lay nhung sach da duyet
  async getApproved() {
    return (await this.api.get(`/status-approved`)).data;
  }

  //[GET] http://localhost:8080/api/books/status-waiting => lay nhung sach cho duyet
  async getWaiting() {
    return (await this.api.get(`/status-waiting`)).data;
  }

  //[GET] http://localhost:8080/api/books/status-none => lay nhung sach chua muon
  async getNone() {
    return (await this.api.get(`/status-none`)).data;
  }

  //[GET] http://localhost:8080/api/books/status-returned => lay nhung sach chua muon
  async getReturned() {
    return (await this.api.get(`/status-returned`)).data;
  }

  // [GET] http://localhost:8080/api/books/:id
  async getId(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // [PUT] http://localhost:8080/api/books/:id
  async update(id, data) {
    return (
      await this.formApi.put(`/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }

  // [DELETE] http://localhost:8080/api/books/:id
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  // [GET] http://localhost:8080/api/books/favorite
  async getAllFavorite() {
    return (await this.api.get("/favorite")).data;
  }
}

export default new BookService();
