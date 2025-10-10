<script>
import BookShow from '@/components/BookShowList.user.vue';
import bookService from '@/services/book.service';
export default {
    components: {
        BookShow,
    },
    data() {
        return {
            books: null,
            activeIndex: -1,
        }
    },

    methods: {
        async getBookList() {
            try {
                this.books = await bookService.getAllFavorite();
            } catch (error) {
                console.log(error)
            }
        }
    },
    mounted() {
        this.getBookList();
    }
}

</script>

<template>
    <div class="slider">
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
                <h2 class="section--title">Giới thiệu về CTUBook</h2>
                <p class="section_content">CTUBook là website mượn sách trực tuyến dành cho sinh viên, giảng viên của
                    Đại
                    học Cần Thơ. Với giao diện thân thiện, dễ sử dụng, CTUBook giúp người dùng nhanh chóng tra cứu, mượn
                    các đầu sách thuộc nhiều thể loại như giáo trình, tài liệu tham khảo, sách chuyên ngành, ...
                </p>
                <p class="section_content">Đây là nơi lưu giữ những đầu sách gốc, có giá trị, được biên soạn bởi các
                    thầy cô
                    giàu chuyên môn của Trường Đại học Cần Thơ. CTUBook mang đến cho độc giả một không gian tri thức uy
                    tín,
                    chính xác và đầy tính chuyên nghiệp
                </p>
                <p class="section_content">Mỗi người dùng đều có thể truy cập và lựa chọn những quyển sách, giáo trình
                    phù
                    hợp
                    với nhu cầu cá nhân. Để có thể đăng ký mượn sách, mỗi cá nhân hãy tạo cho riêng mình một tài khoản
                    để có
                    thể thuận tiện nhất trong quá trình thực hiện thủ tục.
                </p>
                <p class="section_content">Mỗi tài khoản đều là một thư viện cá nhân, nơi lưu trữ danh sách ebook mà
                    người
                    dùng đã mượn hoặc mua, đảm bảo quyền lợi đọc và riêng tư.</p>
            </div>
            <div class="section_final--line"></div>
        </section>

        <section class="section-page">
            <div class="section_page-header">
                <h2 class="section--title">Sách được yêu thích nhất</h2>
                <i class="fa-solid fa-book-open section--icon"></i>
            </div>
            <BookShow :books="this.books"></BookShow>
        </section>
    </article>
</template>

<style>
@import url(/css/layouts/HomePage.css);
</style>