<script>
import bookService from '@/services/book.service';
import meService from '@/services/me.service.js';
import { request, ClassRequest } from '@/enums/book.status.js';
import requestService from '@/services/request.service';
import { getCurrentUser } from '@/utils/auth.util';
import userService from '@/services/user.service';

import { useToast } from 'primevue/usetoast';

export default {
    data() {
        return {
            currentUser: {},
            dataCart: [],
            request,
            ClassRequest,
            Sended: false,
            RemoveRequest: false
        }
    },

    created() {
        this.toast = useToast();
    },

    methods: {
        // Lay tat ca cac sach trong gio hang cua user trong kho GioHang
        async getAllCartItems() {
            let user = getCurrentUser();
            user = await userService.findByUsername(user.id);
            if (user.length > 0) {
                this.currentUser = user[0];
                console.log('Current User:', this.currentUser);
            }
            const idUser = this.currentUser._id;

            try {
                const cartItems = await meService.getMyCart(idUser);
                console.log('Cart Items:', cartItems);

                // Sử dụng Promise.all để đợi tất cả các async operations
                this.dataCart = await Promise.all(
                    cartItems.map(async item => {
                        const bookDetails = await bookService.getId(item.IDSACH);
                        return {
                            ...item,
                            bookDetails: bookDetails,
                        };
                    })
                );

            } catch (error) {
                console.log(error);
            }
        },

        // Thay doi dinh dang ngay thang nam
        changeTypeDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return date.toLocaleDateString('en-GB', options);
        },

        // Tinh tong so luong yeu cau trong gio hang cua user
        totalRequest() {
            return this.dataCart.reduce((total, item) => total + item.SOLUONG, 0);
        },

        // Kiem tra trang thai yeu cau muon sach
        async sendStatus() {
            let user = getCurrentUser();
            user = await userService.findByUsername(user.id);
            if (user.length > 0) {
                this.currentUser = user[0];
            }
            let dataRequest = await meService.getMyCart(this.currentUser._id);
            const result = dataRequest.filter(item => item.TRANGTHAI === 3 || item.TRANGTHAI === 2);
            if (result.length > 0) {
                this.Sended = false;
            } else {
                this.Sended = true;
            }
        },

        // Xu ly nut "Gui yeu cau muon sach"
        async sendRequest() {
            try {
                let dataRequest = this.dataCart.filter(item => item.TRANGTHAI !== 1);

                // Gui yeu cau muon sach
                const result = await requestService.createRequest(dataRequest);
                // Chuyen doi du lieu muon sach trong gio hang
                dataRequest.forEach(async item => {
                    item.TRANGTHAI = 0; // dang cho xac nhan
                    const updateResult = await meService.updateMyCart(item._id, item);
                })
                this.sendStatus();
                this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Gửi yêu cầu mượn sách thành công!', life: 3000 });
            } catch (error) {
                console.log('Lỗi khi xử lý gửi yêu cầu', error);
            }
        },

        // Kiểm tra những giỏ hàng có thể được xóa
        CheckRemove(request) {
            return request === 0 || request === 1;
        },

        // Xu ly nut xoa gio hang
        async RemoveCart(cartItem) {
            try {
                const result = await meService.deleteMyCart(cartItem._id);
                this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa sách khỏi giỏ hàng thành công!', life: 3000 });
                this.getAllCartItems();
            } catch (error) {
                console.log('Lỗi khi xóa sách khỏi giỏ hàng', error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa sách khỏi giỏ hàng. Vui lòng thử lại!', life: 4000 });
            }
        }
    },

    mounted() {
        this.getAllCartItems();
        this.sendStatus();
    }
}
</script>

