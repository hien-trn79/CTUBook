<script>
import InputSearchAdmin from './InputSearch.admin.vue';
import TableList from './TableList.vue';
import { icon, iconColor } from '@/enums/icon.enum';
import requestService from '@/services/request.service';
import userService from '@/services/user.service';
import bookService from '@/services/book.service';
import { request, ClassRequest } from '@/enums/book.status';
import chitietyeucauService from '@/services/chitietyeucau.service';
export default {
    components: {
        InputSearchAdmin,
        TableList
    },

    data() {
        return {
            choiceSideBar: 'Quản lý sách',
            dataList: {},
            thead: ['STT', 'Mã Yêu Cầu', 'Email', 'Thời gian yêu cầu', 'Trạng thái', 'Số lượng'],
            colValue: ['_id', 'TENTAIKHOAN', 'SODIENTHOAI', 'TACGIA', 'THOIGIANDAT', 'SOQUYEN'],
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
            let infoRequests = [];
            let requestList = await requestService.getAll();
            requestList.forEach(async (request) => {
                let docGia = await userService.findByUsername(request.MADOCGIA);
                const maYeuCau = request._id;
                const chitietyeucau = await chitietyeucauService.getMAYEUCAU(maYeuCau);
                infoRequests.push({
                    ...request,
                    docGia: docGia[0],
                    chitietyeucau: { ...chitietyeucau }
                })
            });
            this.dataList = infoRequests;
            console.log(this.dataList);
        }
    },

    mounted() {
        this.getRequestAll();
    }
}
</script>

<template>
    <header class="bookShowList-header">
        <div class="bookList-header_area">
            <h2 class="bookShowList--title">{{ this.choiceSideBar }}</h2>
            <button class="btn btn-add_book" :hidden="true">
                <i class="fa-solid fa-plus icon"></i>
                Thêm sách mới
            </button>
        </div>
        <InputSearchAdmin />
    </header>
    <main class="bookShowList-main">
        <TableList :head-list-table="thead" :col-value-list="colValue" :books="dataList"
            :col-value-contact-icon="colValueIcon" :col-label="request" :col-class="ClassRequest" />
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
    height: 32px;
}
</style>