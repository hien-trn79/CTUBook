<script>
import userService from '@/services/user.service';
import InputSearchAdmin from './InputSearch.admin.vue';
import { loaiTk, ClassLoaiTk } from '@/enums/user.enum.js';
import { useToast } from 'primevue';
export default {
    components: {
        InputSearchAdmin,
    },

    data() {
        return {
            choiceSideBar: 'Quản lý tài khoản',
            users: [],
            selected: [],
            checkAll: false,
            showNotification: false,
            userSelected: {},
            RemoveContent: {
                title: 'Xóa người dùng',
                content: 'Bạn chắc chắn muốn xóa người dùng này?',
                description: 'Sau khi xóa dữ liệu sẽ bị mất vĩnh viễn và không thể khôi phục lại.',
            },
            showInfor: false,
            userSelected: {},
            loaiTk,
            ClassLoaiTk,
            inforUser: [
                {
                    key: 'USERNAME',
                    label: 'Tên người dùng'
                },
                {
                    key: 'HOVATEN',
                    label: 'Họ và tên'
                },
                {
                    key: 'EMAIL',
                    label: 'Email'
                },
                {
                    key: 'NGAYSINH',
                    label: 'Ngày sinh'
                },
                {
                    key: 'PHAI',
                    label: 'Giới tính'
                },
                {
                    key: 'DIACHI',
                    label: 'Địa chỉ'
                },
                {
                    key: 'DIENTHOAI',
                    label: 'Điện thoại'
                }
            ],
        }
    },

    created() {
        this.toast = useToast();
    },

    methods: {
        async getUserssAll() {
            this.users = await userService.getAll();
        },

        // Toggle single user selection
        toggleUserSelection(id, checked) {
            if (checked) {
                if (!this.selected.includes(id)) this.selected.push(id);
            } else {
                this.selected = this.selected.filter(x => x !== id);
            }
        },

        // Toggle select all
        changeCheckAll(checked) {
            this.checkAll = checked;
            if (checked) {
                this.selected = this.users.map(u => u._id);
            } else {
                this.selected = [];
            }
        },

        async RemoveUser(userSelectedID) {
            this.showNotification = true;
            const user = await userService.findByUsername(userSelectedID);
            this.userSelected = user[0];
        },

        // Delete all selected users
        async deleteSelected() {
            if (!this.selected.length) return alert('Chưa chọn người dùng nào');
            const ok = window.confirm(`Bạn có chắc muốn xóa ${this.selected.length} người dùng đã chọn không?`);
            if (!ok) return;
            try {
                // delete one by one (backend doesn't provide bulk delete by ids)
                await Promise.all(this.selected.map(id => userService.delete(id)));
                this.users = this.users.filter(u => !this.selected.includes(u._id));
                this.selected = [];
                this.checkAll = false;
                this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa người dùng đã chọn thành công', life: 3000 });
            } catch (error) {
                console.error('Lỗi khi xóa nhiều người dùng:', error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi khi xóa. Vui lòng thử lại.', life: 3000 });
            }
        },


        // Xác nhận xóa người dùng trong modal thông báo
        async removeAccept(userID) {
            try {
                this.showNotification = false;
                const resultDelete = await userService.delete(userID);

                const currentUser = JSON.parse(localStorage.getItem('currentUser'));

                if (currentUser && currentUser._id === userID) {
                    // Nếu xóa chính tài khoản đang đăng nhập, đăng xuất người dùng
                    localStorage.removeItem('currentUser');
                    this.$router.push('/signin'); // Chuyển hướng đến trang đăng nhập
                }

                this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa người dùng thành công', life: 3000 });
                this.getUserssAll();
            } catch (error) {
                console.error('Lỗi khi xóa người dùng:', error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi khi xóa người dùng. Vui lòng thử lại.', life: 3000 });
            }
        },

        // Xóa tất cả người dùng 
        async deleteSelectedAll() {
            try {
                this.RemoveContent.title = 'Xóa tất cả người dùng trong hệ thống';
                this.RemoveContent.content = `Bạn chắc chắn muốn xóa ${this.selected.length} người dùng đã chọn?`;
                this.showNotification = true;
                const reusultDeleteAll = await userService.deleteAll();

            } catch (error) {
                console.error('Lỗi khi xóa nhiều người dùng:', error);
                this.toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi khi xóa. Vui lòng thử lại.', life: 3000 });
            }
        },

        // Hien thi thong tin chi tiet nguoi dung
        async ShowDetail(user) {
            this.userSelected = user;
            this.userSelected.NGAYSINH = this.formatDate(this.userSelected.NGAYSINH);
            this.showInfor = true;
        },

        // chuyen doi dinh dang thoi gian
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
    },

    mounted() {
        this.getUserssAll()
    },

    watch: {
        showNotification(newVal) {
            document.body.classList.toggle("no-scroll", newVal);
        },

        showInfor(newVal) {
            document.body.classList.toggle("no-scroll", newVal);
        }
    },
}

</script>

<template>
    <header class="bookShowList-header">
        <h2 class="bookShowList--title dashboard-title">
            <i class="fa-solid fa-users"></i>
            {{ choiceSideBar }}
        </h2>
    </header>
    <main class="bookShowList-main">
        <table class="bookList-table">
            <tr class="bookList_row row-head">
                <th class="bookList_head"></th>
                <th class="bookList_head">STT</th>
                <th class="bookList_head">Mã độc giả</th>
                <th class="bookList_head">Tên người dùng</th>
                <th class="bookList_head">Email</th>
                <th class="bookList_head">Loại TK</th>
                <th class="bookList_head">Ngày sinh</th>
                <th class="bookList_head">Phái</th>
                <th class="bookList_head">Địa chỉ</th>
                <th class="bookList_head">Điện thoại</th>
                <th class="bookList_head">Xem</th>
                <th class="bookList_head">Xóa</th>
            </tr>

            <tr class="bookList_row" v-for="(user, index) in users" :key="user._id || index">
                <td class="bookList_col user-checkbox_area">
                    <input type="checkbox" class="user-checkbox" :checked="selected.includes(user._id)"
                        @change="toggleUserSelection(user._id, $event.target.checked)">
                </td>
                <td class="bookList_col bookList_ten">{{ index + 1 }}</td>
                <td class="bookList_col bookList_ten">{{ user._id }}</td>
                <td class="bookList_col bookList_ten">{{ user.USERNAME }}</td>
                <td class="bookList_col bookList_ten">{{ user.EMAIL }}</td>
                <td class="bookList_col bookList_ten" :class="ClassLoaiTk[user.LOAITK]">{{ loaiTk[user.LOAITK] }}</td>
                <td class="bookList_col bookList_ten">{{ formatDate(user.NGAYSINH) }}</td>
                <td class="bookList_col bookList_nxb">{{ user.PHAI }}</td>
                <td class="bookList_col bookList_soluong">{{ user.DIACHI }}</td>
                <td class="bookList_col bookList_ten">{{ user.DIENTHOAI }}</td>
                <td class="bookList_col bookList_update">
                    <i class="fa-regular fa-eye bookList--icon bookList_detail--icon"
                        @click.prevent="ShowDetail(user)"></i>
                </td>
                <td class="bookList_col bookList_delete">
                    <button class="icon-btn" @click="RemoveUser(user._id)"><i
                            class="fa-solid fa-trash bookList--icon bookList_delete--icon"></i></button>
                </td>
            </tr>
        </table>

        <div class="deleteAll_area">
            <input type="checkbox" name="deleteAll" id="deleteAll" class="deleteAll-checkbox"
                :checked="selected.length === users.length && users.length > 0"
                @change="changeCheckAll($event.target.checked)">
            <button class="btn btn-deleteAll" @click="deleteSelectedAll" :disabled="selected.length === 0">Xóa tất
                cả</button>
        </div>
    </main>

    <!-- Notification -->
    <div class="noti" v-if="showNotification">
        <div class="noti-showInfor">
            <header class="noti-header">
                <h2 class="noti--title">{{ RemoveContent.title }}</h2>
                <p class="section_content noti-book_selected">
                    <!-- <img :src="this.bookSelected.IMAGE" alt="" class="noti-img"> -->
                    <strong v-if="this.userSelected.EMAIL">Email: <span class="section_content">{{
                        this.userSelected.EMAIL }}</span></strong>
                </p>
            </header>
            <main class="noti-main">
                <p class="section_content noti--content ">{{ RemoveContent.content }}</p>
                <p class="section_content noti--description ">{{ RemoveContent.description }}</p>
            </main>
            <footer class="noti-footer mt-24">
                <button class="btn btn--accept bg-cancel" @click="removeAccept(userSelected._id)">Xóa</button>
                <button class="btn btn--close bg-submit" @click="showNotification = false">Đóng</button>
            </footer>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal" v-if="showInfor">
        <div class="modal_showInfor">
            <!-- Nội dung modal hiển thị thông tin chi tiết sách mượn/trả sẽ được thêm vào đây -->
            <header class="modal-header">
                <h3 class="section--title modal--title">Thông tin chi tiết độc giả</h3>
                <p class="section_content donMuon--id">Mã độc giả: <span class="section_value">{{ this.userSelected._id
                }}</span></p>
                <p class="section_content">
                    <i class="fa-regular fa-clock"></i> Ngày tạo:
                    <span class="timeStart"> {{ formatDate(this.userSelected.THOIGIANTAO) }}</span>
                </p>
            </header>

            <main class="modal-main">
                <!-- Thông tin chi tiết sách mượn/trả sẽ được hiển thị ở đây -->
                <h4 class="modal-main--title section_content">Thông tin độc giả</h4>

                <div class="infor_user">
                    <img :src="this.userSelected.IMAGE" alt="User Image" class="infor_user-img">
                    <div class="infor_user-main mt-24">
                        <li class="infor_user--items" v-for="(user, index) in inforUser" :key="index">
                            <p class="section_content user_content" v-if="user">
                                {{ user.label }}: <span class="section_value">{{ this.userSelected[user.key] }}</span>
                            </p>
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

<style>
.bookShowList--title {
    font-size: 2.4rem;
    padding: 12px;
    color: #1e40af;
    font-weight: 700;
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
    padding: 4px;
    text-align: center;
    font-size: 1.6rem;
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
}

.bookList_detail--icon {
    border: none;
    color: orange;
    font-size: 1.6rem;
}

.bookList_update {
    width: 50px;
}

/* ------CSS Input Search--------- */
.bookShowList-header {
    margin-bottom: 16px;
    background-color: white;
    border-radius: 7px;
    padding-bottom: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
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


/* ----------- Notification CSS --------------- */
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

.noti {
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

.noti-showInfor {
    position: absolute;
    top: 0;
    background-color: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    z-index: 1002;
    min-width: 500px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
}

.noti--title {
    font-size: 2.4rem;
    font-weight: 700;
    color: #ff0000;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.noti-footer {
    text-align: right;
}

.btn {
    min-width: 100px;
    margin-left: 8px;
}
</style>