import ApiError from "../api-error.js";
import MongoDB from "../utils/mongodb.util.js";
import RequestService from "../services/request.service.js";
import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js";
import ChiTietYeuCauService from "../services/chitietyeucau.service.js";
import MuonService from "../services/muon.service.js";
import { ObjectId } from "mongodb";

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

  async create(req, res, next) {
    try {
      let data = req.body;
      const requestService = new RequestService(MongoDB.client);
      const result = await requestService.create(data);
      return res.send(result);
    } catch (error) {
      console.log("Lỗi tạo yêu cầu mượn sách");
      console.log(error);
      return next(
        new ApiError(500, "Có lỗi trong quá trình tạo yêu cầu mượn sách")
      );
    }
  }

  // [PUT] /api/books/request/:id
  async update(req, res, next) {
    try {
      const id = req.params.id;
      let data = req.body;

      const trangthai = data.TRANGTHAI;
      // Truong hop chap nhan yeu cau => chuyen trang thai
      if (trangthai === 1) {
        const requestService = new RequestService(MongoDB.client);
        const result = await requestService.find({
          _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });

        const maGioHang = new ObjectId(result[0].MAGIOHANG);
        // Xoa yeu cau cau trong gio hang
        const cartService = new CartService(MongoDB.client);
        const cartData = await cartService.find({
          _id: ObjectId.isValid(maGioHang) ? new ObjectId(maGioHang) : null,
        });
        let cartUpdate = await cartService.deleteByIdCart(maGioHang);

        // Tim doc gia tu yeu cau
        const userService = new UserService(MongoDB.client);
        const docGia = await userService.findByUsername(result[0].MADOCGIA);

        // chi tiet yeu cau

        const chitietYCService = new ChiTietYeuCauService(MongoDB.client);
        const chiTietYC = await chitietYCService.find({
          MAYEUCAU: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });

        // Tao don muon sach moi
        const muonData = {
          IDDOCGIA: result[0].MADOCGIA,
          EMAIL: docGia[0].EMAIL,
          THOIGIANDAT: new Date(cartData[0].THOIGIANDAT),
          THOIGIANTRA: new Date(cartData[0].THOIGIANTRA),
          HINHTHUC: 1,
          TRANGTHAI: 1,
          SOQUYEN: chiTietYC[0].SOLUONG,
          MASACH: chiTietYC[0].MASACH,
        };

        const muonService = new MuonService(MongoDB.client);
        const resultMuon = await muonService.create(muonData);

        const requestUpdate = await requestService.update(id, data);
        return res.send(requestUpdate);
      } else {
        // Truong hop khong phai chap nhan yeu cau => chi cap nhat trang thai
        const requestService = new RequestService(MongoDB.client);
        const requestUpdate = await requestService.update(id, data);
        return res.send(requestUpdate);
      }
    } catch (error) {
      console.log("Lỗi cập nhật yêu cầu mượn sách với id=" + id);
      console.log(error);
      return next(
        new ApiError(500, "Có lỗi trong quá trình cập nhật yêu cầu mượn sách")
      );
    }
  }
}

export default new RequestController();
