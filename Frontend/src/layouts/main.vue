<script setup>
import HeaderPage from '@/components/HeaderPage.vue';

</script>

<template>
    <div class="page">
        <header class="page-header">
            <HeaderPage></HeaderPage>
        </header>

        <main class="page-main">

        </main>

        <footer class="page-footer">

        </footer>
    </div>
</template>

<style>
/* Config structure page */
.page {
    position: relative;
    display: grid;
    grid-template-areas: 'page-header' 'page-main' 'page-footer';
    grid-template-rows: 120px auto 100px;
    row-gap: 8px;
    min-height: 100vh;
}

.page-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 80px;
    background: #ffffff;
    background: linear-gradient(143deg, rgba(255, 255, 255, 1) 0%, rgba(0, 117, 201, 1) 74%, rgba(0, 74, 158, 1) 100%);
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.08);
    padding: 12px;
    z-index: 10;
    display: flex;
    align-items: center;
}

.page-main {
    margin-top: 80px;
    grid-area: page-main;
}

.page-footer {
    grid-area: page-footer;
}
</style>