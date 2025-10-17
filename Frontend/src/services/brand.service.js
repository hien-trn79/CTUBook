import { jsonClient, formClient } from "./api.service";

class BrandService {
  constructor(baseUrl = "/api/brands") {
    this.api = jsonClient(baseUrl);
    this.formApi = formClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async getId(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }
}

export default new BrandService();
