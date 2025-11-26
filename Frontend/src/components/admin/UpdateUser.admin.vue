<script>
import userService from '@/services/user.service';
import { useToast } from 'primevue/usetoast';

export default {
    data() {
        return {
            currentUser: {},
            userForm: [
                {
                    name: 'USERNAME',
                    label: 'Tên đăng nhập',
                    type: 'text',
                    placeholder: 'Tên đăng nhập',
                    disabled: true
                },
                {
                    name: 'HOVATEN',
                    label: 'Họ và tên',
                    type: 'text',
                    placeholder: 'Họ và tên của anh/chị',
                },
                {
                    name: 'EMAIL',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'Email cá nhân',
                },
                {
                    name: 'DIENTHOAI',
                    label: 'Số điện thoại',
                    type: 'tel',
                    placeholder: 'Số điện thoại',
                },
                {
                    name: 'DIACHI',
                    label: 'Địa chỉ',
                    type: 'text',
                    placeholder: 'Địa chỉ hiện tại',
                },
                {
                    name: 'NGAYSINH',
                    label: 'Ngày sinh',
                    type: 'date',
                    placeholder: 'Ngày sinh',
                },
            ],
            previewUrl: '',
            file: null,
            isSubmitting: false
        }
    },

    created() {
        this.toast = useToast();
    },

    methods: {
        async getCurrentUser() {
            try {
                const idUser = this.$route.params.id;
                const user = await userService.findByUsername(idUser);
                if (user && user.length > 0) {
                    this.currentUser = { ...user[0] };
                    // Format date for input
                    if (this.currentUser.NGAYSINH) {
                        const date = new Date(this.currentUser.NGAYSINH);
                        this.currentUser.NGAYSINH = date.toISOString().split('T')[0];
                    }
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải thông tin người dùng. Vui lòng thử lại!', life: 4000 });
            }
        },

        uploadImage() {
            this.$refs.myUpload.click();
        },

        handlerUpload(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    this.toast.add({ severity: 'warn', summary: 'Lỗi', detail: 'Vui lòng chọn file ảnh hợp lệ!', life: 4000 });
                }
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    this.toast.add({ severity: 'warn', summary: 'Lỗi', detail: 'Kích thước file không được vượt quá 5MB!', life: 4000 });
                    return;
                }
                this.file = file;
                this.previewUrl = URL.createObjectURL(file);
            }
        },

        async submitForm() {
            if (this.isSubmitting) return;

            try {
                this.isSubmitting = true;
                const formData = new FormData();

                // Append all user fields
                Object.keys(this.currentUser).forEach(key => {
                    if (key !== 'IMAGE' && this.currentUser[key] !== null && this.currentUser[key] !== undefined) {
                        formData.append(key, this.currentUser[key]);
                    }
                });

                // Append image file if changed
                if (this.file) {
                    formData.append('IMAGE', this.file);
                }

                console.log('Sending update request with user ID:', this.currentUser._id);
                const result = await userService.update(this.currentUser._id, formData);

                if (result && result.data) {
                    // Update localStorage with the returned user data
                    this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thông tin cá nhân thành công!', life: 3000 });
                    this.$router.push('/admin/' + this.currentUser._id + '/updateAdmin');
                } else {
                    throw new Error('Update failed - no data returned');
                }
            } catch (error) {
                console.error('Error updating user:', error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thông tin thất bại! Vui lòng thử lại.', life: 4000 });
                this.isSubmitting = false;
            }
        },

        cancelForm() {
            if (confirm('Bạn có chắc muốn hủy bỏ các thay đổi?')) {
                this.$router.go(-1);
            }
        }
    },

    mounted() {
        this.getCurrentUser();
    }
}

</script>

<template>
    <div class="updateUser_page">
        <h2 class="section--title updateUser--title">Cập nhật thông tin cá nhân</h2>
        <form action="#" id="form-updateUser">
            <div class="form-group form_avatar">
                <input type="file" name="uploadFile" id="uploadFile" class="input-file" accept="image/*" :hidden="true"
                    ref="myUpload" @change="handlerUpload">
                <img :src="previewUrl || currentUser.IMAGE || 'https://res.cloudinary.com/dw7aqqwti/image/upload/v1761294585/UserDefault_vch7wc.jpg'"
                    alt="Avatar" class="user_avatar">
                <button class="btn upload-btn_file mt-12 bg-submit" @click.prevent="uploadImage">
                    <i class="fa-solid fa-camera"></i> Thay đổi ảnh
                </button>
            </div>

            <div class="form-group" v-for="(user, index) in userForm" :key="index">
                <label :for="user.name" class="form-label">{{ user.label }}</label>
                <input :type="user.type" :placeholder="user.placeholder" :disabled="user.disabled" :id="user.name"
                    class="form-control" v-model="currentUser[user.name]" />
            </div>

            <div class="form-group">
                <label for="PHAI" class="form-label">Phái</label>
                <div class="form-group_radio">
                    <input type="radio" name="PHAI" id="nam" value="Nam" class="form-radio" v-model="currentUser.PHAI">
                    <label for="nam" class="form-label_radio">Nam</label>
                    <input type="radio" name="PHAI" id="nu" value="Nữ" class="form-radio" v-model="currentUser.PHAI">
                    <label for="nu" class="form-label_radio">Nữ</label>
                </div>
            </div>

            <div class="form-button mt-24">
                <button class="btn btn-save bg-submit" @click.prevent="submitForm" :disabled="isSubmitting">
                    <i class="fa-solid fa-floppy-disk"></i> {{ isSubmitting ? 'Đang lưu...' : 'Lưu thông tin' }}
                </button>
                <button class="btn btn-cancel bg-cancel" @click.prevent="cancelForm" :disabled="isSubmitting">
                    <i class="fa-solid fa-xmark"></i> Hủy bỏ
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.updateUser_page {
    min-width: 60vw;
    margin: auto;
    background-color: white;
    padding: 12px;
    border-radius: 10px;
}

.updateUser--title {
    font-size: 2rem;
    font-weight: 600;
    color: rgb(3, 43, 174);
    letter-spacing: normal;
    padding: 8px;
    border-bottom: 1px solid rgb(3, 43, 174);
    text-align: left;
    width: fit-content;
    margin-bottom: 24px;
}

.form-group {
    display: flex;
    margin-bottom: 16px;
}

.form-group_radio {
    display: flex;
    align-items: center;
    gap: 12px;
}

.form_avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 32px;
}

.user_avatar {
    height: 140px;
    width: 140px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 4px solid #fff;
    transition: transform 0.3s ease;
}

.user_avatar:hover {
    transform: scale(1.05);
}

.form-label {
    width: 25%;
    font-size: var(--text-font-normal);
}

.form-radio {
    height: 1.6rem;
    width: 1.6rem;
}

.form-label_radio {
    font-size: 1.4rem;
    padding: 0px 8px;
}

.form-control {
    width: 75%;
    font-size: var(--text-font-normal);
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.form-control:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form-control:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
}

.form-button {
    text-align: right;
}

.btn {
    margin-right: 8px;
    margin-left: 8px;
    font-size: 1.4rem;
    padding: 10px 20px;
    min-width: 140px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-save:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 102, 204, 0.3);
}

.btn-cancel:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3);
}

.upload-btn_file {
    background: linear-gradient(90deg, #0066cc, #004fa3);
    color: white;
    transition: all 0.3s ease;
}

.upload-btn_file:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 102, 204, 0.3);
}
</style>