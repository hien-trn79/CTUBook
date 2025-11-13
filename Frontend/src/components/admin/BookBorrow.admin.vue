<script>
import InputSearchAdmin from './InputSearch.admin.vue';
import TableList from './TableList.vue';
import { icon, iconColor } from '@/enums/icon.enum';
import userService from '@/services/user.service';
import muonService from '@/services/muon.service';
import { hinhthuc, trangthai, ClassTrangThai } from '@/enums/muon.enum';
import chitietdonmuonService from '@/services/chitietdonmuon.service';
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
            }]
        }
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
            this.dataList.forEach(async yeuCau => {
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
            })
        },

        handlerDetail(book) {
            this.ticketSelected = book;
            this.showInfor = true;
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
        <!-- <InputSearchAdmin /> -->
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

                <div class="infor_user">
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