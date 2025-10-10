<script>
import bookService from '@/services/book.service';
import BookDetail_ImgUser from './BookDetail_Img.user.vue';
import BookDetail_InfoUser from './BookDetail_Info.user.vue';

export default {
    components: {
        BookDetail_ImgUser,
        BookDetail_InfoUser
    },

    data() {
        return {
            id: this.$route.params.id,
            book: {}
        }
    },

    methods: {
        async getBooksById() {
            this.book = await bookService.getId(this.id);
        }
    },

    created() {
        this.getBooksById();
    }
}
</script>

<template>
    <article class="book_detail">
        <div class="book_detail-img">
            <BookDetail_ImgUser />
        </div>

        <div class="book_detail--info">
            <BookDetail_InfoUser :book="book" />
        </div>
    </article>
    <div class="section--title section_book--title">Mô tả</div>
    <section class="section_book_detail book_detail--description" v-if="book.MOTA">
        <p class="section_content section_book--description">{{ book.MOTA }}</p>
    </section>
</template>

<style>
.book_detail {
    display: grid;
    grid-template-areas: 'book_detail-img book_detail--info';
    grid-template-columns: 1fr 2fr;
    column-gap: 12px;
    height: fit-content;
    margin: 24px 0px 32px 0px;
}

.book_detail-img {
    grid-area: book_detail-img;
    border-radius: 12px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.09);
}

.book_detail--info {
    grid-area: book_detail--info;
    border-radius: 10px;
}

.section_book_detail {
    padding: 16px;
}

.section_book--title {
    text-align: left;
    padding: 8px 24px;
    width: fit-content;
    border-bottom: 1px solid var(--text-primary);
    font-size: var(--text-font-title2);
}
</style>