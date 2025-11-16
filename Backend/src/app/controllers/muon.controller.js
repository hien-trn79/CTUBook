import { ObjectId } from "mongodb";
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
      res.send(document);
    } catch (error) {
      console.log("Loi tim kiem danh sach muon");
      console.log(error);
      return next(new ApiError(500, "khong the tim thay danh sach don muon"));
    }
  }

  // [GET] /api/books/muon-tra/:MADOCGIA
  async findByMaDocGia(req, res, next) {
    let document = [];
    try {
      const maDocGia = req.params.MADOCGIA;
      const muonService = new MuonService(MongoDB.client);
      document = await muonService.find({
        IDDOCGIA: ObjectId.isValid(maDocGia)
          ? new ObjectId(maDocGia)
          : maDocGia,
      });

      if (!document || document.length === 0) {
        return next(
          new ApiError(404, "Khong tim thay don muon tra voi ma doc gia nay")
        );
      }

      return res.send(document);
    } catch (error) {
      console.log("Loi tim kiem danh sach muon");
      console.log(error);
      return next(new ApiError(500, "khong the tim thay danh sach don muon"));
    }
  }

  // [POST] /api/books/muon-tra
  async create(req, res, next) {
    let document = [];
    try {
      let data = req.body;
      const muonService = new MuonService(MongoDB.client);
      const result = await muonService.create(data);
      return res.send({ message: "Tao don muon tra thanh cong" });
    } catch (error) {
      console.log("Loi tao don muon tra");
      console.log(error);
      return next(new ApiError(500, "Khong the tao don muon tra"));
    }
  }

  // [DELETE] /api/books/muon-tra/:id
  async delete(req, res, next) {
    try {
      const idDocGia = req.params.MADOCGIA;
      const muonService = new MuonService(MongoDB.client);
      const muonList = await muonService.find({
        IDDOCGIA: ObjectId.isValid(idDocGia) ? new ObjectId(idDocGia) : null,
      });
      if (muonList.length > 0) {
        await Promise.all(
          muonList.map(async (muon) => {
            const result = muonService.delete(muon._id);
            return result;
          })
        );
        return res.send({ message: "Xoa don muon tra thanh cong" });
      }
    } catch (error) {
      console.log("Loi xoa don muon tra");
      console.log(error);
      return next(new ApiError(500, "Khong the xoa don muon tra"));
    }
  }
}

export default new MuonController();