<template>
    <div class="cart_page mt-24">
        <!-- Empty Cart State -->
        <div v-if="dataCart.length === 0" class="empty-cart">
            <div class="empty-cart-icon">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9 2C9 1.44772 9.44772 1 10 1H14C14.5523 1 15 1.44772 15 2V4H20C20.5523 4 21 4.44772 21 5C21 5.55228 20.5523 6 20 6H19L18 21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21L5 6H4C3.44772 6 3 5.55228 3 5C3 4.44772 3.44772 4 4 4H9V2Z"
                        fill="#e5e7eb" />
                    <path
                        d="M10 9C10 8.44772 10.4477 8 11 8C11.5523 8 12 8.44772 12 9V18C12 18.5523 11.5523 19 11 19C10.4477 19 10 18.5523 10 18V9Z"
                        fill="#9ca3af" />
                    <path
                        d="M14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9V18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18V9Z"
                        fill="#9ca3af" />
                </svg>
            </div>
            <h2 class="empty-cart-title">Giỏ hàng trống</h2>
            <p class="empty-cart-message">Bạn chưa có sách nào trong giỏ hàng.</p>
            <p class="empty-cart-submessage">Hãy khám phá và thêm sách yêu thích vào giỏ hàng của bạn!</p>
            <router-link to="/" class="btn-browse-books">
                <i class="fa-solid fa-book"></i> Khám phá sách
            </router-link>
        </div>

        <!-- Cart with Items -->
        <template v-else>
            <article class="cart-article">
                <table class="cart-table">
                    <thead class="table-head--row">
                        <tr class="table-row">
                            <th class="table-head table_content">
                                Ảnh
                            </th>
                            <th class="table-head table_content">
                                Tên sách
                            </th>
                            <th class="table-head table_content">
                                Tác giả
                            </th>
                            <th class="table-head table_content">
                                Thời gian
                            </th>
                            <th class="table-head table_content">
                                Số lượng
                            </th>
                            <th class="table-head table_content">
                                Đơn giá
                            </th>
                            <th class="table-head table_content">Trạng thái</th>
                            <th class="table-head"></th>
                        </tr>
                    </thead>
                    <tbody class="table-body">
                        <tr class="table-row" v-for="(cartItem, index) in dataCart" :key="index">
                            <td class="table-col">
                                <img :src="cartItem.bookDetails.IMAGE" alt="" class="table-col_img">
                            </td>
                            <td class="table-col table_content">
                                {{ cartItem.bookDetails.TENSACH }}
                            </td>
                            <td class="table-col table_content">
                                {{ cartItem.bookDetails.TACGIA }}
                            </td>
                            <td class="table-col table_content">
                                {{ changeTypeDate(cartItem.THOIGIANDAT) }}: {{ changeTypeDate(cartItem.THOIGIANTRA) }}
                            </td>
                            <td class="table-col table_content">
                                {{ cartItem.SOLUONG }}
                            </td>
                            <td class="table-col table_content book_price">
                                {{ cartItem.bookDetails.DONGIA }}đ
                            </td>
                            <td
                                :class="['table-col', 'table_content', 'book-status', ClassRequest[cartItem.TRANGTHAI]]">
                                {{ request[cartItem.TRANGTHAI] }}
                            </td>
                            <td class="table-col table_content">
                                <button class="btn btn_remove--cart" :disabled="CheckRemove(cartItem.TRANGTHAI)"
                                    @click.prevent="RemoveCart(cartItem)">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </article>

            <aside class="cart-aside">
                <!-- Tinh toan tien gio hang -->
                <div class="cart-summary">
                    <h2 class="cart-summary--title">Tổng kết </h2>
                    <div class="cart-summary--details">
                        <p class="cart-summary--item">
                            <span>Tổng số lượng sách: </span>
                            <span class="book_price cart-summary--total">{{ totalRequest() }}</span> quyển
                        </p>
                    </div>
                </div>

                <div class="cart_button mt-32">
                    <button class="btn btn-checkout--cart" v-if="!Sended" @click.prevent="sendRequest">
                        Gửi yêu cầu mượn sách
                    </button>
                    <button class="btn btn-checkout--cart btn-disabled" v-else>
                        Đã gửi yêu cầu
                    </button>
                </div>
            </aside>
        </template>
    </div>
</template>

<style>
.cart_page {
    display: grid;
    grid-template-areas: 'cart-article cart-aside';
    grid-template-columns: 3fr 1fr;
    column-gap: 24px;
    max-width: 95vw;
}

.cart-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
}

.table-head--row {
    background: linear-gradient(90deg, rgb(30, 115, 236), rgb(20, 95, 206));
}

.table-head {
    padding: 14px 12px;
    color: white;
    font-weight: 600;
    text-align: left;
    font-size: 1.4rem;
    letter-spacing: 0.5px;
}

.table-body .table-row {
    transition: all 0.3s ease;
    border-bottom: 1px solid #e5e7eb;
}

.table-body .table-row:nth-child(odd) {
    background-color: #ffffff;
}

.table-body .table-row:nth-child(even) {
    background-color: #f9fafb;
}

.table-col {
    padding: 12px;
    vertical-align: middle;
}

.table-col_img {
    height: 70px;
    width: 55px;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table_content {
    font-size: var(--text-font-sm);
}

.book_price {
    font-weight: bold;
    color: #dc2626;
    letter-spacing: 0.8px;
    font-size: 1.5rem;
}

.btn_remove--cart {
    background: linear-gradient(90deg, #ef4444, #dc2626);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn_remove--cart:hover {
    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3);
    background: linear-gradient(90deg, #dc2626, #b91c1c);
}

/* -------- Cart Aside ----------- */
.cart-summary--title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 16px;
    color: rgb(8, 74, 174);
}

.cart-summary--item {
    font-size: var(--text-font-normal);
}

.cart-summary--total {
    padding: 0px 8px;
    font-size: 2rem;
}

.cart_button {
    text-align: center;
}

.btn-checkout--cart {
    width: 90%;
    padding: 14px;
    background: linear-gradient(90deg, rgb(30, 115, 236), rgb(20, 95, 206));
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.6rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-disabled {
    background: linear-gradient(90deg, rgba(45, 230, 97, 0.519), rgba(8, 172, 49, 0.596));
    cursor: not-allowed;
}

.btn-disabled:hover {
    transform: none;
    box-shadow: none;
}

/* -------- Empty Cart State ----------- */
.empty-cart {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 40px;
    /* background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%); */
    border-radius: 16px;
    /* box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); */
}

.empty-cart-icon {
    margin-bottom: 24px;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.empty-cart-title {
    font-size: 2.4rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 12px;
}

.empty-cart-message {
    font-size: 1.6rem;
    color: #475569;
    margin-bottom: 8px;
    text-align: center;
}

.empty-cart-submessage {
    font-size: 1.4rem;
    color: #64748b;
    margin-bottom: 32px;
    text-align: center;
}

.btn-browse-books {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    background: linear-gradient(90deg, rgb(30, 115, 236), rgb(20, 95, 206));
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.6rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(30, 115, 236, 0.3);
}

.btn-browse-books:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(30, 115, 236, 0.4);
    background: linear-gradient(90deg, rgb(20, 95, 206), rgb(15, 75, 180));
}

.btn-browse-books i {
    font-size: 1.8rem;
}

.btn_remove--cart:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

.btn_remove--cart:disabled:hover {
    transform: none;
    box-shadow: none;
}
</style>