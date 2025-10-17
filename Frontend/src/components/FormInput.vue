<script>
import bookService from '@/services/book.service';
import UploadImage from './UploadImage.vue';
import brandService from '@/services/brand.service';
import { bookLabel, bookStatus } from '@/enums/book.status';

export default {
    components: {
        UploadImage
    },

    props: {
        dataList: { type: Array, default: () => [] },
        book: { type: Object, default: () => ({}) },
        isSubmitting: { type: Boolean, default: false }
    },

    data() {
        return {
            file: {},
            formData: {},
            bookLabel,
            bookStatus
        }
    },

    methods: {
        handlerFile(file) {
            this.$emit('file', file);
            this.file = file;
        },

        validateForm() {
            // Kiểm tra các trường bắt buộc
            if (!this.formData.TENSACH || this.formData.TENSACH.trim() === '') {
                alert('Vui lòng nhập tên sách!');
                return false;
            }

            if (!this.formData.THELOAI || this.formData.THELOAI.trim() === '') {
                alert('Vui lòng nhập thể loại!');
                return false;
            }

            if (!this.formData.TACGIA || this.formData.TACGIA.trim() === '') {
                alert('Vui lòng nhập tác giả!');
                return false;
            }

            // Kiểm tra số lượng
            if (this.formData.SOQUYEN && this.formData.SOQUYEN < 0) {
                alert('Số lượng sách phải lớn hơn hoặc bằng 0!');
                return false;
            }

            // Kiểm tra đơn giá
            if (this.formData.DONGIA && this.formData.DONGIA < 0) {
                alert('Đơn giá phải lớn hơn hoặc bằng 0!');
                return false;
            }

            // Kiểm tra file hình ảnh (chỉ khi thêm mới)
            if (!this.book._id && (!this.file || !this.file.name)) {
                alert('Vui lòng chọn hình ảnh sách!');
                return false;
            }

            return true;
        },

        async handleSubmit() {
            // Validate trước khi submit
            if (!this.validateForm()) {
                return;
            }

            // Thêm file vào formData
            this.formData['IMAGE'] = this.file;

            // Emit formData
            this.$emit('formData', this.formData);
            console.log('Form Data Submitted:', this.formData);
        },
    },

    mounted() {
        this.formData = { ...this.book }

    }
}
</script>

<template>
    <form action="#" id="form">
        <div class="form-header">
            <UploadImage @file="handlerFile" v-if="this.book" :image="this.book.IMAGE" />
        </div>
        <div class="form-main">
            <div class="form-group" v-for="(formGroup, index) in this.dataList" :key="index">
                <label :for="formGroup.name" class="form-label">{{ formGroup.label }}</label>
                <input :type="formGroup.type" :name="formGroup.name" :id="formGroup.name" class="form-control"
                    :placeholder="formGroup.placeholder" v-model="formData[formGroup.name]">
            </div>
            <div class="form-select_area form-group ">
                <select name="TRANGTHAI" id="TRANGTHAI" class="form-select form-control"
                    v-model="this.formData.TRANGTHAI">
                    <option :value="bookStatusItem" class="select_option"
                        v-for="(bookStatusItem, index) in this.bookStatus" :key="index">{{ bookLabel[bookStatusItem]
                        }}
                    </option>
                </select>
            </div>
            <div class="form-group form-textarea_group">
                <label for="MOTA" class="form-label">Mô tả</label>
                <textarea name="MOTA" id="MOTA" class="form-control form-textarea" v-model="formData.MOTA"></textarea>
            </div>
        </div>
        <div class="button_area">
            <button class="btn btn-save" @click.prevent="handleSubmit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Đang lưu...' : 'Lưu' }}
            </button>
            <button class="btn btn-cancel" type="button" :disabled="isSubmitting">Hủy</button>
        </div>
    </form>
</template>

<style scoped>
.form-group {
    display: inline-block;
    margin: 12px;
    width: 45%;
}

.form-textarea_group {
    display: block;
    width: 100%;
}

.form-select.form-control {
    height: 39.6px;
}

.form-label {
    font-size: var(--text-font-normal);
}

.form-control {
    min-width: 95%;
    height: 2.2rem;
    font-size: var(--text-font-sm);
}

.form-textarea {
    min-height: 120px;
}

.btn {
    min-width: 120px;
    margin-right: 16px;
    font-size: var(--text-font-normal);
    padding: 8px 12px;
}

.button_area {
    padding: 10px;
    margin-top: 32px;
    text-align: right;
}

.btn-save {
    color: white;
    background-color: var(--color-ctu);
}

.btn-cancel {
    color: white;
    background-color: red;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>