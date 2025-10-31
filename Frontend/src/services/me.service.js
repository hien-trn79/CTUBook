import { jsonClient, formClient } from "./api.service";

class MeCService {
  constructor(baseUrl = "/api/me") {
    this.api = jsonClient(baseUrl);
  }

  // [GET] http://localhost:8080/api/me?username=&password=
  async getQuery(query = {}) {
    return (await this.api.get("/", { params: query })).data;
  }
}

export default new MeCService();
