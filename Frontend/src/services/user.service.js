import createClientApi from "@/services/api.service.js";

class UserService {
  constructor(baseUrl = "/api/users") {
    this.api = createClientApi(baseUrl);
  }
  // [GET] http://localhost:8080/api/users/
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // [POST] http://localhost:8080/api/users/
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // [DELETE] http://localhost:8080/api/users/
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  // [GET] http://localhost:8080/api/users/:id
  async getId(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // [POST] http://localhost:8080/api/users/:id
  async update(id, data) {
    return (await this.api.post(`/${id}`, data)).data;
  }

  // [DELETE] http://localhost:8080/api/users/:id
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new UserService();
