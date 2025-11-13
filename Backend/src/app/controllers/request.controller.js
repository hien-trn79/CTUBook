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
      const idYeuCau = req.params.id;
      let data = req.body;

      const trangthai = data.TRANGTHAI;
      // Tim kiem yeu cau muon sach
      const requestService = new RequestService(MongoDB.client);
      const result = await requestService.find({
        _id: ObjectId.isValid(idYeuCau) ? new ObjectId(idYeuCau) : null,
      });

      const chiTietService = new ChiTietYeuCauService(MongoDB.client);
      const chiTietList = await chiTietService.find({
        MAYEUCAU: ObjectId.isValid(idYeuCau) ? new ObjectId(idYeuCau) : null,
      });

      // Truong hop chap nhan yeu cau => chuyen trang thai
      if (trangthai === 1) {
        console.log("Request: ", result);
        const MuonData = {
          IDDOCGIA: result[0].MADOCGIA,
          THOIGIANMUON: new Date(result[0].THOIGIANDAT),
          THOIGIANTRA: new Date(result[0].THOIGIANTRA),
          TRANGTHAI: 1, // Dang muon
          HINHTHUC: 1,
        };
        // Tao don muon moi
        const muonService = new MuonService(MongoDB.client);
        const resultMuon = await muonService.create(MuonData, chiTietList);

        // Cap nhat trang thai yeu cau
        const updatedRequest = await requestService.update(idYeuCau, data);

        // Cap nhat trang thai gio hang
        await Promise.all(
          chiTietList.map(async (chiTiet) => {
            const cartService = new CartService(MongoDB.client);
            const cartItem = await cartService.find({
              _id: ObjectId.isValid(chiTiet.MAGIOHANG)
                ? new ObjectId(chiTiet.MAGIOHANG)
                : null,
            });

            // Cap nhat trang thai gio hang
            if (cartItem[0]) {
              // Xoa luon gio hang sau khi cap nhat
              const resultDeleteCart = await cartService.deleteByIdCart(
                cartItem[0]._id
              );
            }
          })
        );
      } else {
        // Truong hop khong phai chap nhan yeu cau => chi cap nhat trang thai;
        const updatedRequest = await requestService.update(idYeuCau, data);
        // Cap nhat lai trang thai gio hang
        await Promise.all(async (chitiet) => {
          const cartService = new CartService(MongoDB.client);
          const cartItem = await cartService.find({
            _id: ObjectId.isValid(chiTiet.MAGIOHANG)
              ? new ObjectId(chiTiet.MAGIOHANG)
              : null,
          });
          if (cartItem.length > 0) {
            const updatedCart = await cartService.updateByIdCart(
              cartItem[0]._id,
              { TRANGTHAI: trangthai } // cap nhat dung trang thai yeu cau
            );
          }
        });
      }
    } catch (error) {
      console.log("Lỗi cập nhật yêu cầu mượn sách với id=" + id);
      console.log(error);
      return next(
        new ApiError(500, "Có lỗi trong quá trình cập nhật yêu cầu mượn sách")
      );
    }
  }

  async getCount(req, res, next) {
    try {
      const requestService = new RequestService(MongoDB.client);
      const count = await requestService.getCount();
      return res.send({ count: count });
    } catch (error) {
      console.log("Lỗi lấy tổng số yêu cầu mượn sách");
      console.log(error);
      return next(
        new ApiError(
          500,
          "Có lỗi trong quá trình lấy tổng số yêu cầu mượn sách"
        )
      );
    }
  }
}

export default new RequestController();
