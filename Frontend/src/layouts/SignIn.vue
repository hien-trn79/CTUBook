<script>
import userService from '@/services/user.service';
export default {
    data() {
        return {
            formData: {
                username: '',
                password: ''
            },
            notification: {
                show: false,
                message: '',
                type: ''
            }
        }
    },

    methods: {
        showNotification(message, type = 'error') {
            this.notification.message = message;
            this.notification.type = type;
            this.notification.show = true;

            setTimeout(() => {
                this.notification.show = false;
            }, 3000);
        },

        async handleSignIn() {
            if (!this.formData.username || !this.formData.password) {
                this.showNotification('Vui lòng nhập đầy đủ thông tin!', 'error');
                return;
            }

            const user = await userService.findByUsername(this.formData.username);
            if (!user || user.PASSWORD !== this.formData.password) {
                this.showNotification('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
                return;
            }

            this.showNotification('Đăng nhập thành công!', 'success');
        }
    }
}
</script>

<template>
    <div class="page_signin">
        <!-- Toast Notification -->
        <transition name="slide-fade">
            <div v-if="notification.show" :class="['toast-notification', notification.type]">
                <i
                    :class="['toast-icon', notification.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark']"></i>
                <span class="toast-message">{{ notification.message }}</span>
            </div>
        </transition>

        <div class="signIn_area">
            <div class="signIn-header">
                <img src="https://res.cloudinary.com/dw7aqqwti/image/upload/v1758456626/CTUBook/cdpqkf7qwfx9jnozrrjm.png"
                    alt="Logo_Ctubook" class="sign-header_logo">
            </div>
            <div class="signIn-main">
                <h2 class="section--title form--title">Đăng nhập</h2>
                <form @submit.prevent="handleSignIn" id="form-signIn">
                    <div class="form-group">
                        <i class="form-icon fa-solid fa-user"></i>
                        <input type="text" name="username" v-model="formData.username" placeholder="Tên đăng nhập"
                            class="form-control" required>
                    </div>
                    <div class="form-group">
                        <i class="form-icon fa-solid fa-lock"></i>
                        <input type="password" name="password" v-model="formData.password" placeholder="Mật khẩu"
                            class="form-control" required>
                    </div>

                    <div class="form-group button_area">
                        <button type="submit" class="btn btn_signIn">Đăng nhập</button>
                    </div>
                </form>

                <div class="hasAccount">
                    <span class="hasAccount_noti">Bạn chưa có tài khoản? </span>
                    <router-link to="/signup" class="link_signUp">Đăng ký</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page_signin {
    height: 100vh;
    width: 100vw;
    background: url('https://res.cloudinary.com/dw7aqqwti/image/upload/v1760709695/TruongNongNghiep_daxclb.jpg') no-repeat;
    background-size: cover;
    background-position: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.signIn_area {
    width: 450px;
    background: rgb(255, 255, 255);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.signIn-header {
    text-align: center;
    margin-bottom: 30px;
}

.sign-header_logo {
    width: 150px;
    height: auto;
}

.form--title {
    text-align: center;
    color: var(--text-primary);
    margin-bottom: 30px;
    font-size: 2.4rem;
}

.form-group {
    position: relative;
    margin-bottom: 20px;
}

.form-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    font-size: 1.6rem;
}

.form-control {
    width: 85%;
    padding: 12px 12px 12px 45px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1.5rem;
    transition: all 0.3s ease;
}

.form-control:focus {
    outline: none;
    border-color: var(--text-primary);
    box-shadow: 0 0 0 3px rgba(84, 152, 255, 0.1);
}

.button_area {
    margin-top: 30px;
}

.btn_signIn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, var(--text-primary), #5498ff);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.6rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn_signIn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(84, 152, 255, 0.4);
}

.btn_signIn:active {
    transform: translateY(0);
}

.hasAccount {
    text-align: center;
    margin-top: 20px;
    font-size: 1.4rem;
}

.hasAccount_noti {
    color: #666;
}

.link_signUp {
    color: var(--text-primary);
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;
}

.link_signUp:hover {
    color: #5498ff;
    text-decoration: underline;
}

/* Toast Notification Styles */
.toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.5rem;
    font-weight: 500;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    min-width: 300px;
    backdrop-filter: blur(10px);
}

.toast-notification.success {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(56, 142, 60, 0.95));
    color: white;
}

.toast-notification.error {
    background: linear-gradient(135deg, rgba(244, 67, 54, 0.95), rgba(211, 47, 47, 0.95));
    color: white;
}

.toast-icon {
    font-size: 2.4rem;
}

.toast-message {
    flex: 1;
}

/* Slide Fade Transition */
.slide-fade-enter-active {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from {
    transform: translateX(100px);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}
</style>