<script>
import BookShowList from '@/components/user/BookShowList.user.vue';
import bookService from '@/services/book.service.js';
import NavbarBookList from '@/components/books/NavbarBookList.vue';
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
                    name: 'Lịch sử & địa lý',
                    check: false
                },
                {
                    name: 'Công nghệ sinh học & thực phẩm',
                    check: false
                },
                {
                    name: 'Thủy sản',
                    check: false
                },
                {
                    name: 'Khoa học nghiên cứu',
                    check: false
                },
                {
                    name: 'Môi trường',
                    check: false
                },
                {
                    name: 'Máy tính & phần mềm',
                    check: false
                }
            ],
            booksChoice: [],
            filter: {},
            filterSubmit: [],
            searchText: ''
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
            this.filterSubmit = bookFilter.map(item => item.name);
        },

        async handleSearch() {
            const keyword = this.$route.query.search || '';
            if (keyword) {
                try {
                    const results = await bookService.getQuery({ search: keyword });
                    this.books = results;
                } catch (error) {
                    console.log('Co loi trong qua trinh tim kiem sach!')
                    console.log(error);
                }
            }
        }
    },

    created() {
        this.handleSearch();
    },

    watch: {
        '$route.query.search': 'handleSearch'
    },

    computed: {
        filteredBooks() {
            if (this.filterSubmit.length === 0) {
                return this.books;
            }

            // Tính điểm trùng (matchCount) cho mỗi sách
            const scoredBooks = this.books.map(book => {
                const genres = Array.isArray(book.THELOAI)
                    ? book.THELOAI
                    : Object.values(book.THELOAI);

                const matchCount = genres.filter(genre => this.filterSubmit.includes(genre)).length;

                return {
                    ...book,
                    matchCount
                };
            });

            // Tìm số lượng trùng cao nhất
            const maxMatch = Math.max(...scoredBooks.map(b => b.matchCount));

            // Lọc ra tất cả sách có matchCount = maxMatch (và phải có ít nhất 1 trùng)
            return scoredBooks.filter(b => b.matchCount === maxMatch && b.matchCount > 0);
        }
    },

    mounted() {
        // Lay danh sach sach
        this.getAllBook();
        this.handleSearch();
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
            <div class="books_choice" v-if="filterSubmit.length > 0">
                <p class="section_content">Sắp xếp theo: {{ filterSubmit.join(',') }}</p>
            </div>
            <BookShowList :books="filteredBooks" />
        </article>
    </div>
</template>

<style scoped>
@import url(/css/layouts/BookList.css);
</style>