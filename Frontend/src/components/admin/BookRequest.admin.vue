<script>
import InputSearchAdmin from './InputSearch.admin.vue';
import TableList from './TableList.vue';
import { icon, iconColor } from '@/enums/icon.enum';
import requestService from '@/services/request.service';
import userService from '@/services/user.service';
import { request, ClassRequest } from '@/enums/book.status';
import chitietyeucauService from '@/services/chitietyeucau.service';
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
            ClassRequest
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
                            SOQUYEN: chitietyeucau?.[0]?.SOLUONG || 0,
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

        async AcceptRequest(request) {
            let data = request;
            data.TRANGTHAI = 1; // Đặt trạng thái thành "Đã chấp nhận"
            console.log('Request before accept:', data);
            const result = await requestService.updateRequestById(request.MAYEUCAU, data);
            console.log('Accepted request:', result);
        }
    },

    mounted() {
        this.getRequestAll();
    }
}
</script>

<template>
    <header class="bookShowList-header">
        <h2 class="bookShowList--title">{{ choiceSideBar }}</h2>
    </header>
    <main class="bookShowList-main">
        <!-- <TableList :head-list-table="thead" :col-value-list="colValue" :books="dataList"
            :col-value-contact-icon="colValueIcon" :col-label="request" :col-class="ClassRequest"
            @accept-request="AcceptRequest" /> -->
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

                        <button class="icon-btn" v-else>
                            <i :class="[icon.icon, icon.id, 'icon', icon.color]"></i>
                        </button>

                    </router-link>
                </td>
            </tr>
        </table>
    </main>
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
</style>