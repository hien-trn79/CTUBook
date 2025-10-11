import ApiError from "../api-error.js";
import BrandService from "../services/brand.service.js";
import MongoDB from "../utils/mongodb.util.js";

class BrandController {
  // [GET] /api/brands/
  async findAll(req, res, next) {
    let document = [];
    try {
      const brandService = new BrandService(MongoDB.client);
      document = await brandService.find({});
      return res.send(document);
    } catch (error) {
      return next(new ApiError(500, "Khong the lay toan bo nha xuat ban"));
    }
  }

  // [POST] /api/brands/
  async create(req, res, next) {
    try {
      const brandService = new BrandService(MongoDB.client);
      let data = req.body;
      const result = await brandService.create(data);
      return res.send({
        message: "Them nha xuat ban moi thanh cong",
      });
    } catch (error) {
      console.log("LOI tao moi nha xuat ban");
      console.log(error);
      return next(new ApiError(500, "Co loi khi tao moi nha xuat ban"));
    }
  }

  // [DELETE] /api/brands/
  async deleteAll(req, res, next) {
    try {
      const brandService = new BrandService(MongoDB.client);
      const result = await brandService.deleteAll({});
      return res.send({
        message: "Xoa tat ca thanh cong",
      });
    } catch (error) {
      console.log(error);
      return next(new ApiError(500, "Khong the xoa toan bo brand"));
    }
  }

  // [GET] /api/brands/:id
  async findOne(req, res, next) {
    try {
      const brandService = new BrandService(MongoDB.client);
      const result = await brandService.findByName(req.params.id);

      if (!result) {
        return next(new ApiError(404, "Khong tim thay nha xuat ban"));
      }
    } catch (error) {
      console.log("Loi tim nha xuat ban");
      console.log(error);
      return next(new ApiError(404, "Khong tim thay nha xuat ban"));
    }
  }

  // [PUT] /api/brands/:id
  async update(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      return next(new ApiError(400, "Noi dung khong duoc de trong"));
    }
    try {
      const brandService = new BrandService(MongoDB.client);
      const result = await brandService.update(req.params.id, req.body);
      if (!result) {
        return next(new ApiError(500, "Khong tim thay brand de cap nhat"));
      }
      return res.send({
        message: "Cap nhat thanh cong",
      });
    } catch (error) {
      console.log(error);
      return next(new ApiError(500, "Khong tim thay brand"));
    }
  }

  // [DELETE] /api/brands/:id
  async delete(req, res, next) {
    try {
      const brandService = new BrandService(MongoDB.client);
      const result = await brandService.delete(req.params.id);

      if (!result) {
        return next(new ApiError(500, "Khong tim thay brand de xoa"));
      }
      return res.send({
        message: "Xoa thanh cong",
      });
    } catch (error) {
      console.log(error);
      return next(new ApiError(500, "Khong tim thay brand de xoa"));
    }
  }
}

export default new BrandController();
