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

  // [GET] /api/books/muon-tra/don-muon/:id
  async findByIdDonMuon(req, res, next) {
    const idDonMuon = req.params.id;
    let document = [];
    try {
      const muonService = new MuonService(MongoDB.client);
      document = await muonService.find({
        _id: ObjectId.isValid(idDonMuon) ? new ObjectId(idDonMuon) : null,
      });
      if (!document || document.length === 0) {
        return next(
          new ApiError(404, "Khong tim thay don muon tra voi id don muon nay")
        );
      }
      return res.send(document);
    } catch (error) {
      console.log("Loi tim kiem don muon tra");
      console.log(error);
      return next(new ApiError(500, "Khong the tim thay don muon tra"));
    }
  }

  // [PUT] /api/books/muon-tra/don-muon/:id
  async updateByIdDonMuon(req, res, next) {
    const data = req.body;
    const idDonMuon = req.params.id;
    try {
      const muonService = new MuonService(MongoDB.client);
      const result = await muonService.update(idDonMuon, data);
      if (!result) {
        return next(
          new ApiError(404, "Khong tim thay don muon tra voi id don muon nay")
        );
      }
      return res.send({ message: "Cap nhat don muon tra thanh cong" });
    } catch (error) {
      console.log("Loi cap nhat don muon tra");
      console.log(error);
      return next(new ApiError(500, "Khong the cap nhat don muon tra"));
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
