<script>
import InputSearchAdmin from './InputSearch.admin.vue';
import TableList from './TableList.vue';
import { icon, iconColor } from '@/enums/icon.enum';
import requestService from '@/services/request.service';
import userService from '@/services/user.service';
import { request, ClassRequest } from '@/enums/book.status';
import chitietyeucauService from '@/services/chitietyeucau.service';
import bookService from '@/services/book.service';
export default {
    components: {
        InputSearchAdmin,
        TableList
    },

    data() {
        return {
            choiceSideBar: 'Quản lý yêu cầu mượn sách',
            dataList: [],
            thead: ['STT', 'Mã yêu cầu', 'Tên tài khoản', 'Email', 'Số điện thoại', 'Thời gian yêu cầu', 'Số quyển'],
            colValue: ['MAYEUCAU', 'TENTAIKHOAN', 'EMAIL', 'DIENTHOAI', 'THOIGIANDAT', 'SOQUYEN'],
            colValueIcon: [
                {
                    url: 'detail',
                    icon: icon.eyeOpen,
                    id: 'btn-detail',
                    color: iconColor.eyeOpen
                },
                {
                    url: 'cancel',
                    icon: icon.cross,
                    id: 'btn-cancel',
                    color: iconColor.cross
                },
                {
                    url: 'accept',
                    icon: icon.tick,
                    id: 'btn-accept',
                    color: iconColor.tick
                },
            ],
            request,
            ClassRequest,
            showInfor: false,
            requestSelected: null,
            infoRequest: [
                {
                    key: 'MAYEUCAU',
                    label: 'Mã yêu cầu'
                },
                {
                    key: 'TENTAIKHOAN',
                    label: 'Tên tài khoản'
                },
                {
                    key: 'EMAIL',
                    label: 'Email'
                },
                {
                    key: 'DIENTHOAI',
                    label: 'Số điện thoại'
                },
                {
                    key: 'THOIGIANDAT',
                    label: 'Thời gian đặt'
                },
                {
                    key: 'SOQUYEN',
                    label: 'Số quyển'
                }
            ]
        }
    },

    methods: {
        async getRequestAll() {
            try {
                const requestList = await requestService.getAll();
                // Dùng Promise.all để chờ tất cả các async operation hoàn tất
                const dataRequests = await Promise.all(
                    requestList.map(async (request) => {
                        let docGia = await userService.findByUsername(request.MADOCGIA);
                        docGia = docGia[0];
                        const maYeuCau = request._id;
                        const chitietyeucau = await chitietyeucauService.getMAYEUCAU(maYeuCau);
                        let soluong = 0;
                        if (chitietyeucau.length > 0) {
                            chitietyeucau.forEach(item => {
                                soluong += item.SOLUONG;
                            });
                        }

                        // Chuyen dinh dang ngay
                        const date = new Date(request.THOIGIANDAT);
                        const formattedDate = date.toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        return {
                            MAYEUCAU: maYeuCau,
                            TENTAIKHOAN: docGia.USERNAME,
                            EMAIL: docGia.EMAIL,
                            DIENTHOAI: docGia.DIENTHOAI,
                            THOIGIANDAT: formattedDate,
                            SOQUYEN: soluong,
                            TRANGTHAI: request.TRANGTHAI
                        };
                    })
                );

                // Gán dữ liệu sau khi toàn bộ Promise đã hoàn tất
                this.dataList = dataRequests;
            } catch (error) {
                console.error("Lỗi khi tải danh sách yêu cầu:", error);
            }
        },

        // Chap Nhan Yeu Cau
        async AcceptRequest(request) {
            try {
                let data = request;
                data.TRANGTHAI = 1; // Đặt trạng thái thành "Đã chấp nhận"
                const result = await requestService.updateRequestById(data.MAYEUCAU, data);
                alert("Chấp nhận yêu cầu thành công!");
                this.getRequestAll();
            } catch (error) {
                alert("Không đủ sách để chấp nhận yêu cầu!");
                this.getRequestAll();
            }
        },

        // Tu Choi Yeu Cau
        async RejectRequest(request) {
            let data = request;
            data.TRANGTHAI = 2; // Đặt trạng thái thành "Đã từ chối"
            const result = await requestService.updateRequestById(request.MAYEUCAU, data);
            console.log('Rejected request:', result);
        },

        // Chi Tiet Yeu Cau
        async DetailRequest(request) {
            let dataRequest = { ...request };
            const maYeuCau = dataRequest.MAYEUCAU;
            const chitietyeucau = await chitietyeucauService.getMAYEUCAU(maYeuCau);

            if (chitietyeucau.length > 0) {
                const bookDetails = await Promise.all(
                    chitietyeucau.map(async (chiTiet) => {
                        const maSach = chiTiet.MASACH;
                        const book = await bookService.getId(maSach);
                        return book;
                    })
                );
                dataRequest.bookDetails = bookDetails;
            } else {
                dataRequest.bookDetails = [];
            }

            this.requestSelected = dataRequest;
            console.log('Request selected details:', this.requestSelected);
            this.showInfor = true;
        }
    },

    mounted() {
        this.getRequestAll();
    },

    watch: {
        showInfor(newVal) {
            document.body.classList.toggle('no-scroll', newVal);
        }
    }
}
</script>

