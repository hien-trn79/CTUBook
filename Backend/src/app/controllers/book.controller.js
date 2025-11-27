import ApiError from "../api-error.js";
import BookService from "../services/book.service.js";
import MongoDB from "../utils/mongodb.util.js";
import config from "../config/index.js";
import fs from "fs";

const cloudinary = config.cloudinary;

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
      let data = req.body;
      let file = req.file;

      // Upload ảnh lên Cloudinary
      const resultFile = await cloudinary.uploader.upload(file.path, {
        folder: process.env.FOLDER,
      });

      data["IMAGE"] = resultFile.secure_url;

      const bookService = new BookService(MongoDB.client);
      const result = await bookService.create(data);

      // Xóa file tạm KHÔNG ĐỒNG BỘ (async) - không chờ
      fs.unlink(file.path, (err) => {
        if (err) console.log("Không thể xóa file tạm:", err.message);
      });

      // Trả về ngay lập tức sau khi insert thành công
      return res.status(201).send({
        message: "Thêm mới sách thành công",
        data: result,
      });
    } catch (error) {
      console.error("LỖI TẠO SÁCH:", error);
      return next(
        new ApiError(500, "Có lỗi trong quá trình tạo sách: " + error.message)
      );
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

  // [GET] /api/books/search?search=abc
  async searchBooks(req, res, next) {
    try {
      const search = req.query.search || "";
      let condition = {};
      let document = [];
      if (search) {
        const keyword = { $regex: new RegExp(search), $options: "i" }; // khong phan biet hoa thuong
        condition = {
          TENSACH: keyword, // tim gan dung va khong phan biet hoa thuong
        };
      }
      try {
        const bookService = new BookService(MongoDB.client);
        document = await bookService.find(condition);
      } catch (error) {
        console.log("LOI tim kiem sach");
        console.error(error);
        return next(new ApiError(500, "Khong the tim kiem sach"));
      }
      return res.send(document);
    } catch (error) {
      console.log("LOI tim kiem sach");
      console.error(error);
      return next(new ApiError(500, "Có lỗi trong quá trình tìm kiếm sách"));
    }
  }

  // [GET] /api/books/count
  async countBooks(req, res, next) {
    try {
      const bookService = new BookService(MongoDB.client);
      const allBooks = await bookService.find({});
      let count = 0;
      allBooks.forEach((book) => {
        count += Number(book.SOQUYEN);
      });
      return res.send({ count: count });
    } catch (error) {
      console.log(error);
      return next(new ApiError(500, "Có lỗi trong quá trình đếm sách"));
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
      return next(new ApiError(400, "Dữ liệu cập nhật không được để trống !!"));
    }
    try {
      let id = req.params.id;
      let data = req.body;

      if (Number(data.SOQUYEN) <= 0) {
        data.TRANGTHAI = "1"; // Het sach
      } else {
        data.TRANGTHAI = "0"; // Con sach
      }

      if (req.file) {
        let file = req.file;
        const result = await cloudinary.uploader.upload(file.path, {
          folder: process.env.FOLDER,
        });
        data["IMAGE"] = result.secure_url;

        // Xóa file tạm KHÔNG ĐỒNG BỘ - không chờ
        fs.unlink(file.path, (err) => {
          if (err) console.log("Không thể xóa file tạm:", err.message);
        });
      }

      const bookService = new BookService(MongoDB.client);
      let document = await bookService.update(id, data);

      if (!document) {
        return next(
          new ApiError(404, `Không tìm thấy sách cập nhật với id=${id}`)
        );
      }

      // Trả về ngay lập tức
      return res.send({
        message: "Cập nhật sách thành công",
        data: document,
      });
    } catch (error) {
      console.error("LỖI CẬP NHẬT SÁCH:", error);
      return next(
        new ApiError(
          500,
          `Có lỗi trong quá trình cập nhật sách với id=${req.params.id}: ${error.message}`
        )
      );
    }
  }

  // [DELETE] /api/books/:id
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const bookService = new BookService(MongoDB.client);
      const document = await bookService.delete(id);
      if (!document) {
        return next(new ApiError(404, "Không tìm thấy sách để xóa !!"));
      }

      return res.send({
        message: "Xóa sách thành công",
      });
    } catch (error) {
      console.log("LOI xoa sach");
      console.error(error);
      return next(new ApiError(500, "Có lỗi trong quá trình xóa sách"));
    }
  }

  // [GET] /api/books/status-approved
  async getApprovedAll(req, res, next) {
    try {
      const bookService = new BookService(MongoDB.client);
      const document = await bookService.getApproveAll();
      return res.send(document);
    } catch (error) {
      console.log("LOI lay danh sach da duyet");
      console.error(error);
      return next(new ApiError(500, "Khong the lay danh sach sach da duyet"));
    }
  }

  // [GET] /api/books/status-waiting
  async getWaitingAll(req, res, next) {
    try {
      const bookService = new BookService(MongoDB.client);
      const document = await bookService.getWaitingAll();
      return res.send(document);
    } catch (error) {
      console.log("LOI lay danh sach da duyet");
      console.error(error);
      return next(new ApiError(500, "Khong the lay danh sach sach da duyet"));
    }
  }

  // [GET] /api/books/status-none
  async getNoneAll(req, res, next) {
    try {
      const bookService = new BookService(MongoDB.client);
      const document = await bookService.getNoneAll();
      return res.send(document);
    } catch (error) {
      console.log("LOI lay danh sach da duyet");
      console.error(error);
      return next(new ApiError(500, "Khong the lay danh sach sach da duyet"));
    }
  }

  // [GET] /api/books/status-returned
  async getReturnedAll(req, res, next) {
    try {
      const bookService = new BookService(MongoDB.client);
      const document = await bookService.getReturnedAll();
      return res.send(document);
    } catch (error) {
      console.log("LOI lay danh sach da duyet");
      console.error(error);
      return next(new ApiError(500, "Khong the lay danh sach sach da duyet"));
    }
  }
}

export default new book();
