import { ObjectId } from "mongodb";

class CartService {
  constructor(client) {
    this.Cart = client.db().collection("GioHang");
  }

  extractCartData(payload) {
    const cart = {
      IDSACH: payload.IDSACH,
      THOIGIANDAT: payload.THOIGIANDAT,
      THOIGIANTRA: payload.THOIGIANTRA,
      SOLUONG: payload.SOLUONG,
      TRANGTHAI: payload.TRANGTHAI,
      MADOCGIA: payload.MADOCGIA,
    };

    Object.keys(cart).forEach((key) => {
      cart[key] == undefined && delete cart[key];
    });

    return cart;
  }

  find(filter) {
    const cursor = this.Cart.find(filter);
    return cursor.toArray();
  }

  async create(data) {
    const maDocGia = new ObjectId(data.MADOCGIA);
    const idSach = new ObjectId(data.book._id);
    const THOIGIANDAT = new Date();
    const THOIGIANTRA = new Date(THOIGIANDAT);
    THOIGIANTRA.setDate(THOIGIANDAT.getDate() + 15);
    const SOLUONG = 1;
    const TRANGTHAI = 3; // 3 - chua gui yeu cau,
    const createCart = this.extractCartData({
      MADOCGIA: maDocGia,
      IDSACH: idSach,
      THOIGIANDAT: THOIGIANDAT,
      THOIGIANTRA: THOIGIANTRA,
      SOLUONG: SOLUONG,
      TRANGTHAI: TRANGTHAI,
    });

    console.log("Giỏ hàng được tạo:", createCart);
    const result = await this.Cart.insertOne(createCart);
    return result;
  }

  async updateByIdCart(idCart, data) {
    console.log("Cập nhật giỏ hàng với id:", idCart);
    const idSach = new ObjectId(data.IDSACH);
    const THOIGIANDAT = new Date(data.THOIGIANDAT);
    const THOIGIANTRA = new Date(data.THOIGIANTRA);
    const SOLUONG = data.SOLUONG;
    const TRANGTHAI = data.TRANGTHAI;
    const MADOCGIA = new ObjectId(data.MADOCGIA);
    const filter = {
      _id: ObjectId.isValid(idCart) ? new ObjectId(idCart) : null,
    };

    const updateData = this.extractCartData({
      IDSACH: idSach,
      THOIGIANDAT: THOIGIANDAT,
      THOIGIANTRA: THOIGIANTRA,
      SOLUONG: SOLUONG,
      TRANGTHAI: TRANGTHAI,
      MADOCGIA: MADOCGIA,
    });

    let result = await this.Cart.findOneAndUpdate(
      filter,
      {
        $set: updateData,
      },
      { returnDocument: "after" }
    );
    return result;
  }

  async deleteByIdCart(idCart) {
    const result = await this.Cart.deleteOne({
      _id: ObjectId.isValid(idCart) ? new ObjectId(idCart) : null,
    });
    return result;
  }
}

export default CartService;
