<script>
import bookService from '@/services/book.service';
import FormInput from '@/components/books/FormInput.vue';
import BrandService from '@/services/brand.service';

export default {
    components: {
        FormInput
    },

    data() {
        return {
            id: '',
            book: null,
            isLoading: false,
            error: null,
            dataForm: [
                {
                    name: 'TENSACH',
                    label: 'Tên sách',
                    type: 'text',
                    placeholder: 'Tên sách'
                },
                {
                    name: 'THELOAI',
                    label: 'Thể loại',
                    type: 'text',
                    placeholder: 'Chọn thể loại'
                },
                {
                    name: 'TACGIA',
                    label: 'Tác giả',
                    type: 'text',
                    placeholder: 'Chọn tác giả'
                },
                {
                    name: 'SOQUYEN',
                    label: 'Số lượng',
                    type: 'number',
                    placeholder: 'Số lượng sách'
                },
                {
                    name: 'TENNXB',
                    label: 'Nhà xuất bản',
                    type: 'text',
                    placeholder: 'Tên nhà xuất bản'
                },
                {
                    name: 'NGONNGU',
                    label: 'Ngôn ngữ',
                    type: 'text',
                    placeholder: 'Chọn ngôn ngữ'
                },
                {
                    name: 'DONGIA',
                    label: 'Đơn giá bán',
                    type: 'number',
                    placeholder: 'Giá bán'
                },
                {
                    name: 'SOTRANG',
                    label: 'Số trang',
                    type: 'number',
                    placeholder: 'Số trang sách'
                },
                {
                    name: 'NAMXUATBAN',
                    label: 'Năm xuất bản',
                    type: 'date',
                    placeholder: 'Chọn năm xuất bản sách'
                }
            ],
        }
    },

    methods: {
        async getBrand(id) {
            let brand = await BrandService.getId(id);
            return await brand;
        },

        async getBookById() {
            try {
                this.isLoading = true;
                this.id = this.$route.params.id;
                this.book = await bookService.getId(this.id);
                this.error = null;
            } catch (error) {
                console.error('Lỗi khi lấy thông tin sách:', error);
                this.error = 'Không thể lấy thông tin sách. Vui lòng thử lại!';
            } finally {
                this.isLoading = false;
            }
        },

        async handleFromData(formData) {
            try {
                this.isLoading = true;
                this.error = null;

                // Chuyển đổi trạng thái sang số
                formData['TRANGTHAI'] = Number(formData['TRANGTHAI']);


                // Gọi API update
                const result = await bookService.update(formData._id, formData);

                // Hiển thị thông báo thành công
                alert('Cập nhật sách thành công!');

                // Chuyển hướng về trang danh sách
                this.$router.push('/admin/books');

            } catch (error) {
                console.error('Lỗi khi cập nhật sách:', error);
                this.error = 'Không thể cập nhật sách. Vui lòng thử lại!';
                alert('Lỗi: Không thể cập nhật sách!');
            } finally {
                this.isLoading = false;
            }
        }
    },

    mounted() {
        this.getBookById();
    },
}
</script>

<template>
    <div class="update_book_page">
        <!-- Loading state -->
        <div v-if="isLoading" class="loading-container">
            <p>Đang tải...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="error-container">
            <p class="error-message">{{ error }}</p>
            <button @click="getBookById" class="btn btn-retry">Thử lại</button>
        </div>

        <!-- Form -->
        <FormInput v-else-if="book" :data-list="dataForm" :book="book" :isSubmitting="isLoading"
            @formData="handleFromData" />
    </div>
</template>

<style scoped>
.update_book_page {
    background-color: white;
    border-radius: 5px;
    padding: 12px;
    min-height: 400px;
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    font-size: 1.6rem;
    color: #666;
}

.error-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    gap: 20px;
}

.error-message {
    font-size: 1.6rem;
    color: #e74c3c;
    text-align: center;
}

.btn-retry {
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.4rem;
}

.btn-retry:hover {
    background-color: #2980b9;
}
</style>