import ApiError from "../api-error.js";
import BookService from "../services/book.service.js";
import MongoDB from "../utils/mongodb.util";

class book {
  // [GET] /api/books/
  findAll(req, res, next) {
    res.send("handler findAll");
  }

  // [POST] /api/books/
  async create(req, res, next) {
    if (!req.body?.name) {
      return new ApiError(400, "Name can not be empty");
    }

    try {
      const bookService = new BookService(MongoDB.client);
      const document = await bookService.create(req.body);
      return res.send(document);
    } catch (error) {
      return next(new ApiError(500, "Có lỗi trong hàm quá trình tạo sách mới"));
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
