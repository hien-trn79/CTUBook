import { ObjectId } from "mongodb";

class BrandService {
  constructor(client) {
    this.Brand = client.db().collection("Brand");
  }

  extractBrandData(payload) {
    const brand = {
      MANXB: payload.MANXB,
      TENNXB: payload.TENNXB,
      DIACHI: payload.DIACHI,
    };

    ObjectId.keys(brand).forEach((key) => {
      brand[key] == undefined && delete brand[key];
    });

    return brand;
  }

  async find(filter) {
    const cursor = await this.Brand.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Brand.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findByNXB(manxb) {
    return this.Brand.findOne({
      MANXB: manxb,
    });
  }

  async create(data) {
    const brand = this.extractBrandData(data);
    const result = await this.Brand.insertOne(brand);
    return result.value;
  }

  async update(id, data) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const newbrand = this.extractBrandData(data);
    const result = await this.Brand.findOneAndUpdate(
      filter,
      { $set: newbrand },
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.Brand.deleteOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async deleteAll() {
    const result = await this.Brand.deleteMany({});
    return result.deleteCount;
  }
}

export default BrandService;
