import ApiError from "../api-error.js";
import MuonService from "../services/muon.service.js";
import MongoDB from "../utils/mongodb.util.js";

class MuonController {
  // [GET] /api/books/muon-tra
  async findAll(req, res, next) {
    let document = [];
    try {
      const muonService = new MuonService(MongoDB.client);
      document = await muonService.find({});
      return res.send(document);
    } catch (error) {
      console.log("Loi tim kiem danh sach muon");
      console.log(error);
      return next(new ApiError(500, "khong the tim thay danh sach don muon"));
    }
  }
}

export default new MuonController();
