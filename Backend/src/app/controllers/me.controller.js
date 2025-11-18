import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js";
import MongoDB from "../utils/mongodb.util.js";
import { ObjectId } from "mongodb";
import ApiError from "../api-error.js";
import jwt from "jsonwebtoken";

class MeController {
  //Protected route
  ensureAuthenticated(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) return next(new ApiError(401, "Chưa đăng nhập"));

    const parts = auth.split(" ");
    if (parts.length !== 2) return next(new ApiError(401, "Chưa đăng nhập"));

    const token = parts[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = payload;
      next();
    } catch (error) {
      return next(new ApiError(401, "Chưa đăng nhập"));
    }
  }
  // [GET] /api/me/
  async findByUsername(req, res, next) {
    try {
      const name = req.query.username;
      const password = req.query.password;
      const userService = new UserService(MongoDB.client);
      let user = await userService.find({
        USERNAME: name,
        PASSWORD: password,
      });

      user = user[0];

      if (!user || user.PASSWORD !== password) {
        return next(new ApiError(404, "Tài khoản không tồn tại"));
      }

      // Xu ly JWT
      const payload = { username: user.USERNAME, loaitk: user.LOAITK };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h",
      });

      res.json({
        token: token,
        user: { id: user._id, USERNAME: user.USERNAME, LOAITK: user.LOAITK },
      });
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
      return res.send(result);
    } catch (error) {
      console.log("Lỗi khi tạo giỏ hàng");
      console.error(error);
      return next(new ApiError(500, "Không thể tạo giỏ hàng"));
    }
  }

  // [GET] /api/me/protected
  protectAuth(req, res, next) {
    try {
      return res.json({
        message: "Lay thong tin dang nhap thanh cong",
        user: req.user,
      });
    } catch (error) {
      console.log("Lỗi khi xác thực người dùng");
      console.error(error);
      return next(new ApiError(500, "Xác thực người dùng thất bại"));
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
