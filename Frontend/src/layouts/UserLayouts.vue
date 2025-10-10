<script>
import HeaderPage from '@/components/HeaderPage.vue';
import Footer from '@/components/Footer.vue';

export default {
    components: {
        HeaderPage,
        Footer
    },
}

</script>

<template>
    <header class="page-header">
        <HeaderPage></HeaderPage>
    </header>
    <div class="page">

        <main class="page-main container">
            <router-view></router-view>
        </main>

        <footer class="page-footer">
            <Footer></Footer>
        </footer>
    </div>
</template>

<style>
@import url(/css/PageMain.css);
</style>