<script>
import bookService from '@/services/book.service';
import InputSearchAdmin from './InputSearch.admin.vue';
import { bookClass, bookLabel } from '@/enums/book.status';
import TableList from '../TableList.vue';
import { icon, iconColor } from '@/enums/icon.enum';
export default {
    components: {
        InputSearchAdmin,
        TableList
    },

    data() {
        return {
            choiceSideBar: 'Quản lý sách',
            books: {},
            thead: ['STT', 'Mã sách', 'Tên sách', 'Nhà xuất bản', 'Tác giả', 'Thể loại', 'Số lượng',],
            colValue: ['MASACH', 'TENSACH', 'MANXB', 'TACGIA', 'THELOAI', 'SOQUYEN'],
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
                    color: iconColor.trash
                }
            ],
            bookClass,
            bookLabel
        }
    },

    methods: {
        async getBooksAll() {
            this.books = await bookService.getAll();
        },
    },

    mounted() {
        this.getBooksAll()
    }
}
</script>

<template>
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
            :col-value-contact-icon="colValueIcon" :col-class="bookClass" :col-label="bookLabel" />
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
</style>