<script>
import InputSearchAdmin from './InputSearch.admin.vue';
import TableList from './TableList.vue';
import { icon, iconColor } from '@/enums/icon.enum';
import userService from '@/services/user.service';
import muonService from '@/services/muon.service';
import { hinhthuc, trangthai, ClassTrangThai } from '@/enums/muon.enum';
import chitietdonmuonService from '@/services/chitietdonmuon.service';

import { useToast } from 'primevue/usetoast';
import bookService from '@/services/book.service';
export default {
    components: {
        InputSearchAdmin,
        TableList
    },

    data() {
        return {
            choiceSideBar: 'Quản lý Mượn - Trả',
            dataList: {},
            thead: ['STT', 'Mã độc giả', 'Email', 'Số lượng sách', 'Thời gian mượn', 'Thời gian trả', 'Hình thức'],
            colValue: ['IDDOCGIA', 'EMAIL', 'SOQUYEN', 'THOIGIANMUON', 'THOIGIANTRA', 'HINHTHUC'],
            colValueIcon: [
                {
                    url: 'detail',
                    icon: icon.eyeOpen,
                    id: 'btn-detail',
                    color: iconColor.eyeOpen
                },
            ],
            hinhthuc,
            trangthai,
            ClassTrangThai,
            showInfor: false,
            ticketSelected: null,
            inforUser: [{
                key: 'EMAIL',
                label: 'Email'
            }, {
                key: 'NGAYSINH',
                label: 'Ngày sinh'
            }, {
                key: 'PHAI',
                label: 'Giới tính'
            }, {
                key: 'DIACHI',
                label: 'Địa chỉ'
            }, {
                key: 'DIENTHOAI',
                label: 'Điện thoại'
            }],
            statusBorrowChoice: -1,
            statusHinhThucChoice: -1
        }
    },

    created() {
        this.toast = useToast();
    },

    methods: {

        getFullName(holot, ten) {
            return holot + ' ' + ten;
        },

        async getUser(MADOCGIA) {
            let user = await userService.getId(MADOCGIA);
            return user;
        },

        async getDataAll() {
            this.dataList = await muonService.getAll();
            Promise.all(
                this.dataList.map(async yeuCau => {
                    const user = await userService.findByUsername(yeuCau.IDDOCGIA);
                    yeuCau['EMAIL'] = user[0].EMAIL;
                    const chitietdonmuon = await chitietdonmuonService.getIDDonMuon(yeuCau._id);
                    let soLuong = 0;
                    if (chitietdonmuon.length > 0) {
                        chitietdonmuon.forEach(item => {
                            soLuong += item.SOLUONG;
                        });
                    }
                    yeuCau['SOQUYEN'] = soLuong;
                    // Cap nhat hinh thuc
                    yeuCau['HINHTHUC'] = this.hinhthuc[yeuCau.HINHTHUC];
                    // dieu chinh format thoi gian
                    yeuCau['THOIGIANMUON'] = new Date(yeuCau.THOIGIANMUON).toLocaleDateString('en-GB');
                    yeuCau['THOIGIANTRA'] = new Date(yeuCau.THOIGIANTRA).toLocaleDateString('en-GB');

                    yeuCau.DOCGIA = user[0];
                    yeuCau.DOCGIA.NGAYSINH = new Date(yeuCau.DOCGIA.NGAYSINH).toLocaleDateString('en-GB');
                })
            )
            return this.dataList
        },

        async handlerDetail(book) {
            this.ticketSelected = book;
            const idDonMuon = book._id;
            const chiTietList = await chitietdonmuonService.getIDDonMuon(idDonMuon);
            this.ticketSelected.bookDetails = [];
            await Promise.all(
                chiTietList.map(async chiTiet => {
                    const bookinfor = await bookService.getId(chiTiet.MASACH);
                    bookinfor.SOLUONG = chiTiet.SOLUONG;
                    this.ticketSelected.bookDetails.push(bookinfor);
                })
            )
            console.log(this.ticketSelected);
            this.showInfor = true;
        },
        // Xác nhận đã trả sách
        async borrowedBook(book) {
            const idDonMuon = book._id;
            const donMuon = await muonService.getByIdDonMuon(idDonMuon);
            let updatedDonMuon = { ...donMuon };
            updatedDonMuon.TRANGTHAI = 0; // Cập nhật trạng thái thành "Đã trả"
            const chiTietList = await chitietdonmuonService.getIDDonMuon(idDonMuon);
            // Cập nhật số lượng sách trong kho
            chiTietList.forEach(async chiTiet => {
                let bookInfor = await bookService.getId(chiTiet.MASACH);
                let updatedBook = { ...bookInfor };
                updatedBook.SOQUYEN += Number(chiTiet.SOLUONG);
                const resultBook = await bookService.update(chiTiet.MASACH, updatedBook);
            })
            const result = await muonService.updateByIdDonMuon(idDonMuon, updatedDonMuon);
            if (result) {
                this.toast.add({ severity: 'success', summary: 'Thành công', detail: 'Xác nhận trả sách thành công!', life: 3000 });
                this.getDataAll();
            } else {
                this.toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Xác nhận trả sách thất bại!', life: 3000 });
            }
        },

        filterBorrowStatusValue(event) {
            this.statusBorrowChoice = event.target.value;
            this.filterBorrowStatus;
        },

        choiceHinhThucValue(event) {
            this.statusHinhThucChoice = event.target.value;
            this.filterBorrowStatus;
        }
    },

    watch: {
        showInfor(newVal) {
            document.body.classList.toggle("no-scroll", newVal);
        }
    },

    mounted() {
        this.getDataAll()
    },

    computed: {
        async filterBorrowStatus() {
            let status = this.statusBorrowChoice;
            let hinhThuc = this.statusHinhThucChoice;
            let dataBorrow = await this.getDataAll();
            let filteredData = [...dataBorrow];
            if (status != -1) {
                filteredData = Array.from(dataBorrow).filter(borrow => borrow.TRANGTHAI == status);
            }

            if (hinhThuc != -1) {
                filteredData = Array.from(filteredData).filter(borrow => borrow.HINHTHUC == hinhThuc);
            }

            this.dataList = filteredData;
        }
    }

}
</script>

