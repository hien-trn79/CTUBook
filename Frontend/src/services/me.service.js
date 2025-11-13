import { jsonClient, formClient } from "./api.service";

class MeCService {
  constructor(baseUrl = "/api/me") {
    this.api = jsonClient(baseUrl);
  }

  // [GET] http://localhost:8080/api/me?username=&password=
  async getQuery(query = {}) {
    return (await this.api.get("/", { params: query })).data;
  }

  // [POST] http://localhost:8080/api/me/
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // [GET] http://localhost:8080/api/me/my-cart
  async getMyCart(id) {
    return (await this.api.get(`/my-cart/${id}`)).data;
  }

  // [PUT] http://localhost:8080/api/me/my-cart/:id
  async updateMyCart(id, data) {
    return (await this.api.put(`/my-cart/${id}`, data)).data;
  }

  // [DELETE] http://localhost:8080/api/me/my-cart/:id
  async deleteMyCart(id) {
    return (await this.api.delete(`/my-cart/${id}`)).data;
  }
}

export default new MeCService();
