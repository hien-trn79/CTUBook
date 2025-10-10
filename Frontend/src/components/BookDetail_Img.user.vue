<script>
export default {
    props: {
        book: { type: Object }
    },

    data() {
        return {

        }
    }

}
</script>

<template>
    <div class="img_area">
        <img src="/images/books/bia_sach_DienToanDamMay.png" alt="" class="detail-img">
    </div>
</template>
<style scoped>
.img_area {
    display: flex;
    justify-content: center;
    padding: 24px;

}

.detail-img {
    width: 200px;
    height: 50%;
}
</style>