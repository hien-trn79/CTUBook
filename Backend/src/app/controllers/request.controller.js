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
}

export default new RequestController();
