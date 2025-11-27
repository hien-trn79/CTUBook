<script>
import meService from '@/services/me.service';
import userService from '@/services/user.service';
import { getCurrentUser } from '@/utils/auth.util.js';

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
            showUserMenu: false,
            total: 0,
            focusInput: false,
            searchText: ''
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

        async getCurrentUser() {
            let user = getCurrentUser();
            user = await userService.findByUsername(user.id);
            if (user.length > 0) {
                this.currentUser = user[0];
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
        },

        async totalRequest() {
            const userLocal = JSON.parse(localStorage.getItem('currentUser'));

            const cartItems = await meService.getMyCart(userLocal._id);
            this.total = cartItems.length;
        },

        isActive(path) {
            const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;
            const currentPath = this.$route.path;

            return currentPath === cleanPath || currentPath.startsWith(cleanPath + "/");
        },

        async totalCart() {
            const userLocal = getCurrentUser();
            const idUser = userLocal.id;
            const cartList = await meService.getMyCart(idUser);
            this.total = cartList.length;
        },
        // Xử lý hiển thị input search
        showInputSearch() {
            this.focusInput = !this.focusInput;
        },

        handlerSeach() {
            if (this.searchText.trim() !== '') {
                this.$router.push({ path: '/books/search', query: { search: this.searchText.trim() } });
                this.searchText = '';
                this.focusInput = false;
            }
        }
    },

    mounted() {
        // Lắng nghe sự kiện scroll
        window.addEventListener('scroll', this.handleScroll);
        document.addEventListener('click', this.handleClickOutside);
        this.getCurrentUser();
        this.totalCart();
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
            <div class="header-search ml-32">
                <i class="fa-solid fa-magnifying-glass icon-search" @click.prevent="showInputSearch"></i>
                <form action="#" class="form-search" @submit.prevent="handlerSeach">
                    <input type="text" name="" id="" class="input-search form-control" placeholder="Search"
                        v-model="searchText" v-if="focusInput">
                </form>
            </div>
        </div>
        <ul class="navbar_list">
            <li class="navbar_item" v-for="(navbarItem, index) in navbar" :key="index"
                :class="{ active: activeIndex === index }">
                <router-link :to="`/${navbarItem.url}`" class="navbar--link" @click="updateIndex(index)"
                    :class="{ active: isActive(`/${navbarItem.url}`) }">{{
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
                                <router-link :to="`/user/${this.currentUser._id}`" class="dropdown-link"
                                    @click="closeUserMenu">
                                    <i class="fa-solid fa-user"></i>
                                    <span>Thông tin cá nhân</span>
                                </router-link>
                            </li>
                            <li class="dropdown-item dropdown-item--cart">
                                <router-link to="/cart" class="dropdown-link" @click="closeUserMenu">
                                    <i class="fa-solid fa-box"></i>
                                    <span>Đơn hàng của tôi</span>
                                    <span class="totalRequest">{{ this.total }}</span>
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

.dropdown-item--cart {
    position: relative;
}

.totalRequest {
    position: absolute;
    top: 2px;
    left: 12px;
    background-color: red;
    color: white;
    font-size: 1rem;
    border-radius: 50%;
    padding: 4px;
}
</style>