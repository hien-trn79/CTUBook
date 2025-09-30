<script setup>
import { reactive } from 'vue';


const navbar = reactive([
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
    }
])

</script>

<template>
    <nav class="header-navbar">
        <ul class="navbar_list">
            <li class="navbar_item" v-for="(navbarItem, index) in navbar" :key="index">
                <router-link :to="`/${navbarItem.url}`" class="navbar--link">{{ navbarItem.name }}</router-link>
            </li>
        </ul>
    </nav>

</template>

<style>
@import url(/css/components/headerNavbar.css);
</style>