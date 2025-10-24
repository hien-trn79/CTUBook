import ApiError from "../api-error.js";
import UserService from "../services/user.service..js";
import MongoDB from "../utils/mongodb.util.js";

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
      const result = await userService.deleteAll({});
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
      let document = await userService.find({
        USERNAME: req.params.username,
      });

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

  // [PUT] /api/users/:id
  async update(req, res, next) {
    if (Object.keys(req.body).length == 0) {
      return next(new ApiError(500, "Dữ liệu cập nhật không được để trống"));
    }
    try {
      const userService = new UserService(MongoDB.client);
      const document = await userService.update(req.params.id, req.body);
      if (!document) {
        return next(
          new ApiError(404, `Không thể tìm thấy user id=${req.params.id}`)
        );
      }
      return res.send({
        message: "Cập nhật user thành công",
      });
    } catch (error) {
      console.log("LỖI Cập nhật user");
      console.log(error);
      return next(new ApiError(500, "Có lỗi trong quá trình cập nhật user"));
    }
  }

  // [DELETE] /api/users/:id
  async delete(req, res, next) {
    try {
      const userService = new UserService(MongoDB.client);
      const result = await userService.delete(req.params.id);
      if (!result) {
        return next(
          new ApiError(500, `Không thể xóa user với id=${req.params.id}`)
        );
      }
      return res.send({
        message: "Xóa thành công",
      });
    } catch (error) {
      console.log("Lỗi xóa 1 user");
      console.log(error);
      return next(
        new ApiError(500, `Không thể xóa user với id=${req.params.id}`)
      );
    }
  }
}

export default new UserController();
