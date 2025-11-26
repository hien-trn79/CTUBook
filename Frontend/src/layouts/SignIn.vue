<script>
import meService from '@/services/me.service';
export default {
    data() {
        return {
            formData: {
                username: '',
                password: ''
            },
            errors: {
                username: '',
                password: ''
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
        clearError(field) {
            this.errors[field] = '';
        },

        validateForm() {
            // Reset errors
            this.errors = {
                username: '',
                password: ''
            };

            let isValid = true;

            // Validate Username
            if (!this.formData.username.trim()) {
                this.errors.username = 'Vui lòng nhập tên đăng nhập';
                isValid = false;
            } else if (this.formData.username.length < 3) {
                this.errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
                isValid = false;
            }

            // Validate Password
            if (!this.formData.password) {
                this.errors.password = 'Vui lòng nhập mật khẩu';
                isValid = false;
            } else if (this.formData.password.length < 6) {
                this.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
                isValid = false;
            }

            return isValid;
        },

        showNotification(message, type = 'error', options = {}) {
            const duration = options.duration || 3000;
            const redirect = options.redirect || null;

            this.notification.message = message;
            this.notification.type = type;
            this.notification.show = true;
            this.notification.progress = 100;

            // Animate progress bar
            const interval = 30; // Update every 30ms
            const steps = Math.max(1, Math.floor(duration / interval));
            const decrement = 100 / steps;

            let progressInterval = setInterval(() => {
                this.notification.progress = Math.max(0, this.notification.progress - decrement);
                if (this.notification.progress <= 0) {
                    clearInterval(progressInterval);
                    // If redirect requested, navigate after a tiny delay to allow the UI to settle
                    if (redirect) {
                        // small timeout to ensure toast hide animation has time
                        setTimeout(() => this.$router.push(redirect), 150);
                    }
                }
            }, interval);

            // Auto-hide toast after duration
            setTimeout(() => {
                this.notification.show = false;
                this.notification.progress = 100;
                clearInterval(progressInterval);
            }, duration);
        },

        async handleSignIn() {
            // Validate form
            if (!this.validateForm()) {
                const firstError = Object.values(this.errors).find(error => error !== '');
                if (firstError) {
                    this.showNotification(firstError, 'error');
                }
                return;
            }

            try {
                let { token, user } = await meService.getQuery({ username: this.formData.username, password: this.formData.password });
                // Show success toast and redirect when progress finishes
                if (user.LOAITK == 1) {
                    localStorage.setItem('authTokenAdmin', token);
                    localStorage.setItem('currentAdmin', JSON.stringify(user));
                    this.showNotification('Đăng nhập thành công! Chuyển hướng đến trang quản trị...', 'success', { duration: 2000, redirect: '/admin' });
                }
                if (user.LOAITK == 0) {
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.showNotification('Đăng nhập thành công! Chuyển hướng đến trang chủ...', 'success', { duration: 2000, redirect: '/' });
                }
            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
                this.errors.username = 'Tài khoản không tồn tại';
                this.errors.password = 'Mật khẩu không đúng';
                this.showNotification('Tên đăng nhập hoặc mật khẩu không chính xác!', 'error');
                return;
            }
        }
    }
}
</script>

<template>
    <div class="page_signin">
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

        <div class="signIn_area">
            <div class="signIn-header">
                <img src="https://res.cloudinary.com/dw7aqqwti/image/upload/v1758456626/CTUBook/cdpqkf7qwfx9jnozrrjm.png"
                    alt="Logo_Ctubook" class="sign-header_logo">
            </div>
            <div class="signIn-main">
                <h2 class="section--title form--title">Đăng nhập</h2>
                <form @submit.prevent="handleSignIn" id="form-signIn">
                    <div class="form-group">
                        <i class="form-icon fa-solid fa-user" :class="{ 'icon-error': errors.username }"></i>
                        <input type="text" name="username" v-model="formData.username" @input="clearError('username')"
                            placeholder="Tên đăng nhập" :class="['form-control', { 'input-error': errors.username }]">
                        <transition name="error-fade">
                            <span v-if="errors.username" class="error-message">
                                <i class="fa-solid fa-circle-exclamation"></i> {{ errors.username }}
                            </span>
                        </transition>
                    </div>
                    <div class="form-group">
                        <i class="form-icon fa-solid fa-lock" :class="{ 'icon-error': errors.password }"></i>
                        <input type="password" name="password" v-model="formData.password"
                            @input="clearError('password')" placeholder="Mật khẩu"
                            :class="['form-control', { 'input-error': errors.password }]">
                        <transition name="error-fade">
                            <span v-if="errors.password" class="error-message">
                                <i class="fa-solid fa-circle-exclamation"></i> {{ errors.password }}
                            </span>
                        </transition>
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
    width: 100%;
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

/* Error States */
.form-control.input-error {
    border-color: #f44336;
    background-color: #fff5f5;
    animation: shake 0.4s ease;
}

.form-control.input-error:focus {
    border-color: #f44336;
    box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.form-icon.icon-error {
    color: #f44336;
    animation: shake 0.4s ease;
    transform: translateY(-137%);
}

.error-message {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #f44336;
    font-size: 1.3rem;
    margin-top: 6px;
    font-weight: 500;
    padding-left: 10px;
}

.error-message i {
    font-size: 1.4rem;
}

/* Shake Animation */
@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translateX(-5px);
    }

    20%,
    40%,
    60%,
    80% {
        transform: translateX(5px);
    }
}

/* Error Fade Transition */
.error-fade-enter-active {
    transition: all 0.3s ease;
}

.error-fade-leave-active {
    transition: all 0.2s ease;
}

.error-fade-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.error-fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
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