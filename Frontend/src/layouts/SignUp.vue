<script>
import userService from '@/services/user.service';

export default {
    data() {
        return {
            formData: {
                USERNAME: '',
                EMAIL: '',
                PASSWORD: '',
                CONFIRM_PASSWORD: ''
            },
            notification: {
                show: false,
                message: '',
                type: '',
                progress: 100
            }
        }
    },

    methods: {
        showNotification(message, type = 'error') {
            this.notification.message = message;
            this.notification.type = type;
            this.notification.show = true;
            this.notification.progress = 100;

            // Animate progress bar
            const duration = 3000; // 3 seconds
            const interval = 30; // Update every 30ms
            const steps = duration / interval;
            const decrement = 100 / steps;

            const progressInterval = setInterval(() => {
                this.notification.progress -= decrement;
                if (this.notification.progress <= 0) {
                    clearInterval(progressInterval);
                }
            }, interval);

            setTimeout(() => {
                this.notification.show = false;
                this.notification.progress = 100;
            }, duration);
        },

        async handleSignUp() {
            // Validate
            if (this.formData.PASSWORD !== this.formData.CONFIRM_PASSWORD) {
                this.showNotification('Mật khẩu xác nhận không khớp!', 'error');
                return;
            }

            // TODO: Call API đăng ký
            try {
                this.formData['LOAITK'] = 0; // Mặc định là tài khoản người dùng
                this.formData['IMAGE'] = 'https://res.cloudinary.com/dw7aqqwti/image/upload/v1761294585/UserDefault_vch7wc.jpg';
                const result = await userService.create(this.formData);
                this.showNotification('Đăng ký thành công! Đang chuyển hướng...', 'success');
            } catch (error) {
                this.showNotification('Email hoặc Username của bạn đã được sử dụng!', 'error');
                return;
            }

            setTimeout(() => {
                this.$router.push('/signin');
            }, 3000)
        },
    }
}
</script>

<template>
    <div class="page_signup">
        <!-- Toast Notification -->
        <transition name="slide-fade">
            <div v-if="notification.show" :class="['toast-notification', notification.type]">
                <div class="toast-content">
                    <i
                        :class="['toast-icon', notification.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark']"></i>
                    <span class="toast-message">{{ notification.message }}</span>
                </div>
                <div class="toast-progress">
                    <div class="toast-progress-bar" :style="{ width: notification.progress + '%' }"></div>
                </div>
            </div>
        </transition>

        <div class="signUp_area">
            <div class="signUp-header">
                <img src="https://res.cloudinary.com/dw7aqqwti/image/upload/v1758456626/CTUBook/cdpqkf7qwfx9jnozrrjm.png"
                    alt="Logo_Ctubook" class="sign-header_logo">
            </div>
            <div class="signUp-main">
                <h2 class="section--title form--title">Đăng ký tài khoản</h2>
                <form @submit.prevent="handleSignUp" id="form-signUp"
                    :action="`?username=${formData.USERNAME}&email=${formData.EMAIL}`">
                    <div class="form-group">
                        <i class="form-icon fa-solid fa-user"></i>
                        <input type="text" name="USERNAME" v-model="formData.USERNAME" placeholder="Tên đăng nhập"
                            class="form-control" required>
                    </div>
                    <div class="form-group">
                        <i class="form-icon fa-solid fa-envelope"></i>
                        <input type="email" name="EMAIL" v-model="formData.EMAIL" placeholder="Email"
                            class="form-control" required>
                    </div>
                    <div class="form-group">
                        <i class="form-icon fa-solid fa-lock"></i>
                        <input type="password" name="PASSWORD" v-model="formData.PASSWORD" placeholder="Mật khẩu"
                            class="form-control" required>
                    </div>
                    <div class="form-group">
                        <i class="form-icon fa-solid fa-lock"></i>
                        <input type="password" name="COMFIRMPASSWORD" v-model="formData.CONFIRM_PASSWORD"
                            placeholder="Xác nhận mật khẩu" class="form-control" required>
                    </div>

                    <div class="form-group button_area">
                        <button type="submit" class="btn btn_signUp" @click.prevent="handleSignUp">Đăng ký</button>
                    </div>
                </form>

                <div class="hasAccount">
                    <span class="hasAccount_noti">Đã có tài khoản? </span>
                    <router-link to="/signin" class="link_signIn">Đăng nhập</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page_signup {
    height: 100vh;
    width: 100vw;
    background: url('https://res.cloudinary.com/dw7aqqwti/image/upload/v1760709695/TruongNongNghiep_daxclb.jpg') no-repeat;
    background-size: cover;
    background-position: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.signUp_area {
    width: 450px;
    background: rgb(255, 255, 255);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.signUp-header {
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

.form-control:focus .form-icon {
    color: var(--text-primary);
}

.button_area {
    margin-top: 30px;
}

.btn_signUp {
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

.btn_signUp:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(84, 152, 255, 0.4);
}

.btn_signUp:active {
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

.link_signIn {
    color: var(--text-primary);
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
}

.link_signIn:hover {
    text-decoration: underline;
    color: #5498ff;
}

/* Toast Notification Styles */
.toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    min-width: 300px;
    backdrop-filter: blur(10px);
    overflow: hidden;
}

.toast-content {
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.5rem;
    font-weight: 500;
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

/* Progress Bar */
.toast-progress {
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    width: 100%;
}

.toast-progress-bar {
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    transition: width 0.03s linear;
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