<template>
    <header class="bookShowList-header">
        <div class="bookList-header_area">
            <h2 class="bookShowList--title dashboard-title">
                <i class="fa-solid fa-book-open-reader"></i>
                {{ this.choiceSideBar }}
            </h2>
        </div>
        <div class="borrow-admin">
            <div class="form-group">
                <label for="borrow-search" class="form-label">Tìm kiếm sách</label>
                <input type="text" class="form-control" placeholder="Search" id="borrow-search">
            </div>
            <div class="form-group">
                <label for="borrow-filter" class="form-label">Trạng thái</label>
                <select name="borrow-filter" id="borrow-filter" class="form-select request_filter form-control"
                    v-model="statusBorrowChoice" @change="filterBorrowStatusValue($event)">
                    <option :value="-1">- Chọn -</option>
                    <option :value="index" v-for="(status, index) in trangthai" :key="index">{{ status }}</option>
                </select>
            </div>

            <div class="form-group">
                <label for="borrow-filter" class="form-label">Hình thức</label>
                <select name="borrow-filter" id="borrow-filter" class="form-select request_filter form-control"
                    v-model="statusHinhThucChoice" @change="choiceHinhThucValue($event)">
                    <option :value="-1">- Chọn -</option>
                    <option :value="index" v-for="(status, index) in hinhthuc" :key="index">{{ status }}</option>
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

            <tr class="bookList_row" v-if="colValue.length > 0" v-for="(bookItem, index) in dataList" :key="index">
                <td class="bookList_col bookList_ten">{{ index + 1 }}</td>
                <td class="bookList_col bookList_ten" v-for="(colValueItem) in colValue">{{
                    bookItem[colValueItem] }}
                </td>
                <td class="bookList_col" :class="ClassTrangThai[bookItem.TRANGTHAI]">{{ trangthai[bookItem.TRANGTHAI] }}
                </td>
                <td class="bookList_col bookList_update">
                    <router-link :to="`${bookItem._id}/detail`">
                        <button class="icon-btn" @click.prevent="handlerDetail(bookItem)">
                            <i class="fa-regular fa-eye btn-detail icon color-orange"></i>
                        </button>
                    </router-link>

                    <button class="icon-btn" @click.prevent="borrowedBook(bookItem)">
                        <i class="fa-solid fa-circle-check icon color-green"></i>
                    </button>
                </td>
            </tr>
        </table>
    </main>

    <div class="modal" v-if="showInfor">
        <div class="modal_showInfor">
            <!-- Nội dung modal hiển thị thông tin chi tiết sách mượn/trả sẽ được thêm vào đây -->
            <header class="modal-header">
                <h3 class="section--title modal--title">Thông tin chi tiết đơn mượn</h3>
                <p class="section_content donMuon--id">Mã đơn mượn: <span class="section_value">{{ ticketSelected._id
                        }}</span></p>
                <p class="section_content">
                    <i class="fa-regular fa-clock"></i>
                    <span class="timeStart">{{ ticketSelected.THOIGIANMUON }}</span> - <span class="timeFinish">{{
                        ticketSelected.THOIGIANTRA }}</span>
                </p>
            </header>

            <main class="modal-main">
                <!-- Thông tin chi tiết sách mượn/trả sẽ được hiển thị ở đây -->
                <h4 class="modal-main--title section_content">Thông tin độc giả</h4>

                <img :src="ticketSelected.DOCGIA.IMAGE" alt="User Image" class="infor_user-img">
                <div class="infor_user-main">
                    <li class="infor_user--items" v-for="(userInfor, index) in inforUser" :key="index">
                        <p class="section_content user_content" v-if="userInfor">
                            {{ userInfor.label }}: <span class="section_value"
                                v-if="this.ticketSelected.DOCGIA[userInfor.key] === undefined">{{ 'Chưa xác định'
                                }}</span>
                            <span class="section_value" v-else>{{ this.ticketSelected.DOCGIA[userInfor.key]
                                }}</span>
                        </p>
                    </li>
                </div>

                <h4 class="modal-main--title section_content">Thông tin sách mượn</h4>
                <div class="infor_user">
                    <ol class=" borrowed_book-list">
                        <li class="infor_user--items " v-for="(book, index) in ticketSelected.bookDetails" :key="index">
                            <!-- <img :src="book.IMAGE" alt="User Image" class="infor_user-img"> -->
                            <p class="user_content section_content">
                                Tên sách:
                                <span class="section_value">{{ book.TENSACH }}</span>
                                <br></br>Số lượng:
                                <span class="section_value">{{ book.SOLUONG }}</span>
                            </p>
                        </li>
                    </ol>
                </div>

            </main>

            <footer class="modal-footer mt-24">
                <button class="btn btn--primary btn--close-modal bg-cancel" @click="showInfor = false">Đóng</button>
            </footer>
        </div>
        <div class="overlay"></div>
    </div>
</template>

<style scoped>
/* ------ Search ------ */
.borrow-admin {
    display: flex;
    gap: 16px;
    margin: 8px 0px;
}

.form-group {
    display: flex;
    gap: 10px;
}

#request-search {
    width: 300px;
}

.bookList_update {
    min-width: 80px;
}

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
    min-width: 500px;
    max-width: 90vw;
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
    border-radius: 50%;
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

.bookShowList-header {
    padding: 12px;
}

.bookShowList--title {
    font-size: 2.4rem;
    padding: 12px;
    color: #1e40af;
    font-weight: 700;
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
    height: 32px;
}
</style>