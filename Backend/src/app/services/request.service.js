import { ObjectId } from "mongodb";
import MongoDB from "../utils/mongodb.util.js";
import ChiTietYeuCauService from "./chitietyeucau.service.js";

class RequestService {
  constructor(client) {
    this.Request = client.db().collection("YeuCau");
  }

  extractRequestData(payload) {
    const request = {
      THOIGIANDAT: payload.THOIGIANDAT,
      MADOCGIA: payload.MADOCGIA,
      TRANGTHAI: payload.TRANGTHAI,
      THOIGIANTRA: payload.THOIGIANTRA,
    };

    Object.keys(request).forEach((key) => {
      request[key] == undefined && delete request[key];
    });
    return request;
  }

  async find(filter) {
    const cursor = await this.Request.find(filter);
    return cursor.toArray();
  }

  // /api/books/request/:maDocGia
  async findByMaDocGia(maDocGia) {
    return await this.Request.find({
      MADOCGIA: ObjectId.isValid(maDocGia) ? new ObjectId(maDocGia) : null,
    }).toArray();
  }

  // Them yeu cau moi trong YeuCau
  async create(data) {
    let exits = false;
    let requestTrungLap = {};
    const requestList = await this.Request.find({
      TRANGTHAI: { $ne: 1 },
    }).toArray();
    console.log("Danh sách yêu cầu chưa hoàn thành:", requestList);
    if (requestList.length > 0) {
      for (let request of requestList) {
        const chiTietYeuCauService = new ChiTietYeuCauService(MongoDB.client);
        const chiTietList = await chiTietYeuCauService.find({
          MAYEUCAU: request._id,
        });

        const sachTrongYeuCau = chiTietList.map((item) =>
          item.MASACH.toString()
        );
        const sachTrongGioHang = data.map((item) => item.IDSACH.toString());

        const trunglap =
          sachTrongGioHang.length == sachTrongYeuCau.length &&
          sachTrongYeuCau.every((id) => sachTrongGioHang.includes(id));

        if (trunglap) {
          // Doi trang thai yeu cau ve da hoan thanh
          exits = true;
          requestTrungLap = request;
          break;
        }
      }
    }
    console.log("Kết quả kiểm tra yêu cầu trùng lặp:", exits);
    if (exits) {
      console.log(
        "Ton tai yeu cau trung lap, cap nhat trang thai ve da hoan thanh:",
        requestTrungLap._id
      );
      const requestUpdate = await this.Request.findOneAndUpdate(
        {
          _id: requestTrungLap._id,
        },
        {
          $set: { TRANGTHAI: 0 },
        }
      );

      const chiTietService = new ChiTietYeuCauService(MongoDB.client);
      const chiTietList = await chiTietService.find({
        MAYEUCAU: requestTrungLap._id,
      });
      await Promise.all(
        chiTietList.map(async (chiTiet) => {
          const result = await chiTietService.update(chiTiet._id, {
            TRANGTHAI: 0,
          });
        })
      );
      return requestUpdate.value;
    } else {
      console.log("Khong ton tai yeu cau trung lap, tao moi yeu cau");
      // Tao yeu cau moi
      const YeuCauData = {
        MADOCGIA: new ObjectId(data[0].MADOCGIA),
        THOIGIANDAT: new Date(),
        THOIGIANTRA: new Date(data[0].THOIGIANTRA),
        TRANGTHAI: 0,
      };

      // Tao yeu cau
      const request = this.extractRequestData(YeuCauData);
      const resultRequest = await this.Request.insertOne(request);
      const idYeuCau = resultRequest.insertedId;
      // Them chi tiet yeu cau
      await Promise.all(
        data.map(async (item) => {
          const itemData = {
            MAYEUCAU: idYeuCau,
            MASACH: new ObjectId(item.bookDetails._id),
            SOLUONG: item.SOLUONG,
            MAGIOHANG: new ObjectId(item._id),
          };
          const chiTietService = new ChiTietYeuCauService(MongoDB.client);
          const result = await chiTietService.create(itemData);
          return result;
        })
      );
    }
  }

  // Cap nhat yeu cau theo _id yeu cau
  async update(id, data) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const updateData = this.extractRequestData(data);
    const result = await this.Request.findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: "after" }
    );
    return result;
  }

  async getCount() {
    return await this.Request.countDocuments();
  }

  async delete(idYeuCau) {
    const chiTietYeuCauService = new ChiTietYeuCauService(MongoDB.client);

    // Tim danh sach chi tiet yeu cau de xoa
    const chiTietList = await chiTietYeuCauService.find({
      MAYEUCAU: ObjectId.isValid(idYeuCau) ? new ObjectId(idYeuCau) : null,
    });

    // Xoa chi tiet yeu cau
    await Promise.all(
      chiTietList.map(async (chiTiet) => {
        const resultDeleteChiTiet = await chiTietYeuCauService.delete(
          chiTiet._id
        );
      })
    );

    // Xoa yeu cau
    const result = await this.Request.deleteOne({
      _id: ObjectId.isValid(idYeuCau) ? new ObjectId(idYeuCau) : null,
    });
    return result.deletedCount;
  }
}

export default RequestService;
