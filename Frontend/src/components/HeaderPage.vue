<script setup>
import HeaderNavbar from './HeaderNavbar.vue';

</script>

<template>
    <div class="header_logo">
        <img src="/CTUBook_Logo.png" alt="" class="header_logo-img">
    </div>
    <HeaderNavbar></HeaderNavbar>

</template>

<style>
.header_logo {
    width: 120px;
    display: flex;
    align-items: center;
}

.header_logo-img {
    width: 100%;
}
</style>