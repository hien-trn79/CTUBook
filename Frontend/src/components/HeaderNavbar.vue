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
                    name: 'Sự kiện',
                    url: 'event'
                },
                {
                    name: 'Giỏ hàng',
                    url: 'cart'
                },
                {
                    name: 'Đăng nhập',
                    url: 'signIn'
                }
            ],
            activeIndex: 0
        }
    },

    methods: {
        updateIndex(index) {
            this.index = index
        }
    },
}
</script>

<template>
    <nav class="header-navbar">
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