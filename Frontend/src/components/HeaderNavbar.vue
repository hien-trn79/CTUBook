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
                <a :href="`${navbarItem.url}`" class="navbar--link">{{ navbarItem.name }}</a>
            </li>
        </ul>
    </nav>

</template>

<style>
.header-navbar {
    margin-left: 32px;
    flex: 1;
}

.navbar_list {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.navbar_item {
    padding: 6px 16px;
    border-radius: var(--border-radius-button);
    margin: 0px 8px;
}

.navbar--link {
    display: block;
    font-size: 1.8rem;
    color: rgb(110, 172, 249);
    text-transform: uppercase;
    text-shadow: 3px 3px 3px rgba(0, 0, 0, 0.08);
    font-weight: var(--text-bold-title);
}

.navbar_item:hover .navbar--link {
    color: var(--text-white);
}

.navbar_item:hover {
    cursor: pointer;
}

.navbar_item.active {
    border-bottom: 1px solid var(--text-white);
}

.navbar_item.active .navbar--link {
    color: var(--text-white);
}
</style>