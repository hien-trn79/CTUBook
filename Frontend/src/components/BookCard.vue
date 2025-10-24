<script>
import bookService from '@/services/book.service';

export default {
    name: 'BookCard',

    props: {
        bookData: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            book: { ...this.bookData }
        }
    },

    methods: {
        async getBook(id) {
            try {
                this.book = await bookService.getId(id);
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        }
    },

    mounted() {
        this.getBook(this.book._id);
    }
}
</script>

<template>
    <div class="book-card" v-if="book">
        <div class="book-card_image-container">
            <img :src="book.IMAGE" alt="Book Cover" class="book-card__image" />
        </div>
        <div class="book-card__info">
            <h3 class="book-card__ten">{{ book.TENSACH }}</h3>
            <p class="book-card__tacgia">{{ book.TACGIA }}</p>
        </div>
        <div class="book-card_click">
            <router-link class="btn book-card--button" :to="`/books/${book._id}`">Xem chi tiết</router-link>
        </div>

    </div>
</template>

<style scoped>
.book-card_image-container {
    width: 33%;
}

.book-card {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 7px;
    width: 100%;
    max-height: 500px;
}

.book-card:hover {
    cursor: pointer;
}

.book-card__image {
    width: 100%;
}

.book-card__info {
    position: relative;
    width: 60%;
    padding: 12px 8px;
}

.book-card__ten {
    font-size: var(--text-font-title2);
    color: var(--text-primary);
    letter-spacing: 0.9px;
    margin-bottom: 32px;
    font-weight: 650;
    width: 100%;
}

.book-card__tacgia {
    font-size: var(--text-font-normal);
    font-weight: 450;
    padding: 0px 0px 8px 12px;
    text-decoration: underline;
    color: #ccc;
}

.book-card_click {
    position: absolute;
    bottom: 10%;
    right: 0;
    margin-top: 24px;
    text-align: right;
}

.book-card--button {
    padding: 12px 24px;
    border-radius: 16px;
    background-color: var(--text-no-active);
    color: var(--text-black);
    font-size: var(--text-font-normal);
}

.book-card--button:active {
    transform: translateY(1px);
}
</style>