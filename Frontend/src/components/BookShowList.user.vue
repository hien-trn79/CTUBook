<script>
export default {
    props: {
        books: { type: Array, default: [] },
        activeIndex: { type: Number, default: -1 }
    },

    emits: ["update:activeIndex"],
    methods: {
        updateActiveIndex(index) {
            this.$emit("update:activeIndex", index);
        }
    }
}
</script>

<template>
    <div class="book_list">
        <div class="book_item" v-for="(bookItem, index) in this.books" :key="index">
            <img src="/images/books/bia_sach_DienToanDamMay.png" alt="" class="book_item-img">
            <div class="book_item-main">
                <h3 class="book_name">{{ bookItem.TENSACH }}</h3>
                <div class="book_price"><span class="book_price--number">{{ bookItem.DONGIA }}</span> đ</div>
                <router-link class="btn btn_book--detail" :to="`books/${bookItem._id}`">Xem chi tiết</router-link>
            </div>
        </div>
    </div>
</template>

<style>
.section_page-header {
    width: 100%;
    text-align: center;
    margin-bottom: 16px;
}

.section--icon {
    font-size: var(--text-font-title1);
    color: var(--text-primary);
    font-weight: 600;
}

.book_list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 200px));
    justify-content: space-around;
    column-gap: 12px;
    width: 100%;
}

.book_item {
    padding: 12px;
    border-radius: 5px;
    height: fit-content;
    text-align: center;
}

.book_item-img {
    width: 100%;
    height: 60%;
}

.book_item-main {
    height: 40%;
}

.book_name {
    font-size: var(--text-font-normal);
    padding: 6px 0px;
    font-weight: 400;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
}

.book_price {
    font-size: var(--text-font-normal);
    padding: 8px 0px;
    color: red;
}

.book_price--number {
    font-weight: 700;
    letter-spacing: 0.9px;
    font-size: var(--text-font-title2);
}

.btn_book--detail {
    padding: 8px 12px;
    background-color: var(--background-color-primary);
    border-radius: 7px;
    border: 1px solid rgb(84, 152, 255);
    min-width: 150px;
    margin-top: 12px;
    font-size: 1.3rem;
    margin-top: 12px;
}

.btn_book--detail:hover {
    cursor: pointer;
    transform: scale(1.02);
}

.btn_book--detail:active {
    transform: scale(0.99);
}
</style>