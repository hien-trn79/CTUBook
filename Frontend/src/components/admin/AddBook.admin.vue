<script>
import bookService from '@/services/book.service';
import FormInput from '@/components/books/FormInput.vue';
export default {
    components: {
        FormInput,
    },

    data() {
        return {
            isLoading: false,
            error: null,
            book: {}, // Khởi tạo book object rỗng cho form thêm mới
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
            book: {},
        }
    },

    methods: {
        handlerFile(file) {
            console.log('File uploaded:', file);
        },

        async handleCreateData(formData) {
            try {
                this.isLoading = true;
                this.error = null;

                // Validate dữ liệu
                if (!formData.TENSACH || !formData.THELOAI || !formData.TACGIA) {
                    throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc!');
                }

                if (!formData.IMAGE) {
                    throw new Error('Vui lòng chọn hình ảnh sách!');
                }

                // Chuyển đổi trạng thái sang số
                formData['TRANGTHAI'] = Number(formData['TRANGTHAI']) || 0;

                // Gọi API create
                const result = await bookService.create(formData);

                console.log('Thêm sách thành công:', result);

                // Hiển thị thông báo thành công
                alert('Thêm sách mới thành công!');

                // Chuyển hướng về trang danh sách
                this.$router.push('/admin/books');

            } catch (error) {
                console.error('Lỗi khi thêm sách:', error);
                this.error = error.message || 'Không thể thêm sách. Vui lòng thử lại!';
                alert(`Lỗi: ${this.error}`);
            } finally {
                this.isLoading = false;
            }
        }
    },
}
</script>

<template>
    <div class="addBook_page">
        <h2 class="section--title addBook--title">Thêm sách mới</h2>

        <!-- Hiển thị thông tin khi đang loading  -->
        <div v-if="isLoading" class="loading-container">
            <p>Đang xử lý...</p>
        </div>

        <!-- Form -->
        <div v-else class="form_page">
            <!-- Error message -->
            <div v-if="error" class="error-message">
                <p>{{ error }}</p>
            </div>

            <FormInput :data-list="dataForm" :book="book" :isSubmitting="isLoading" @file="handlerFile"
                @formData="handleCreateData" />
        </div>
    </div>
</template>

<style scoped>
.addBook_page {
    background-color: white;
    padding: 12px;
    border-radius: 7px;
}

.addBook--title {
    font-weight: bold;
    color: var(--text-black);
    text-align: left;
    font-size: var(--text-font-title2);
    padding-top: 0;
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    font-size: 1.6rem;
    color: #666;
}

.error-message {
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 16px;
    font-size: 1.4rem;
}

.error-message p {
    margin: 0;
}
</style>