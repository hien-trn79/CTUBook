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
                {
                    name: 'Đăng nhập',
                    url: 'signin'  // Sửa từ 'signIn' thành 'signin'
                }
            ],
            activeIndex: 0,
            isScrolled: false
        }
    },

    methods: {
        updateIndex(index) {
            this.index = index
        },

        handleScroll() {
            // Khi scroll xuống quá 50px, thêm class 'scrolled'
            this.isScrolled = window.scrollY > 50;
        }
    },

    mounted() {
        // Lắng nghe sự kiện scroll
        window.addEventListener('scroll', this.handleScroll);
    },

    beforeUnmount() {
        // Xóa event listener khi component bị destroy
        window.removeEventListener('scroll', this.handleScroll);
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
        </ul>
    </nav>

</template>

<style>
@import url(/css/components/headerNavbar.css);
</style>