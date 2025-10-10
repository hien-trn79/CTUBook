<script>
export default {

    data() {
        return {
            navbarVer: [
                {
                    name: 'Quản lý sách',
                    url: 'book-manage',
                    icon: "fa-solid fa-book"
                },
                {
                    name: 'Quản lý tồn kho',
                    url: 'book-retain',
                    icon: 'fa-solid fa-warehouse'
                },
                {
                    name: 'Quản lý mượn - trả',
                    url: 'book-borrow',
                    icon: "fa-solid fa-book-open-reader"
                },
                {
                    name: 'Quản lý tài khoản',
                    url: 'account-manage',
                    icon: 'fa-solid fa-users'
                }
            ]
        }
    },
    methods: {
        handlerNavbar(navbarItem) {
            this.$emit('navbarActive', navbarItem)
        }
    }
}
</script>

<template>
    <nav class="navbar_admin navbar_vertical">
        <h2 class="navbar_admin--title">Quản lý sách</h2>
        <ul class="navbar_vertical--list">
            <li class="navbar_vertical--item" v-for="(navbarItem, index) in navbarVer" :key="index"
                @click="handlerNavbar(navbarItem)">
                <router-link class="navbar_vertical--link" to="#">
                    <i :class="[navbarItem.icon, 'navbar_vertical--icon']"></i>
                    {{ navbarItem.name }}
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<style>
.navbar_admin {
    border-radius: 5px;
    border: 1px solid #ccc;
    overflow: hidden;
    height: fit-content;
}

.navbar_admin--title {
    font-size: var(--text-font-title2);
    color: white;
    padding: 8px 16px;
    background-color: var(--text-primary);
}

.navbar_vertical--list {
    padding: 0px 12px;
}

.navbar_vertical--item {
    padding: 12px 12px;
    border-bottom: 1px solid #bcbcbc;
}

.navbar_vertical--item:hover {
    background-color: #f9f9f9;
    cursor: pointer;
}

.navbar_vertical--link {
    display: block;
    font-size: var(--text-font-normal);
}
</style>