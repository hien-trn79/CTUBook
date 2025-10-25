<script>
import InputSearchAdmin from './InputSearch.admin.vue';
import TableList from './TableList.vue';
import { icon, iconColor } from '@/enums/icon.enum';
import userService from '@/services/user.service';
import muonService from '@/services/muon.service';
import { hinhthuc, trangthai, ClassTrangThai } from '@/enums/muon.enum';
export default {
    components: {
        InputSearchAdmin,
        TableList
    },

    data() {
        return {
            choiceSideBar: 'Quản lý Mượn - Trả',
            dataList: {},
            thead: ['STT', 'Mã độc giả', "Tên độc giả", 'Email', 'Số lượng sách', 'Thời gian mượn', 'Thời gian trả', 'Hình thức'],
            colValue: ['MADOCGIA', 'HOVATEN', 'EMAIL', 'SOQUYEN', 'THOIGIANMUON', 'THOIGIANTRA', 'HINHTHUC'],
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
            ],
            hinhthuc,
            trangthai,
            ClassTrangThai
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
            this.dataList.forEach(async (item) => {
                let user = await this.getUser(item.MADOCGIA)
                item['HOVATEN'] = user.HOLOT + " " + user.TEN;
                item['HINHTHUC'] = hinhthuc[item.HINHTHUC]
            })

        }
    },

    mounted() {
        this.getDataAll()
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
            :col-value-contact-icon="colValueIcon" :col-label="trangthai" :col-class="ClassTrangThai" />
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