<template>
    <header class="bookShowList-header">
        <h2 class="bookShowList--title dashboard-title">
            <i class="fa-solid fa-book-open-reader"></i>
            {{ choiceSideBar }}
        </h2>
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
                <td class="bookList_col" :class="ClassRequest[bookItem.TRANGTHAI]">{{ request[bookItem.TRANGTHAI] }}
                </td>
                <td class="bookList_col bookList_update">
                    <router-link :to="`${bookItem._id}/${icon.url}`" v-for="(icon) in colValueIcon">
                        <button class="icon-btn" v-if="icon.url === 'accept'" @click.prevent="AcceptRequest(bookItem)">
                            <i :class="[icon.icon, icon.id, 'icon', icon.color]"></i>
                        </button>

                        <button class="icon-btn" v-else-if="icon.url === 'cancel'"
                            @click.prevent="RejectRequest(bookItem)">
                            <i :class="[icon.icon, icon.id, 'icon', icon.color]"></i>
                        </button>

                        <button class="icon-btn" v-else @click.prevent="DetailRequest(bookItem)">
                            <i :class="[icon.icon, icon.id, 'icon', icon.color]"></i>
                        </button>

                    </router-link>
                </td>
            </tr>
        </table>
    </main>

    <!-- Modal -->
    <div class="modal" v-if="showInfor">
        <div class="modal_showInfor">
            <!-- Nội dung modal hiển thị thông tin chi tiết sách yeu cau sẽ được thêm vào đây -->
            <header class="modal-header">
                <h3 class="section--title modal--title">Thông tin chi tiết yêu cầu</h3>
                <p class="section_content donMuon--id">Mã yêu cầu: <span class="section_value">{{
                    requestSelected.MAYEUCAU
                        }}</span></p>
            </header>

            <main class="modal-main">
                <!-- Thông tin chi tiết sách mượn/trả sẽ được hiển thị ở đây -->
                <h4 class="modal-main--title section_content">Thông tin yêu cầu</h4>

                <div class="infor_user">
                    <div class="infor_user-main">
                        <li class="infor_user--items" v-for="(bookInfor, index) in infoRequest" :key="index">
                            <p class="section_content user_content" v-if="bookInfor">
                                {{ bookInfor.label }}: <span class="section_value"
                                    v-if="this.requestSelected[bookInfor.key] === undefined">{{ 'Chưa xác định'
                                    }}</span>
                                <span class="section_value" v-else>{{ this.requestSelected[bookInfor.key]
                                    }}</span>
                            </p>
                        </li>
                        <li class="infor_user--items">
                            <p class="section_content user_content">Trạng thái: <span class="section_value">{{
                                request[requestSelected.TRANGTHAI] }}</span></p>
                        </li>
                    </div>
                    <h4 class="modal-main--title section_content">Danh sách sách</h4>
                    <ol class="bookList mbt-32" start="1">
                        <li class="infor_user--items bookList_item ml-24"
                            v-for="(book, index) in requestSelected.bookDetails" :key="index">
                            <p class="section_content user_content" v-if="book">
                                <span class="section_value">{{ book.TENSACH }}</span>
                            </p>
                        </li>
                    </ol>
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
.bookShowList-header {
    margin-bottom: 16px;
    background-color: white;
    border-radius: 10px;
    padding: 16px;
}

.bookShowList-main {
    background-color: white;
    padding: 10px;
    border-radius: 10px;
}

.bookList_item {
    list-style: normal;
    font-size: 1.3rem;
    color: var(--text-black);
}

.modal_showInfor {
    width: 80vw;
}
</style>