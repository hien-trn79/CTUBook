<script>
// page
import InputSearchAdmin from './InputSearch.admin.vue';
import TableList from './TableList.vue';
import HeadNotification from '../noti/HeadNotification.vue';

// enum
import { icon, iconColor } from '@/enums/icon.enum';
import { trangThaiSach, ClassTrangThaiSach } from '@/enums/book.status';

// service
import bookService from '@/services/book.service';

// Primevue
import { useToast } from 'primevue/usetoast';

export default {
    components: {
        InputSearchAdmin,
        TableList,
        HeadNotification
    },

    data() {
        return {
            choiceSideBar: 'Quản lý sách',
            books: {},
            thead: ['STT', 'Mã sách', 'Tên sách', 'Nhà xuất bản', 'Tác giả', 'Thể loại', 'Số lượng',],
            colValue: ['MASACH', 'TENSACH', 'TENNXB', 'TACGIA', 'THELOAI', 'SOQUYEN'],
            colValueIcon: [
                {
                    url: 'detail',
                    icon: icon.eyeOpen,
                    id: 'btn-detail',
                    color: iconColor.eyeOpen
                },
                {
                    url: 'edit',
                    icon: icon.pen,
                    id: 'btn-edit',
                    color: iconColor.pen
                },
                {
                    url: 'remove',
                    icon: icon.trash,
                    id: 'btn-remove',
                    color: iconColor.trash,
                }
            ],
            ClassTrangThaiSach,
            trangThaiSach,
            notiDeleteBook: {
                title: "Xóa sách",
                content: 'Bạn chắc chắn muốn xóa sách này chứ ?',
                description: 'Dữ liệu sau khi xóa sẽ bị mất vĩnh viễn.'
            },
            showNoti: false,
            bookSelected: null,
            showInfor: false,
            bookInfoList: [
                { label: "Tên sách", key: "TENSACH" },
                { label: "Mã sách", key: "MASACH" },
                { label: "Tác giả", key: "TACGIA" },
                { label: "Nhà xuất bản", key: "TENNXB" },
                { label: "Năm xuất bản", key: "NAMXUATBAN" },
                { label: "Ngôn ngữ", key: "NGONNGU" },
                { label: "Số trang", key: "SOTRANG" },
                { label: "Số lượng", key: "SOQUYEN" },
                { label: "Đơn giá", key: "DONGIA" },
                { label: "Thể loại", key: "THELOAI" },
                { label: "Mô tả", key: "MOTA" },
                { label: "Yêu thích", key: "YEUTHICH" },
            ],
            theLoai: [
                'Giáo trình',
                'Công nghệ & kỹ thuật',
                'Thể thao & sức khỏe',
                'Công nghệ sinh học & thực phẩm',
                'Thủy sản',
                'Kỹ năng & văn hóa',
                'Toán học',
                'Khoa học nghiên cứu',
                'Môi trường',
                'Máy tính & phần mềm'
            ],
            bookBrand: [
                'Giáo dục Việt Nam',
                'Trẻ',
                'Kim Đồng',
                'Văn học',
                'Tổng hợp Thành phố Hồ Chí Minh',
                'Lao Động',
                'Thế Giới',
                'Đại học Cần Thơ'
            ],
            typeBookChoice: '',
            statusBookChoice: null,
            brandBookChoice: '',
        }
    },

    created() {
        this.toast = useToast();
    },

    methods: {
        closeNotification(value) {
            this.showNoti = value;
        },

        showNotification() {
            this.showNoti = !this.showNoti
        },

        async getBooksAll() {
            this.books = await bookService.getAll();
        },

        RemoveBook(book) {
            this.bookSelected = book;
            this.showNotification();
            console.log('Xoa sach voi id: ', book._id);
        },

        async RemoveBookClick(bookId) {
            try {
                const result = await bookService.delete(bookId);
                this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa sách thành công!', life: 3000 });
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            } catch (error) {
                console.error('Lỗi khi xóa sách:', error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Xóa sách thất bại! Vui lòng thử lại.', life: 3000 });
            }
        },

        showDetailBook(book) {
            this.bookSelected = book;
            this.showInfor = true;
        },

        filterBookTypeValue(event) {
            this.typeBookChoice = event.target.value;
            this.filterBookType;
        },

        filterBookStatusValue(event) {
            this.statusBookChoice = event.target.value;
            this.filterBookType;
        },

        filterBookBrandValue(event) {
            this.brandBookChoice = event.target.value;
            this.filterBookType;
        }
    },

    mounted() {
        this.getBooksAll();
    },

    watch: {
        showInfor(newVal) {
            document.body.classList.toggle("no-scroll", newVal);
        }
    },

    computed: {
        // Loc sach theo the loai
        async filterBookType() {
            let keyword = this.typeBookChoice;
            let statusKeyword = this.statusBookChoice;
            let brandChoice = this.brandBookChoice
            let dataBook = await bookService.getAll();


            // loc theo the loai
            if (keyword && keyword !== '') {
                dataBook = dataBook.filter(book => {
                    return Array.isArray(book.THELOAI) ? book.THELOAI.includes(keyword) : book.THELOAI === keyword
                });
            }

            // loc theo trang thai
            if (statusKeyword) {
                dataBook = dataBook.filter(book => {
                    return book.TRANGTHAI === statusKeyword;
                });
            }

            // loc theo nha xuat ban
            if (brandChoice && brandChoice !== '') {
                dataBook = dataBook.filter(book => book.TENNXB === brandChoice);
            }

            this.books = dataBook;
        },
    }
}
</script>

<template>
    <HeadNotification :notification="notiDeleteBook" class="notification" v-if="showNoti"
        @close-modal="closeNotification" @remove-book-method="RemoveBookClick" :book-selected="bookSelected" />
    <header class="bookShowList-header">
        <div class="bookList-header_area">
            <h2 class="bookShowList--title dashboard-title">
                <i class="fa-solid fa-book"></i>
                {{ this.choiceSideBar }}
            </h2>
            <router-link class="btn btn-add_book" to="addBook">
                <i class="fa-solid fa-plus icon"></i>
                Thêm sách mới
            </router-link>
        </div>
        <div class="search-admin ">
            <div class="form-group">
                <label for="book-search" class="form-label">Tìm kiếm sách</label>
                <input type="text" class="form-control" placeholder="Search" id="book-search">
            </div>
            <div class="form-group">
                <label for="book-brand" class="form-label">Nhà xuất bản</label>
                <select name="book-brand" id="book-brand" class="form-select book_brand form-control"
                    @change="filterBookBrandValue($event)" v-model="brandBookChoice">
                    <option value="">- Chọn -</option>
                    <option :value="brand" v-for="(brand, index) in bookBrand" :key="index">{{ brand }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="book-type" class="form-label">Thể loại</label>
                <select name="book-type" id="book-type" class="form-select book_type form-control"
                    @change="filterBookTypeValue($event)" v-model="typeBookChoice">
                    <option value="">- Chọn -</option>
                    <option :value="type" v-for="(type, index) in theLoai" :key="index">{{ type }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="book-filter" class="form-label">Trạng thái</label>
                <select name="book-filter" id="book-filter" class="form-select book_filter form-control"
                    v-model="statusBookChoice" @change="filterBookStatusValue($event)">
                    <option :value="-1">- Chọn -</option>
                    <option :value="index" v-for="(status, index) in trangThaiSach" :key="index">{{ status }}</option>
                </select>
            </div>
        </div>
    </header>
    <main class="bookShowList-main">
        <table class="bookList-table">
            <tr class="bookList_row row-head">
                <th class="bookList_head" v-for="theadItem in thead">{{ theadItem }}</th>
                <th class="bookList_head">Trạng thái</th>
                <th class="bookList_head">Thao tác</th>
            </tr>

            <tr class="bookList_row" v-if="colValue.length > 0" v-for="(bookItem, index) in books" :key="index">
                <td class="bookList_col bookList_ten">{{ index + 1 }}</td>
                <td class="bookList_col bookList_ten" v-for="(colValueItem) in colValue">{{
                    bookItem[colValueItem] }}
                </td>
                <td class="bookList_col" :class="ClassTrangThaiSach[bookItem.TRANGTHAI]">{{
                    trangThaiSach[bookItem.TRANGTHAI] }}</td>
                <td class="bookList_col bookList_update">
                    <button class="icon-btn" @click="showDetailBook(bookItem)">
                        <i class="fa-regular fa-eye btn-view icon color-orange"></i>
                    </button>

                    <router-link :to="`${bookItem._id}/edit`">
                        <button class="icon-btn">
                            <i class="fa-solid fa-pen-to-square btn-edit icon color-blue"></i>
                        </button>
                    </router-link>
                    <router-link :to="`${bookItem._id}/remove`">
                        <button class="icon-btn" @click.prevent="RemoveBook(bookItem)">
                            <i class="fa-solid fa-trash btn-remove icon color-red"></i>
                        </button>
                    </router-link>
                </td>
            </tr>
        </table>
    </main>

    <!-- Modal -->
    <div class="modal" v-if="showInfor">
        <div class="modal_showInfor">
            <!-- Nội dung modal hiển thị thông tin chi tiết sách mượn/trả sẽ được thêm vào đây -->
            <header class="modal-header">
                <h3 class="section--title modal--title">Thông tin chi tiết sách</h3>
                <p class="section_content donMuon--id">Mã sách: <span class="section_value">{{ bookSelected._id
                        }}</span></p>
            </header>

            <main class="modal-main">
                <!-- Thông tin chi tiết sách mượn/trả sẽ được hiển thị ở đây -->
                <h4 class="modal-main--title section_content">Thông tin sách</h4>

                <div class="infor_user">
                    <img :src="bookSelected.IMAGE" alt="User Image" class="infor_user-img">
                    <div class="infor_user-main">
                        <li class="infor_user--items" v-for="(bookInfor, index) in bookInfoList" :key="index">
                            <p class="section_content user_content" v-if="bookInfor">
                                {{ bookInfor.label }}: <span class="section_value"
                                    v-if="this.bookSelected[bookInfor.key] === undefined">{{ 'Chưa xác định'
                                    }}</span>
                                <span class="section_value" v-else>{{ this.bookSelected[bookInfor.key]
                                    }}</span>
                            </p>
                        </li>
                        <li class="infor_user--items">
                            <p class="section_content user_content">Trạng thái: <span class="section_value">{{
                                trangThaiSach[bookSelected.TRANGTHAI] }}</span></p>
                        </li>
                    </div>
                </div>
            </main>

            <footer class="modal-footer">
                <button class="btn btn--primary btn--close-modal bg-cancel" @click="showInfor = false">Đóng</button>
            </footer>
        </div>
        <div class="overlay"></div>
    </div>


</template>

<style scoped>
/* ------ Search book -------- */
.search-admin {
    display: flex;
    gap: 16px;
    margin: 8px 0px;
    flex-wrap: wrap;
    justify-content: space-between;
}

.form-group {
    display: flex;
    gap: 10px;
}

.book_brand,
.book_type {
    max-width: 150px;
}

.bookShowList-header {
    padding: 12px;
}

.bookList-header_area {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-add_book {
    background-color: var(--text-primary);
    color: white;
    border-radius: 5px;
    padding: 8px 12px;
    height: fit-content;
}

.bookList_update {
    width: 100px;
}

/* ---------------Modal CSS --------------- */
/* ----------Modal ShowInformation ------------------ */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal_showInfor {
    position: absolute;
    background-color: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    z-index: 1002;
    width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
}

.modal--title {
    font-size: 2.4rem;
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.infor_user {
    text-align: center;
}

.infor_user-img {
    height: 120x;
    width: 120px;
}

.infor_user-main {
    margin-bottom: 24px;
}

.infor_user--items {
    text-align: left;
    border-bottom: 1px solid #ececec;
    list-style: none;
}

.user_content {
    font-weight: bold;
}

.section_value {
    font-weight: normal;
    margin-left: 8px;
}

.overlay {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1001;
    backdrop-filter: blur(4px);
}
</style>