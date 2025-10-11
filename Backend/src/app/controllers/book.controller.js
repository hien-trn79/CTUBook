import ApiError from "../api-error.js";
import BookService from "../services/book.service.js";
import MongoDB from "../utils/mongodb.util.js";

class book {
  // [GET] /api/books/
  async findAll(req, res, next) {
    let document = [];
    try {
      const bookService = new BookService(MongoDB.client);
      document = await bookService.find({});

      return res.send(document);
    } catch (error) {
      return next(new ApiError(500, "Có lỗi trong quá trình tìm kiếm findAll"));
    }
  }

  // [POST] /api/books/
  async create(req, res, next) {
    try {
      const bookService = new BookService(MongoDB.client);
      const result = await bookService.create(req.body);
      return res.send({
        message: "Thêm mới sách thành công",
      });
    } catch (error) {
      console.log("LỖI TẠO SÁCH");
      return next(new ApiError(500, "Có lỗi trong quá trình tạo sách"));
    }
  }

  // [DELETE] /api/books/
  async deleteAll(req, res, next) {
    try {
      const bookService = new BookService(MongoDB.client);
      const deleteCount = await bookService.deleteAll();
      return res.send({
        message: `Đã xóa thành công ${deleteCount} sách`,
      });
    } catch (error) {
      return next(new ApiError(500, "Đã xóa tất cả sách thành công"));
    }
  }

  // [GET] /api/books/favorite
  async findAllFavorite(req, res, next) {
    try {
      const bookService = new BookService(MongoDB.client);
      const document = await bookService.findFavorite();
      return res.send(document);
    } catch (error) {
      console.log(error);
      return next(
        new ApiError(
          500,
          error.message || "Có lỗi trong quá trình tìm sách được yêu thích"
        )
      );
    }
  }

  // [GET] /api/books/:id
  async findOne(req, res, next) {
    try {
      const bookService = new BookService(MongoDB.client);
      const document = await bookService.findById(req.params.id);
      if (!document) {
        return next(
          new ApiError(404, `Không tìm thấy sách với id=${req.params.id}`)
        );
      }
      return res.send(document);
    } catch (error) {
      return next(
        new ApiError(404, `Không tìm thấy sách với id=${req.params.id}`)
      );
    }
  }

  // [PUT] /api/books/:id
  async update(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      // du lieu cap nhat la rong
      return next(new ApiError(400, "Dữ liệu cập nhật không được để trống !!"));
    }
    try {
      const bookService = new BookService(MongoDB.client);
      const document = await bookService.update(req.params.id, req.body);
      if (!document) {
        return next(new ApiError(404, "Không tìm thấy sách để cập nhật"));
      }
      return res.send(document);
    } catch (error) {
      return next(
        new ApiError(
          500,
          `Có lỗi trong quá trình cập nhật sách với id=${req.params.id}`
        )
      );
    }
  }

  // [DELETE] /api/books/:id
  async delete(req, res, next) {
    try {
      const bookService = new BookService(MongoDB.client);
      const document = await bookService.delete(req.params.id);
      if (!document) {
        return next(new ApiError(404, "Không tìm thấy sách để xóa !!"));
      }

      return res.send({
        message: "Xóa sách thành công",
      });
    } catch (error) {
      return next(new ApiError(500, "Có lỗi trong quá trình xóa sách"));
    }
  }
}

export default new book();
