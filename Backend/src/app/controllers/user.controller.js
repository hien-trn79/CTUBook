import ApiError from "../api-error.js";
import UserService from "../services/user.service.js";
import MongoDB from "../utils/mongodb.util.js";
import config from "../config/index.js";
import fs from "fs";
import CartService from "../services/cart.service.js";
import { ObjectId } from "mongodb";
import RequestService from "../services/request.service.js";
import MuonService from "../services/muon.service.js";

const cloudinary = config.cloudinary;

class UserController {
  // [GET] /api/users/
  async findAll(req, res, next) {
    let document = [];
    try {
      const userService = new UserService(MongoDB.client);
      document = await userService.find({});
      res.send(document);
    } catch (error) {
      console.log("LỖI findAll");
      console.log(error);
      return next(new ApiError(500, "Không tìm thấy người dùng"));
    }
  }

  // [POST] /api/users/
  async create(req, res, next) {
    try {
      let data = req.body;
      const userService = new UserService(MongoDB.client);
      const resultEmail = await userService.find({
        EMAIL: data.EMAIL,
      });

      const resultUser = await userService.find({
        USERNAME: data.USERNAME,
      });
      if (resultEmail.length > 0 || resultUser.length > 0) {
        return next(new ApiError(400, "Email hoặc Username đã được sử dụng"));
      } else {
        const user = await userService.create(data);
        return res.status(201).send({
          message: "Tạo người dùng thành công",
          data: user,
        });
      }
    } catch (error) {
      console.log("LỖI tạo người dùng create.controller");
      console.log(error);
      return next(new ApiError(500, "Có lỗi khi tạo người dùng"));
    }
  }

  // [DELETE] /api/users/
  async deleteAll(req, res, next) {
    try {
      const userService = new UserService(MongoDB.client);
      const result = await userService.deleteAll();
      return res.send({
        message: `Đã xóa thành công ${result} users`,
      });
    } catch (error) {
      console.log("LỖI xóa tất cả users");
      console.log(error);
      return next(new ApiError(500, "Không thể xóa tất cả users"));
    }
  }

  // [GET] /api/users/:username
  async findOne(req, res, next) {
    try {
      const userService = new UserService(MongoDB.client);
      let document = await userService.findByUsername(req.params.username);

      if (!document) {
        return next(
          404,
          `Không tìm thấy user với username=${req.params.username}`
        );
      }
      return res.send(document);
    } catch (error) {
      console.log("LỖI TÌM USER" + error);
      return next(
        new ApiError(
          500,
          `Không tìm thấy user với username=${req.params.username}`
        )
      );
    }
  }

  // [PUT] /api/users/:username
  async update(req, res, next) {
    if (Object.keys(req.body).length == 0 && !req.file) {
      return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    try {
      let userId = req.params.username; // This is actually the user ID from route
      let data = { ...req.body };
      let file = req.file;

      if (file) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: process.env.FOLDER,
          });
          data.IMAGE = result.secure_url;

          // Xóa file tạm KHÔNG ĐỒNG BỘ
          fs.unlink(file.path, (err) => {
            if (err) console.log("Không thể xóa file tạm:", err.message);
          });
        } catch (uploadError) {
          console.log("Lỗi upload ảnh:", uploadError);
          // Continue without image update if upload fails
        }
      }

      const userService = new UserService(MongoDB.client);
      let document = await userService.update(userId, data);

      if (!document) {
        return next(new ApiError(404, `Không tìm thấy user với id=${userId}`));
      }

      return res.send({
        message: "Cập nhật user thành công",
        data: document,
      });
    } catch (error) {
      console.log("LỖI Cập nhật user");
      console.log(error);
      return next(new ApiError(500, "Có lỗi trong quá trình cập nhật user"));
    }
  }

  // [DELETE] /api/users/:username
  async delete(req, res, next) {
    try {
      const userID = req.params.username;
      // xoa gio hang cua user neu co
      const cartService = new CartService(MongoDB.client);
      const cartListOfUSer = await cartService.find({
        MADOCGIA: ObjectId.isValid(userID) ? new ObjectId(userID) : null,
      });
      if (cartListOfUSer.length > 0) {
        await Promise.all(
          cartListOfUSer.map(async (cart) => {
            await cartService.deleteByIdCart(cart._id);
          })
        );
      }

      // Xoa yeu cau cua user
      const requestService = new RequestService(MongoDB.client);
      const requestList = await requestService.find({
        MADOCGIA: ObjectId.isValid(userID) ? new ObjectId(userID) : null,
      });

      if (requestList.length > 0) {
        await Promise.all(
          requestList.map(async (request) => {
            await requestService.delete(request._id);
          })
        );
      }

      // Xoa don muon cua user
      const muonService = new MuonService(MongoDB.client);
      const muonList = await muonService.find({
        IDDOCGIA: ObjectId.isValid(userID) ? new ObjectId(userID) : null,
      });
      if (muonList.length > 0) {
        await Promise.all(
          muonList.map(async (muon) => {
            await muonService.delete(muon._id);
          })
        );
      }

      // Xoa user
      const userService = new UserService(MongoDB.client);
      const deletedCount = await userService.delete(userID);
      if (deletedCount === 0) {
        return next(
          new ApiError(
            404,
            `Không tìm thấy user với username=${req.params.username}`
          )
        );
      }
      return res.send({ message: "Xóa user thành công" });
    } catch (error) {
      console.log("Lỗi xóa 1 user");
      console.log(error);
      return next(
        new ApiError(
          500,
          `Không thể xóa user với username=${req.params.username}`
        )
      );
    }
  }
}

export default new UserController();
