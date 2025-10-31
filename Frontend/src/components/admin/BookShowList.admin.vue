<script>
// page
import InputSearchAdmin from './InputSearch.admin.vue';
import TableList from './TableList.vue';
import HeadNotification from '../noti/HeadNotification.vue';

// enum
import { icon, iconColor } from '@/enums/icon.enum';
import { bookClass, bookLabel } from '@/enums/book.status';

// service
import bookService from '@/services/book.service';

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
            bookClass,
            bookLabel,
            notiDeleteBook: {
                title: "Xóa sách",
                content: 'Bạn chắc chắn muốn xóa sách này chứ ?',
                description: 'Dữ liệu sau khi xóa sẽ bị mất vĩnh viễn.'
            },
            showNoti: false,
            bookSelected: null
        }
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
                alert('Xóa sách thành công!');
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            } catch (error) {
                console.error('Lỗi khi xóa sách:', error);
                alert('Xóa sách thất bại. Vui lòng thử lại!');
            }
        }
    },

    mounted() {
        this.getBooksAll();
    }
}
</script>

<template>
    <HeadNotification :notification="notiDeleteBook" class="notification" v-if="showNoti"
        @close-modal="closeNotification" @remove-book-method="RemoveBookClick" :book-selected="bookSelected" />
    <header class="bookShowList-header">
        <div class="bookList-header_area">
            <h2 class="bookShowList--title">{{ this.choiceSideBar }}</h2>
            <router-link class="btn btn-add_book" to="addBook">
                <i class="fa-solid fa-plus icon"></i>
                Thêm sách mới
            </router-link>
        </div>
        <InputSearchAdmin />
    </header>
    <main class="bookShowList-main">
        <TableList :head-list-table="thead" :col-value-list="colValue" :books="books"
            :col-value-contact-icon="colValueIcon" :col-class="bookClass" :col-label="bookLabel"
            @remove-book="RemoveBook" />
    </main>


</template>

<style scoped>
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
    height: 20px;
}

/* ------Notification CSS ------- */
</style>