import ChiTietDonMuon from "../services/ChiTietDonMuon.service.js";
import ApiError from "../api-error.js";
import MongoDB from "../utils/mongodb.util.js";
import { ObjectId } from "mongodb";

class ChiTietDonMuonController {
  // [GET] /api/books/chi-tiet-don-muon/
  async findAll(req, res, next) {
    let document = [];
    try {
      const MADONMUON = req.query.MADONMUON;
      console.log("MADONMUON: ", MADONMUON);
      const chitietdonmuon = new ChiTietDonMuon(MongoDB.client);
      document = await chitietdonmuon.find({
        IDDONMUON: ObjectId.isValid(MADONMUON)
          ? new ObjectId(MADONMUON)
          : MADONMUON,
      });
      return res.send(document);
    } catch (error) {
      console.log("Loi tim tat ca chi tiet don muon");
      console.log(error);
      return next(new ApiError(500, "Khong the tim thay chi tiet don muon"));
    }
  }

  // [GET] /api/books/chi-tiet-don-muon/:MADONMUON
  async findByIDDonMuon(req, res, next) {
    let document = [];
    try {
      const MADONMUON = req.params.MADONMUON;
      const chitietdonmuon = new ChiTietDonMuon(MongoDB.client);
      document = await chitietdonmuon.find({
        IDDONMUON: ObjectId.isValid(MADONMUON)
          ? new ObjectId(MADONMUON)
          : MADONMUON,
      });
      return res.send(document);
    } catch (error) {
      console.log("Loi tim chi tiet don muon theo ma don muon");
      console.log(error);
      return next(
        new ApiError(500, "Khong the tim chi tiet don muon theo ma don muon")
      );
    }
  }
}

export default new ChiTietDonMuonController();
