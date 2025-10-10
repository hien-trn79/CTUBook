<script>
import HeaderPage from '@/components/HeaderPage.vue';
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
            navbarActive: 'Danh sách sách'
        }
    },

    methods: {
        handlerActive() {
            this.navbarActive = event.target.textContent;
        }
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
                <NavbarAdmin @navbarActive="handlerActive" />
            </aside>
            <article class="page_admin-article">
                <BookShowListAdmin :choice-side-bar="this.navbarActive" />
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