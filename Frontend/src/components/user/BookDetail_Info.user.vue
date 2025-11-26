<script>
import meService from '@/services/me.service.js';
import userService from '@/services/user.service';
import { getCurrentUser } from '@/utils/auth.util';

import { useToast } from 'primevue/usetoast';

export default {
    props: ['book'],

    data() {
        return {
            cartItem: {}
        };
    },

    created() {
        this.toast = useToast();
    },

    methods: {
        async addToCart(book) {
            try {
                let user = getCurrentUser();
                user = await userService.findByUsername(user.id);
                if (user.length > 0) {
                    user = user[0];
                    console.log('Current User in addToCart:', user);
                }
                if (!user || user.length === 0) {
                    this.toast.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng đăng nhập để thêm vào giỏ hàng.', life: 3000 });
                    return;
                }
                let data = {
                    MADOCGIA: user._id,
                    book: book
                }
                const result = await meService.create(data);
                this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm vào giỏ hàng thành công!', life: 3000 });
            } catch (error) {
                console.log('Lỗi khi thêm vào giỏ hàng', error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể thêm vào giỏ hàng. Vui lòng thử lại!', life: 4000 });
            }
        }
    }
}
</script>

<template>
    <div class="detail_info">
        <h2 class="detail_info--name">{{ book.TENSACH }}</h2>
        <div class="detail_info-main">
            <div class="detail_content">
                <label for="detail_value" class="detail-label">Nhà xuất bản</label>
                <p class="detail_value">{{ book.TENNXB }}</p>
            </div>
            <div class="detail_content">
                <label for="detail_value" class="detail-label">Tác giả</label>
                <p class="detail_value">{{ book.TACGIA }}</p>
            </div>
            <div class="detail_content">
                <label for="detail_value" class="detail-label">Ngôn ngữ</label>
                <p class="detail_value">{{ book.NGONNGU }}</p>
            </div>
            <div class="detail_content">
                <label for="detail_value" class="detail-label">Năm xuất bản</label>
                <p class="detail_value">{{ book.NAMXUATBAN }}</p>
            </div>
            <div class="detail_content">
                <label for="detail_value" class="detail-label">Số trang</label>
                <p class="detail_value">{{ book.SOTRANG }}</p>
            </div>
            <div class="detail_content">
                <label for="detail_value" class="detail-label">Giá bán</label>
                <p class="detail_value detail_price">{{ book.DONGIA }} đ</p>
            </div>

            <div class="detail-button">
                <button class="btn btn_detail btn_card" @click.prevent="addToCart(book)">
                    <i class="fa-solid fa-cart-shopping detail_icon"></i>
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.detail_info {
    padding: 12px;
}

.detail_info--name {
    font-size: 2.4rem;
    font-weight: 600;
    padding-bottom: 16px;
}

.detail_content {
    display: flex;
    width: 100%;
    padding: 8px 12px;
}

.detail-label {
    width: 40%;
    font-size: var(--text-font-normal);
    font-weight: 550;
}

.detail_value {
    width: 60%;
    font-size: var(--text-font-normal);
}

.detail_price {
    font-weight: 600;
    color: red;
}

.detail-button {
    display: flex;
    align-items: center;
    margin-top: 32px;
}

.detail--icon {
    margin-right: 8px;
}

.btn_detail {
    font-size: var(--text-font-normal);
    padding: 12px 16px;
    border-radius: 7px;
    background-color: white;
    margin: 0px 16px;
    min-width: 200px;
}

.btn_card {
    border: 2px solid var(--text-no-active);
}

.btn_borrow {
    background-color: var(--text-no-active);
    color: var(--text-primary);
    border: 1px solid var(--text-primary);
}
</style>