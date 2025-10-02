class book {
  // [GET] /api/books/
  findAll(req, res, next) {
    res.send("handler findAll");
  }

  // [POST] /api/books/
  async create(req, res, next) {
    if (!req.body?.name) {
      return new ApiError();
    }
  }

  // [DELETE] /api/books/
  deleteAll(req, res, next) {
    res.send("handler deleteAll");
  }

  // [GET] /api/books/:id
  findOne(req, res, next) {
    res.send("handler findOne");
  }

  // [PUT] /api/books/:id
  update(req, res, next) {
    res.send("handler update");
  }

  // [DELETE] /api/books/:id
  delete(req, res, next) {
    res.send("handler delete");
  }
}

export default new book();
