<script>
import BookCard from '@/components/books/BookCard.vue';
import bookService from '@/services/book.service';
export default {
    components: {
        BookCard
    },
    data() {
        return {
            books: [],
            activeIndex: -1,
            currentSlide: 0,
        }
    },

    computed: {
        totalSlides() {
            return Math.ceil(this.books.length / 2);
        },
        visibleBooks() {
            const start = this.currentSlide * 1;
            return this.books.slice(start, start + 1);
        }
    },

    methods: {
        async getBooks() {
            let data = await bookService.getAllFavorite();
            this.books = data;
        },
        nextSlide() {
            if (this.currentSlide < this.totalSlides - 1) {
                this.currentSlide++;
            } else {
                this.currentSlide = 0; // Loop back to start
            }
        },
        prevSlide() {
            if (this.currentSlide > 0) {
                this.currentSlide--;
            } else {
                this.currentSlide = this.totalSlides - 1; // Loop to end
            }
        },
        goToSlide(index) {
            this.currentSlide = index;
        }
    },
    mounted() {
        this.getBooks();
        // Tu dong chuyen slife sau 7 giay
        setInterval(() => {
            this.nextSlide();
        }, 7000);
    }
}

</script>

<template>
    <div class="slider section_page">
        <div class="slider_list">
            <div class="slide">
                <img src="/images/Signature (2).png" alt="" class="slider-img slider-img_1"></img>
            </div>
            <div class="slide">
                <img src="/images/WelcomeCTUBook.png" alt="" class="slider-img slider-img_2"></img>
            </div>
            <div class="slide">
                <img src="/images/Signature (3).png" alt="" class="slider-img slider-img_3"></img>
            </div>
        </div>
    </div>

    <article class="page-main_content">
        <section class="section_intro section_page">
            <div class="section--left section_intro--left">
                <img src="/images/homePage_GioiThieu.png" alt="" class="section_intro--img">
            </div>
            <div class="section--right section_intro--right">
                <div class="section_content--group">
                    <h2 class="section--title">Giới thiệu về CTUBook</h2>
                    <p class="section_content">CTUBook là website mượn sách trực tuyến dành cho sinh viên, giảng viên
                        của
                        Đại
                        học Cần Thơ. Với giao diện thân thiện, dễ sử dụng, CTUBook giúp người dùng nhanh chóng tra cứu,
                        mượn
                        các đầu sách thuộc nhiều thể loại như giáo trình, tài liệu tham khảo, sách chuyên ngành, ...
                    </p>
                    <p class="section_content">Đây là nơi lưu giữ những đầu sách gốc, có giá trị, được biên soạn bởi các
                        thầy cô
                        giàu chuyên môn của Trường Đại học Cần Thơ. CTUBook mang đến cho độc giả một không gian tri thức
                        uy
                        tín,
                        chính xác và đầy tính chuyên nghiệp
                    </p>
                    <p class="section_content">Mỗi người dùng đều có thể truy cập và lựa chọn những quyển sách, giáo
                        trình
                        phù
                        hợp
                        với nhu cầu cá nhân. Để có thể đăng ký mượn sách, mỗi cá nhân hãy tạo cho riêng mình một tài
                        khoản
                        để có
                        thể thuận tiện nhất trong quá trình thực hiện thủ tục.
                    </p>
                    <p class="section_content">Mỗi tài khoản đều là một thư viện cá nhân, nơi lưu trữ danh sách ebook mà
                        người
                        dùng đã mượn hoặc mua, đảm bảo quyền lợi đọc và riêng tư.</p>
                </div>
            </div>
        </section>

        <section class="section_page section_favorite-books">
            <div class="favorite-books_container">
                <!-- Header Section -->
                <div class="favorite-books_header">
                    <div class="header-decoration">
                        <div class="decoration-line"></div>
                        <i class="fa-solid fa-heart header-icon"></i>
                        <div class="decoration-line"></div>
                    </div>
                    <h2 class="section--title favorite-title">
                        Sách Được Yêu Thích Nhất
                    </h2>
                    <p class="favorite-subtitle">
                        Khám phá những đầu sách được độc giả yêu thích và đánh giá cao nhất
                    </p>
                </div>

                <!-- Books Carousel -->
                <div v-if="books.length > 0" class="books-carousel">
                    <!-- Navigation Buttons -->
                    <button @click="prevSlide" class="carousel-btn carousel-btn--prev" aria-label="Previous">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>

                    <!-- Books Slider -->
                    <div class="carousel-container">
                        <transition name="slide-fade" mode="out-in">
                            <div :key="currentSlide" class="bookCard_list">
                                <BookCard v-for="(book, index) in visibleBooks" :key="book._id || index"
                                    :bookData="book" />
                            </div>
                        </transition>
                    </div>

                    <button @click="nextSlide" class="carousel-btn carousel-btn--next" aria-label="Next">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>

                    <!-- Dots Indicator -->
                    <div class="carousel-dots">
                        <button v-for="(slide, index) in totalSlides" :key="index" @click="goToSlide(index)"
                            :class="['dot', { 'dot--active': currentSlide === index }]"
                            :aria-label="`Go to slide ${index + 1}`">
                        </button>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="empty-state">
                    <i class="fa-solid fa-book-open empty-icon"></i>
                    <h3 class="empty-title">Chưa có sách yêu thích</h3>
                    <p class="empty-text">Các đầu sách yêu thích sẽ được hiển thị tại đây</p>
                </div>
            </div>
        </section>
    </article>
</template>

<style>
@import url(/css/layouts/HomePage.css);
</style>