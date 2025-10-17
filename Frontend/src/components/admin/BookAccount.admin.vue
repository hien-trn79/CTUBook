<script>
import userService from '@/services/user.service';
import InputSearchAdmin from './InputSearch.admin.vue';
import { bookClass, bookLabel } from '@/enums/book.status';
export default {
    components: {
        InputSearchAdmin,
    },

    data() {
        return {
            choiceSideBar: 'Quản lý tài khoản',
            users: {},
            deleteAll: true
        }
    },

    methods: {
        async getUserssAll() {
            this.users = await userService.getAll();
        },

        RemoveUser(id) {
            console.log(`remove ${id}`)
        },

    },

    mounted() {
        this.getUserssAll()
    },
}

</script>

<template>
    <header class="bookShowList-header" hidden="true">
        <h2 class="bookShowList--title">{{ this.choiceSideBar }}</h2>
        <InputSearchAdmin />
    </header>
    <main class="bookShowList-main">
        <table class="bookList-table">
            <tr class="bookList_row row-head">
                <th class="bookList_head"></th>
                <th class="bookList_head">STT</th>
                <th class="bookList_head">Mã độc giả</th>
                <th class="bookList_head">Họ lót</th>
                <th class="bookList_head">Tên</th>
                <th class="bookList_head">Email</th>
                <th class="bookList_head">Ngày sinh</th>
                <th class="bookList_head">Phái</th>
                <th class="bookList_head">Địa chỉ</th>
                <th class="bookList_head">Điện thoại</th>
                <th class="bookList_head">Xem</th>
                <th class="bookList_head">Xóa</th>
            </tr>

            <tr class="bookList_row" v-for="(user, index) in users" :key="index">
                <td class="bookList_col user-checkbox_area">
                    <input type="checkbox" class="user-checkbox" :checked="checkAll">
                </td>
                <td class="bookList_col bookList_ten">{{ index + 1 }}</td>
                <td class="bookList_col bookList_ten">{{ user.MADOCGIA }}</td>
                <td class="bookList_col bookList_ten">{{ user.HOLOT }}</td>
                <td class="bookList_col bookList_ten">{{ user.TEN }}</td>
                <td class="bookList_col bookList_ten">{{ user.EMAIL }}</td>
                <td class="bookList_col bookList_ten">{{ user.NGAYSINH }}</td>
                <td class="bookList_col bookList_nxb">{{ user.PHAI }}</td>
                <td class="bookList_col bookList_soluong">{{ user.DIACHI }}</td>
                <td class="bookList_col bookList_ten">{{ user.DIENTHOAI }}</td>
                <td class="bookList_col bookList_update">
                    <i class="fa-regular fa-eye bookList--icon bookList_detail--icon"></i>
                </td>
                <td class="bookList_col bookList_delete" @click="RemoveUser(user._id)">
                    <i class="fa-solid fa-minus bookList--icon bookList_delete--icon"></i>
                </td>
            </tr>
        </table>

        <div class="deleteAll_area">
            <input type="checkbox" name="deleteAll" id="deleteAll" class="deleteAll-checkbox" :checked="deleteAll">
            <button class="btn btn-deleteAll">Xóa tất cả</button>
        </div>
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

/* ------- CSS User ------- */
.user-checkbox_area {
    margin: auto 0px;
}

.user-checkbox {
    height: 1.7rem;
    width: 1.7rem;
}

.deleteAll_area {
    margin: 24px 0px 0px 12px;
    text-align: left;
}

.deleteAll-checkbox {
    height: 1.7rem;
    width: 1.7rem;
    margin-right: 16px;
}

.btn-deleteAll {
    background-color: red;
    color: white;
    font-weight: bold;
}
</style>