import ApiError from "../api-error.js";
import MongoDB from "../utils/mongodb.util.js";
import RequestService from "../services/request.service.js";
import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js";
import ChiTietYeuCauService from "../services/chitietyeucau.service.js";
import MuonService from "../services/muon.service.js";
import { ObjectId } from "mongodb";
import BookService from "../services/book.service.js";

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

  // [POST] /api/books/request
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
      let trangthai = req.body.TRANGTHAI;

      // Tim kiem yeu cau muon sach
      const requestService = new RequestService(MongoDB.client);
      let data = await requestService.find({
        _id: ObjectId.isValid(idYeuCau) ? new ObjectId(idYeuCau) : null,
      });
      data = data[0];

      const chiTietService = new ChiTietYeuCauService(MongoDB.client);
      const chiTietList = await chiTietService.find({
        MAYEUCAU: ObjectId.isValid(idYeuCau) ? new ObjectId(idYeuCau) : null,
      });

      // Kiem tra sach ton kho
      if (chiTietList.length > 0 && trangthai === 1) {
        // Kiểm tra số lượng sách trước
        let khongDuSach = false;

        for (const chiTiet of chiTietList) {
          const bookService = new BookService(MongoDB.client);
          let book = await bookService.findById(chiTiet.MASACH);
          const soLuongConLai = Number(book.SOQUYEN) - Number(chiTiet.SOLUONG);

          if (soLuongConLai < 0) {
            khongDuSach = true;
            break; // Dừng kiểm tra ngay khi phát hiện không đủ
          } else {
            // Cập nhật số lượng sách trong kho
            const bookService = new BookService(MongoDB.client);
            const resultBookUpdate = await bookService.update(chiTiet.MASACH, {
              SOQUYEN: soLuongConLai,
            });
          }
        }

        // Nếu không đủ sách, từ chối yêu cầu
        if (khongDuSach) {
          trangthai = 2; // Da tu choi do khong du so luong sach
          data.TRANGTHAI = trangthai;

          // Cập nhật trạng thái yêu cầu
          const updatedRequest = await requestService.update(idYeuCau, data);

          // Cập nhật trạng thái giỏ hàng
          await Promise.all(
            chiTietList.map(async (chiTiet) => {
              const cartService = new CartService(MongoDB.client);
              let cartItem = await cartService.findByIdCart(chiTiet.MAGIOHANG);
              if (cartItem) {
                cartItem.TRANGTHAI = trangthai;
                await cartService.updateByIdCart(cartItem._id, cartItem);
              }
            })
          );

          // Trả về lỗi cho frontend
          return next(new ApiError(400, "Không đủ số lượng sách để mượn"));
        }

        // Nếu đủ sách, tiến hành chấp nhận yêu cầu
        const MuonData = {
          IDDOCGIA: data.MADOCGIA, // Sửa từ result[0] thành data
          THOIGIANMUON: new Date(data.THOIGIANDAT),
          THOIGIANTRA: new Date(data.THOIGIANTRA),
          TRANGTHAI: 1, // Dang muon
          HINHTHUC: 1,
        };

        // Tao don muon moi
        const muonService = new MuonService(MongoDB.client);
        const resultMuon = await muonService.create(MuonData, chiTietList);

        // Cập nhật số lượng sách và trạng thái
        data.TRANGTHAI = trangthai;
        const updatedRequest = await requestService.update(idYeuCau, data);

        // Cap nhat trang thai gio hang (xóa giỏ hàng)
        await Promise.all(
          chiTietList.map(async (chiTiet) => {
            const cartService = new CartService(MongoDB.client);
            const cartItem = await cartService.find({
              _id: ObjectId.isValid(chiTiet.MAGIOHANG)
                ? new ObjectId(chiTiet.MAGIOHANG)
                : null,
            });

            if (cartItem[0]) {
              await cartService.deleteByIdCart(cartItem[0]._id);
            }
          })
        );

        return res.send({ success: true, data: resultMuon });
      }

      // Truong hop khong phai chap nhan yeu cau (trangthai !== 1)
      data.TRANGTHAI = trangthai;
      const updatedRequest = await requestService.update(idYeuCau, data);

      // Cap nhat lai trang thai gio hang
      await Promise.all(
        chiTietList.map(async (chiTiet) => {
          const cartService = new CartService(MongoDB.client);
          let cartItem = await cartService.findByIdCart(chiTiet.MAGIOHANG);
          if (cartItem) {
            cartItem.TRANGTHAI = trangthai;
            await cartService.updateByIdCart(cartItem._id, cartItem);
          }
        })
      );

      return res.send(updatedRequest);
    } catch (error) {
      console.log("Lỗi cập nhật yêu cầu mượn sách với id=" + idYeuCau); // Sửa từ id thành idYeuCau
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

  // [DELETE] /api/books/request/:id
  async delete(req, res, next) {
    try {
      const idYeuCau = req.params.id;
      const requestService = new RequestService(MongoDB.client);
      const deletedCount = await requestService.delete(idYeuCau);
      if (deletedCount === 0) {
        return next(
          new ApiError(
            404,
            "Không tìm thấy yêu cầu mượn sách với id=" + idYeuCau
          )
        );
      }
    } catch (error) {
      console.log("Lỗi xóa yêu cầu mượn sách với id=" + idYeuCau);
      console.log(error);
      return next(
        new ApiError(500, "Có lỗi trong quá trình xóa yêu cầu mượn sách")
      );
    }
  }
}

export default new RequestController();
