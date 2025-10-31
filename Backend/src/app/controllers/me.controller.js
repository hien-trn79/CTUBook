import UserService from "../services/user.service.js";
import MongoDB from "../utils/mongodb.util.js";

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
      console.log("Loi tim kiem thong tin tai khoan");
      console.error(error);
      return next(new ApiError(500, "Khong the tim thay thong tin tai khoan"));
    }
  }
}

export default new MeController();
