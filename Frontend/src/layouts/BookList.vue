<script>
import BookShowList from '@/components/BookShowList.vue';
import bookService from '@/services/book.service.js';
import NavbarBookList from '@/components/NavbarBookList.vue';
export default {
    components: {
        BookShowList,
        NavbarBookList
    },
    data() {
        return {
            books: { type: Array, default: [] },
            bookfilters: [
                {
                    name: 'Giáo trình',
                },
                {
                    name: 'Công nghệ & kỹ thuật',
                },
                {
                    name: 'Ngôn ngữ',
                },
                {
                    name: 'Thể thao & sức khỏe',
                },
                {
                    name: 'Kỹ năng & văn hóa',
                },
                {
                    name: 'Toán học',
                },
                {
                    name: 'Địa lý',
                },
                {
                    name: 'Thực phẩm & chế biến',
                }
            ],
            booksChoice: []
        }
    },

    methods: {
        async getAllBook() {
            try {
                this.books = await bookService.getAll();
            } catch (error) {
                console.log('Co loi trong qua trinh lay danh sach sach!')
                console.log(error);
            }
        }
    },

    mounted() {
        // Lay danh sach sach
        this.getAllBook();
    }
}
</script>

<template>
    <h1 class="section--title">Tất cả các sách</h1>
    <div class="bookList">
        <aside class="bookList-aside_navbar">
            <NavbarBookList :book-filters="bookfilters" />
        </aside>

        <article class="bookList-article_main">
            <div class="books_choice" v-if="booksChoice.length > 0">
                <p class="section_content">Sắp xếp theo: {{ booksChoice.join(', ') }}</p>
            </div>
            <BookShowList :books="this.books" />
        </article>
    </div>
</template>

<style scoped>
@import url(/css/layouts/BookList.css);
</style>