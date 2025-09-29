import createApiClient from "./api.service.js";

class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = createApiClient(baseUrl);
  }

  // [GET] http://localhost:8080/api/books/
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // [POST] http://localhost:8080/api/books/
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // [DELETE] http://localhost:8080/api/books/
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  // [GET] http://localhost:8080/api/books/:id
  async getId(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // [POST] http://localhost:8080/api/books/:id
  async update(id, data) {
    return (await this.api.post(`/${id}`, data)).data;
  }

  // [DELETE] http://localhost:8080/api/books/:id
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new BookService();
