<script>
import BookShowList from '@/components/BookShowList.user.vue';
import bookService from '@/services/book.service.js';
import NavbarBookList from '@/components/NavbarBookList.vue';
export default {
    components: {
        BookShowList,
        NavbarBookList
    },
    data() {
        return {
            books: [],
            bookfilters: [
                {
                    name: 'Giáo trình',
                    check: false
                },
                {
                    name: 'Công nghệ & kỹ thuật',
                    check: false
                },
                {
                    name: 'Ngôn ngữ',
                    check: false
                },
                {
                    name: 'Thể thao & sức khỏe',
                    check: false
                },
                {
                    name: 'Kỹ năng & văn hóa',
                    check: false
                },
                {
                    name: 'Toán học',
                    check: false
                },
                {
                    name: 'Địa lý',
                    check: false
                },
                {
                    name: 'Thực phẩm & chế biến',
                    check: false
                }
            ],
            booksChoice: [],
            filter: {},
            filterSubmit: []
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
        },
        // xu ly nhung lua chon
        getChoice() {
            const choice = this.bookfilters.filter(item => {
                return item.check === true
            })
            this.booksChoice.push(choice.map(item => item.name))
        },
        handlerSubmit(bookFilter) {
            this.booksChoice = bookFilter.map(item => item.name)
        }

    },

    computed() {
        this.getChoice()
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
            <NavbarBookList :book-filters="bookfilters" @filterSubmit="handlerSubmit" />
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