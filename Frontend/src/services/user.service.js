import { jsonClient } from "@/services/api.service.js";

class UserService {
  constructor(baseUrl = "/api/users") {
    this.api = jsonClient(baseUrl);
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

  // [GET] http://localhost:8080/api/users/:username
  async findByUsername(username) {
    return (await this.api.get(`/${username}`)).data;
  }

  // [POST] http://localhost:8080/api/users/:username
  async update(username, data) {
    return (await this.api.post(`/${username}`, data)).data;
  }

  // [DELETE] http://localhost:8080/api/users/:username
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new UserService();
