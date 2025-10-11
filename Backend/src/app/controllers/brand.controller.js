class BrandController {
  // [GET] /api/brands/
  async findAll(req, res, next) {
    res.send("Handler brand findAll");
  }

  // [POST] /api/brands/
  async create(req, res, next) {
    res.send("Handler brand create");
  }

  // [DELETE] /api/brands/
  async deleteAll(req, res, next) {
    res.send("Handler brand deleteAll");
  }

  // [GET] /api/brands/:id
  async findOne(req, res, next) {
    res.send("Handler brand findOne");
  }

  // [PUT] /api/brands/:id
  async update(req, res, next) {
    res.send("Handler brand update");
  }

  // [DELETE] /api/brands/:id
  async delete(req, res, next) {
    res.send("Handler brand delete");
  }
}

export default new BrandController();
