<script>
export default {
    data() {
        return {
            navbar: [
                {
                    name: 'Trang chủ',
                    url: 'home',
                },
                {
                    name: 'Danh sách sách',
                    url: 'books'
                },
                {
                    name: 'Lịch sử',
                    url: 'history'
                },
                {
                    name: 'Giỏ hàng',
                    url: 'cart'
                },
            ],
            activeIndex: 0,
            isScrolled: false,
            currentUser: null,
            showUserMenu: false
        }
    },

    methods: {
        updateIndex(index) {
            this.index = index
        },

        handleScroll() {
            // Khi scroll xuống quá 50px, thêm class 'scrolled'
            this.isScrolled = window.scrollY > 50;
        },

        getCurrentUser() {
            const userData = localStorage.getItem('currentUser');
            if (userData) {
                try {
                    const parsed = JSON.parse(userData);
                    this.currentUser = Array.isArray(parsed) ? parsed[0] : parsed;
                } catch (e) {
                    console.error('Error parsing user data:', e);
                    this.currentUser = null;
                }
            }
        },

        toggleUserMenu() {
            this.showUserMenu = !this.showUserMenu;
        },

        closeUserMenu() {
            this.showUserMenu = false;
        },

        handleLogout() {
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                localStorage.removeItem('currentUser');
                this.currentUser = null;
                this.showUserMenu = false;
                this.$router.push('/');
            }
        },

        handleClickOutside(event) {
            const userMenu = this.$refs.userMenu;
            if (userMenu && !userMenu.contains(event.target)) {
                this.closeUserMenu();
            }
        }
    },

    mounted() {
        // Lắng nghe sự kiện scroll
        window.addEventListener('scroll', this.handleScroll);
        document.addEventListener('click', this.handleClickOutside);
        this.getCurrentUser();
    },

    beforeUnmount() {
        // Xóa event listener khi component bị destroy
        window.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('click', this.handleClickOutside);
    }
}
</script>

<template>
    <nav class="header-navbar" :class="{ 'scrolled': isScrolled }">
        <div class="header_logo">
            <img src="/CTUBook_Logo.png" alt="" class="header_logo-img">
        </div>
        <ul class="navbar_list">
            <li class="navbar_item" v-for="(navbarItem, index) in navbar" :key="index"
                :class="{ active: activeIndex === index }">
                <router-link :to="`/${navbarItem.url}`" class="navbar--link" @click="updateIndex(index)">{{
                    navbarItem.name }}</router-link>
            </li>
            <li class="navbar_item navbar_item--user" v-if="!currentUser">
                <router-link to="/signin" class="navbar--link navbar--link-login">
                    <i class="fa-solid fa-right-to-bracket"></i>
                    <span>Đăng nhập</span>
                </router-link>
            </li>

            <li class="navbar_item navbar_item--user-logged" v-else ref="userMenu">
                <div class="user-profile" @click="toggleUserMenu">
                    <div class="avatar_user">
                        <img :src="currentUser.IMAGE || 'https://res.cloudinary.com/dw7aqqwti/image/upload/v1761294585/UserDefault_vch7wc.jpg'"
                            :alt="currentUser.USERNAME" class="avatar_user-img">
                    </div>
                    <span class="user-name">{{ currentUser.USERNAME }}</span>
                    <i class="fa-solid fa-chevron-down dropdown-icon" :class="{ 'rotated': showUserMenu }"></i>
                </div>

                <!-- Dropdown Menu -->
                <transition name="dropdown">
                    <div class="user-dropdown" v-if="showUserMenu">
                        <div class="user-info">
                            <div class="user-avatar-large">
                                <img :src="currentUser.IMAGE || 'https://res.cloudinary.com/dw7aqqwti/image/upload/v1761294585/UserDefault_vch7wc.jpg'"
                                    :alt="currentUser.USERNAME">
                            </div>
                            <div class="user-details">
                                <p class="user-fullname">{{ currentUser.FULLNAME || currentUser.USERNAME }}</p>
                                <p class="user-email">{{ currentUser.EMAIL }}</p>
                            </div>
                        </div>
                        <div class="dropdown-divider"></div>
                        <ul class="dropdown-menu">
                            <li class="dropdown-item">
                                <router-link to="/user/profile" class="dropdown-link" @click="closeUserMenu">
                                    <i class="fa-solid fa-user"></i>
                                    <span>Thông tin cá nhân</span>
                                </router-link>
                            </li>
                            <li class="dropdown-item">
                                <router-link to="/user/orders" class="dropdown-link" @click="closeUserMenu">
                                    <i class="fa-solid fa-box"></i>
                                    <span>Đơn hàng của tôi</span>
                                </router-link>
                            </li>
                            <li class="dropdown-divider"></li>
                            <li class="dropdown-item">
                                <button class="dropdown-link logout-btn" @click="handleLogout">
                                    <i class="fa-solid fa-right-from-bracket"></i>
                                    <span>Đăng xuất</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </transition>
            </li>
        </ul>
    </nav>

</template>

<style>
@import url(/css/components/headerNavbar.css);
</style>