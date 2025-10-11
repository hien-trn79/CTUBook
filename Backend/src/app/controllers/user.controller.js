class user {
  // [GET] /api/users/
  async findAll(req, res, next) {}

  // [POST] /api/users/
  create(req, res, next) {
    res.send("Handler create user");
  }

  // [DELETE] /api/users/
  deleteAll(req, res, next) {
    res.send("Handler delete all user");
  }

  // [GET] /api/users/:id
  findOne(req, res, next) {
    res.send("Handler findOne");
  }

  // [PUT] /api/users/:id
  update(req, res, next) {
    res.send("Handler update user");
  }

  // [DELETE] /api/users/:id
  delete(req, res, next) {
    res.send("Handler delete user by ID");
  }
}

export default new user();
