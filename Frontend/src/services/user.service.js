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
    try {
      const response = await this.api.post("/", data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error("Email hoặc Username đã được sử dụng");
      }

      throw error;
    }
  }

  // [DELETE] http://localhost:8080/api/users/
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  // [GET] http://localhost:8080/api/users/:username
  async findByUsername(username) {
    console.log("Finding user with username:", username);
    try {
      const response = await this.api.get(`/${username}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error("Username không tồn tại");
      }
      throw error;
    }
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
