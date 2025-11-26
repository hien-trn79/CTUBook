<script>
export default {
    data() {
        return {
            navbarVer: [
                {
                    name: 'Tổng quan',
                    url: 'overview',
                    icon: 'fa-solid fa-chart-simple'
                },

                {
                    name: 'Quản lý sách',
                    url: 'books',
                    icon: "fa-solid fa-book"
                },
                {
                    name: 'Quản lý yêu cầu',
                    url: 'request',
                    icon: 'fa-solid fa-message'
                },
                {
                    name: 'Quản lý mượn - trả',
                    url: 'borrow',
                    icon: "fa-solid fa-book-open-reader"
                },
                {
                    name: 'Quản lý tài khoản',
                    url: 'account',
                    icon: 'fa-solid fa-users'
                }
            ],

            activeItem: 0
        }
    },
    methods: {
        handlerNavbar(navbarItem, index) {
            this.$emit('navbarActive', navbarItem)
            this.activeItem = index
        },

        handlerPath(path) {
            let newPath = path.substr(7);
            this.navbarVer.forEach((item, index) => {
                if (item.url === newPath) {
                    this.activeItem = index;
                    return;
                }
            })
        }
    },

    mounted() {
        this.handlerPath(this.$route.path)
    }

}
</script>

<template>
    <nav class="navbar_admin navbar_vertical">
        <h2 class="navbar_admin--title">Quản lý sách</h2>
        <ul class="navbar_vertical--list">
            <li class="navbar_vertical--item" v-for="(navbarItem, index) in navbarVer" :key="index"
                @click="handlerNavbar(navbarItem, index)" :class="{ active: this.activeItem === index }">
                <router-link class="navbar_vertical--link" :to="`/admin/${navbarItem.url}`">
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

.navbar_vertical--item.active {
    background-color: var(--hover-primary);
}

.navbar_vertical--item.active .navbar_vertical--link {
    color: var(--text-primary);
    font-weight: bold;
}
</style>