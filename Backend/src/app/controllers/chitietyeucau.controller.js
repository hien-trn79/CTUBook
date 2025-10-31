import ChiTietYeuCau from "../services/chitietyeucau.service.js";
import ApiError from "../api-error.js";
import MongoDB from "../utils/mongodb.util.js";
import { ObjectId } from "mongodb";

class ChiTietYeuCauController {
  // [GET] /api/books/chi-tiet-yeu-cau/
  async findAll(req, res, next) {
    let document = [];
    try {
      const chitietyeucau = new ChiTietYeuCau(MongoDB.client);
      document = await chitietyeucau.find({});
      return res.send(document);
    } catch (error) {
      console.log("Loi tim tat ca chi tiet yeu cau");
      console.log(error);
      return next(new ApiError(500, "Khong the tim thay chi tiet yeu cau"));
    }
  }

  // [GET] /api/books/chi-tiet-yeu-cau/:MAYEUCAU

  async findByIDMAYEUCAU(req, res, next) {
    let document = [];
    try {
      const MAYEUCAU = req.params.MAYEUCAU;
      const chitietyeucau = new ChiTietYeuCau(MongoDB.client);
      document = await chitietyeucau.find({
        MAYEUCAU: ObjectId.isValid(MAYEUCAU)
          ? new ObjectId(MAYEUCAU)
          : MAYEUCAU,
      });
      return res.send(document);
    } catch (error) {
      console.log("Loi tim chi tiet yeu cau theo ma yeu cau");
      console.log(error);
      return next(
        new ApiError(500, "Khong the tim chi tiet yeu cau theo ma yeu cau")
      );
    }
  }
}

export default new ChiTietYeuCauController();
