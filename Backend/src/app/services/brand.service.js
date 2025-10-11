import { ObjectId } from "mongodb";

class BrandService {
  constructor(client) {
    this.Brand = client.db().collection("Brand");
  }
}

export default BrandService;
