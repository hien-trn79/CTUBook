<script>
import HeaderPage from '@/components/admin/HeaderPage.admin.vue';
import BookShowListAdmin from '@/components/admin/BookShowList.admin.vue';
import NavbarAdmin from '@/components/admin/NavbarAdmin.admin.vue';
import Footer from '@/components/Footer.vue';

export default {
    components: {
        NavbarAdmin,
        Footer,
        BookShowListAdmin,
        HeaderPage
    },
    data() {
        return {
            navbarActive: 'Danh sách sách',
        }
    },

    methods: {
    }

}

</script>

<template>
    <header class="page-header">
        <HeaderPage></HeaderPage>
    </header>
    <div class="page">
        <main class="page_admin-main page-main">
            <aside class="page_admin-aside">
                <NavbarAdmin />
            </aside>
            <article class="page_admin-article">
                <router-view></router-view>
            </article>
        </main>

        <footer class="page-footer">
            <Footer></Footer>
        </footer>
    </div>
</template>

<style>
.page_admin-main {
    display: grid;
    grid-template-areas: 'page_admin-aside page_admin-article';
    grid-template-columns: 1fr 4fr;
    column-gap: 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8f0fe 100%);
    width: 98vw;
}

.page_admin-aside {
    background-color: white;
    grid-area: page_admin-aside;
    border-radius: 5px;
    overflow: hidden;
}

.page_admin-article {
    grid-area: page_admin-article;
    padding: 12px;
}
</style>