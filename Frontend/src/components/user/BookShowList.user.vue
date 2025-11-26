<script>
import { animate, stagger } from 'motion';

export default {
    props: {
        books: { type: Array, default: [] },
        activeIndex: { type: Number, default: -1 }
    },

    emits: ["update:activeIndex"],

    methods: {
        updateActiveIndex(index) {
            this.$emit("update:activeIndex", index);
        },

        // Tạo animation cho các book items
        animateBooks() {
            const bookItems = document.querySelectorAll('.book_item');
            if (!bookItems.length) return; // Nếu không có book items thì dừng lại
            // Animate tất cả book items với stagger effect
            animate(
                bookItems,
                {
                    opacity: [0, 1],
                    y: [30, 0],
                    scale: [0.95, 1]
                },
                {
                    duration: 0.3,
                    delay: stagger(0.1),
                    easing: [0.22, 0.03, 0.26, 1] // Easing mượt mà
                }
            );
        },

        handlerImage(bookItem) {
            if (!bookItem.IMAGE) {
                bookItem.IMAGE = '/CTUBook_Logo.png';
            }
            return bookItem.IMAGE
        }
    },

    mounted() {
        // Chạy animation khi component được mount
        this.$nextTick(() => {
            this.animateBooks();
        });
    },

    watch: {
        // Chạy lại animation khi danh sách books thay đổi
        books() {
            this.$nextTick(() => {
                this.animateBooks();
            });
        }
    }
}
</script>

<template>
    <div class="book_list">
        <div class="book_item" v-for="(bookItem, index) in this.books" :key="index">
            <img :src="handlerImage(bookItem)" alt="" class="book_item-img">
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
    background-color: white;
    border-radius: 7px;
}

.book_item {
    padding: 12px;
    border-radius: 10px;
    text-align: center;
    background-color: #fff;
    border: 2px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin: 12px 0px;
    max-height: 400px;
}

/* Hiệu ứng gradient overlay khi hover */
.book_item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(125, 177, 255, 0.1), rgba(123, 205, 255, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.book_item:hover {
    transform: translateY(-10px) scale(1.01);
    box-shadow: 0 12px 24px rgba(114, 170, 255, 0.129);
    border-color: rgba(111, 169, 255, 0.093);
}

.book_item:hover::before {
    opacity: 1;
}

/* .book_item:active {
    transform: translateY(-5px) scale(1);
} */

.book_item-img {
    width: 100%;
    height: 60%;
    border-radius: 8px;
    transition: transform 0.3s ease;
    position: relative;
    z-index: 1;
}

.book_item:hover .book_item-img {
    transform: scale(1.05);
}

.book_item-main {
    height: 40%;
    position: relative;
    z-index: 1;
}

.book_name {
    font-size: var(--text-font-normal);
    padding: 6px 0px;
    font-weight: 400;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease;
}

.book_item:hover .book_name {
    color: rgb(84, 152, 255);
}

.book_price {
    font-size: var(--text-font-normal);
    padding: 8px 0px;
    color: red;
    transition: transform 0.3s ease;
}

.book_item:hover .book_price {
    transform: scale(1.1);
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
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.btn_book--detail::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.btn_book--detail:hover::before {
    width: 300px;
    height: 300px;
}

.btn_book--detail:hover {
    cursor: pointer;
    transform: scale(1.05);
    background-color: rgb(62, 139, 255);
    color: white;
    box-shadow: 0 4px 12px rgb(69, 142, 252);
}

.book_item:hover .btn_book--detail {
    animation: pulse 1s ease-in-out infinite;
}

.btn_book--detail:active {
    transform: scale(0.98);
}

@keyframes pulse {

    0%,
    100% {
        box-shadow: 0 4px 12px rgba(84, 152, 255, 0.186);
    }

    50% {
        box-shadow: 0 6px 16px rgba(84, 152, 255, 0.6);
    }
}
</style>