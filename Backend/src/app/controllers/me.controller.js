import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js";
import MongoDB from "../utils/mongodb.util.js";
import { ObjectId } from "mongodb";
import ApiError from "../api-error.js";

class MeController {
  // [GET] /api/me/
  async findByUsername(req, res, next) {
    try {
      const name = req.query.username;
      const password = req.query.password;
      const userService = new UserService(MongoDB.client);
      const document = await userService.find({
        USERNAME: name,
      });
      res.send(document);
    } catch (error) {
      console.log("Lỗi khi tìm kiếm thông tin tài khoản");
      console.error(error);
      return next(new ApiError(500, "Không thể tìm thấy thông tin tài khoản"));
    }
  }

  // [POST] /api/me/
  async create(req, res, next) {
    try {
      let body = req.body;
      const cartService = new CartService(MongoDB.client);
      const result = await cartService.create(body);
    } catch (error) {
      console.log("Lỗi khi tạo giỏ hàng");
      console.error(error);
      return next(new ApiError(500, "Không thể tạo giỏ hàng"));
    }
  }

  // [GET] /api/me/my-cart/:id
  async getMyCart(req, res, next) {
    try {
      const id = req.params.id;
      const cartService = new CartService(MongoDB.client);
      const document = await cartService.find({
        MADOCGIA: ObjectId.isValid(id) ? new ObjectId(id) : id,
      });
      res.send(document);
    } catch (error) {
      console.log(error);
      return next(new ApiError(500, "Không thể tìm toàn bộ giỏ hàng"));
    }
  }

  // [PUT] /api/me/my-cart/:id
  async updateMyCart(req, res, next) {
    try {
      const id = req.params.id;
      let data = req.body;
      const cartService = new CartService(MongoDB.client);
      const result = await cartService.updateByIdCart(id, data);
      return res.send(result);
    } catch (error) {
      console.log("Lỗi khi cập nhật giỏ hàng");
      console.error(error);
      return next(
        new ApiError(500, `Không thể cập nhật giỏ hàng với id=${req.params.id}`)
      );
    }
  }

  // [DELETE] /api/me/my-cart/:id
  async deleteMyCart(req, res, next) {
    try {
      const id = req.params.id;
      const cartService = new CartService(MongoDB.client);
      const result = await cartService.deleteByIdCart(id);
      return res.send({
        message: "Đã xóa giỏ hàng thành công",
      });
    } catch (error) {
      console.log("Lỗi khi xóa giỏ hàng \n");
      console.error(error);
      return next(
        new ApiError(500, `Không thể xóa giỏ hàng với id=${req.params.id}`)
      );
    }
  }
}

export default new MeController();
