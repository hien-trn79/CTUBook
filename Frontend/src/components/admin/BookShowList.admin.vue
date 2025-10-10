<script>
import InputSearchAdmin from './InputSearch.admin.vue';
export default {
    components: {
        InputSearchAdmin,
    },

    props: {
        books: { type: Object },
        choiceSideBar: { type: String }
    },

    data() {
        return {

        }
    }
}
</script>

<template>
    <header class="bookShowList-header">
        <h2 class="bookShowList--title">{{ this.choiceSideBar }}</h2>
        <InputSearchAdmin />
    </header>
    <table class="bookList-table">
        <tr class="bookList_row">
            <th class="bookList_head">STT</th>
            <th class="bookList_head">Tên sách</th>
            <th class="bookList_head">Nhà xuất bản</th>
            <th class="bookList_head">Số lượng</th>
            <th class="bookList_head">Cập nhật</th>
            <th class="bookList_head">Xóa</th>
        </tr>

        <tr class="bookList_row" v-for="(book, index) in books" :key="index">
            <td class="bookList_col bookList_ten">#</td>
            <td class="bookList_col bookList_ten">{{ book.TENSACH }}</td>
            <td class="bookList_col bookList_nxb">{{ book.MANXB }}</td>
            <td class="bookList_col bookList_soluong">{{ book.SOQUYEN }}</td>
            <td class="bookList_col bookList_update">
                <i class="fa-solid fa-rotate bookList--icon bookList_update--icon"></i>
            </td>
            <td class="bookList_col bookList_delete">
                <i class="fa-solid fa-minus bookList--icon bookList_delete--icon"></i>
            </td>
        </tr>
    </table>
</template>

<style>
.bookShowList--title {
    font-size: 1.8rem;
    padding: 12px 0px 24px 12px;
}

.bookList_head,
.bookList_col {
    font-size: 1.4rem;
}

th,
td {
    padding: 6px 12px;
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

.bookList_update--icon {
    border-color: rgb(0, 115, 255);
    color: rgb(0, 115, 255);
}

.bookList_delete--icon {
    color: red;
    border-color: red;
}

/* ------CSS Input Search--------- */
.bookShowList-header {
    margin-bottom: 16px;
    background-color: white;
    border-radius: 7px;
    padding-bottom: 12px;
}
</style>