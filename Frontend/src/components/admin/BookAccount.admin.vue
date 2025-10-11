<script>
import bookService from '@/services/book.service';
import InputSearchAdmin from './InputSearch.admin.vue';
import { bookClass, bookLabel } from '@/enums/book.status';
export default {
    components: {
        InputSearchAdmin,
    },

    data() {
        return {
            choiceSideBar: 'Quản lý tài khoản',
            books: {}
        }
    },

    methods: {
        async getBooksAll() {
            this.books = await bookService.getAll();
        },

        getClass(bookItem) {
            return bookClass[bookItem]
        },

        getLabel(bookItem) {
            if (!("TRANGTHAI" in bookItem)) return bookLabel[0];
            else return bookLabel[bookItem.TRANGTHAI]
        }
    },

    mounted() {
        this.getBooksAll()
    }
}
</script>

<template>
    <header class="bookShowList-header">
        <h2 class="bookShowList--title">{{ this.choiceSideBar }}</h2>
        <InputSearchAdmin />
    </header>
    <main class="bookShowList-main">
        <table class="bookList-table">
            <tr class="bookList_row row-head">
                <th class="bookList_head">STT</th>
                <th class="bookList_head">Tên sách</th>
                <th class="bookList_head">Nhà xuất bản</th>
                <th class="bookList_head">Số lượng</th>
                <th class="bookList_head">Trạng thái</th>
                <th class="bookList_head">Xem</th>
                <th class="bookList_head">Cập nhật</th>
                <th class="bookList_head">Xóa</th>
            </tr>

            <tr class="bookList_row" v-for="(book, index) in books" :key="index">
                <td class="bookList_col bookList_ten">{{ index + 1 }}</td>
                <td class="bookList_col bookList_ten">{{ book.TENSACH }}</td>
                <td class="bookList_col bookList_nxb">{{ book.MANXB }}</td>
                <td class="bookList_col bookList_soluong">{{ book.SOQUYEN }}</td>
                <td class="bookList_col bookList_soluong" :class="getClass(book.TRANGTHAI)">
                    {{ getLabel(book) }}
                </td>
                <td class="bookList_col bookList_update">
                    <i class="fa-regular fa-eye bookList--icon bookList_detail--icon"></i>
                </td>
                <td class="bookList_col bookList_update">
                    <i class="fa-solid fa-rotate bookList--icon bookList_update--icon"></i>
                </td>
                <td class="bookList_col bookList_delete">
                    <i class="fa-solid fa-minus bookList--icon bookList_delete--icon"></i>
                </td>
            </tr>
        </table>
    </main>
</template>

<style>
.bookShowList--title {
    font-size: 1.8rem;
    padding: 12px 0px 24px 12px;
}

.bookShowList-main {
    background-color: white;
    padding: 10px;
    border-radius: 10px;
}

.row-head {
    background-color: rgba(83, 172, 250, 0.984);
}

.bookList_head,
.bookList_col {
    font-size: 1.4rem;
}

th,
td {
    padding: 6px 12px;
    text-align: center;
}

.bookList_ten {
    text-align: left;
}

.bookList_row {
    border-bottom: 1px solid #ccc;
}

.bookList--icon {
    border: 2px solid #ccc;
    padding: 4px;
    border-radius: 50%;
    text-align: center;
    font-size: 1.1rem;
}

.bookList--icon:hover {
    cursor: pointer;
}

.bookList_update--icon {
    border-color: rgb(0, 115, 255);
    color: rgb(0, 115, 255);
}

.bookList_delete--icon {
    color: red;
    border-color: red;
}

.bookList_detail--icon {
    border: none;
    color: orange;
    font-size: 1.6rem;
}

/* ------CSS Input Search--------- */
.bookShowList-header {
    margin-bottom: 16px;
    background-color: white;
    border-radius: 7px;
    padding-bottom: 12px;
}
</style>