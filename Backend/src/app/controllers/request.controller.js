import ApiError from "../api-error.js";
import MongoDB from "../utils/mongodb.util.js";
import RequestService from "../services/request.service.js";

class RequestController {
  // [GET] /api/books/request
  async findAll(req, res, next) {
    let document = [];
    try {
      const requestService = new RequestService(MongoDB.client);
      document = await requestService.find({});
      return res.send(document);
    } catch (error) {
      console.log("Loi lay danh sach yeu cau");
      console.log(error);
      return next(
        new ApiError(500, "Co loi trong qua trinh tim danh sach yeu")
      );
    }
  }

  // [GET] /api/books/request/:maDocGia
  async findByMaDocGia(req, res, next) {
    let document = [];
    try {
      const requestService = new RequestService(MongoDB.client);
      document = await requestService.findByMaDocGia(req.params.maDocGia);
      if (!document) {
        return next(
          new ApiError(
            404,
            "Không tìm thấy yêu cầu với mã độc giả = " + req.params.maDocGia
          )
        );
      }

      return res.send(document);
    } catch (error) {
      console.log("Lỗi khi tìm yêu cầu bởi mã độc giả =", req.params.maDocGia);
      console.log(error);
      return next(
        new ApiError(
          500,
          "Có lỗi trong quá trình tìm yêu cầu bởi mã độc giả = " +
            req.params.maDocGia
        )
      );
    }
  }
}

export default new RequestController();
