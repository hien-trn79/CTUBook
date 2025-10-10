<script>
import bookService from '@/services/book.service';

export default {
    data() {
        return {
            books: {},
            types: ['Giáo trình', 'Công nghệ', 'Nông nghiệp', 'Ngôn ngữ', 'Thể thao', 'Sức khỏe']
        }
    },

    methods: {
        async getBooksAll() {
            this.books = await bookService.getAll();
        }
    },

    mounted() {
        this.getBooksAll()
    }
}
</script>

<template>
    <table class="table form_search-input">
        <tr class="table-row">
            <th class="table-head form-group">
                <i class="fa-solid fa-magnifying-glass input_search--icon"></i>
                <input type="text" name="input-search" id="input_search" class="form-control"
                    placeholder="Nhập nội dung tìm kiếm ....">
            </th>
            <th class="table-head form-group">
                <label for="filter_status" class="form-label">Trạng thái</label>
            </th>
            <th class="table-head">
                <select class="form-select form-control" name="form-select">
                    <option value="TATCA">Tất cả</option>
                    <option value="DADUYET">Đã duyệt</option>
                    <option value="CHUADUYET">Chưa duyệt</option>
                    <option value="DAHUY">Đã hủy</option>
                </select>
            </th>
            <th class="table-head">
                <label for="filter_actor" class="form-label">Tác giả</label>
            </th>
            <th class="table-head">
                <select class="form-select form-control">
                    <option value="TATCA">Tất cả</option>
                    <option :value="bookItem.MANXB" v-for="(bookItem, index) in books" :key="index">{{ bookItem.MANXB }}
                    </option>
                </select>
            </th>
            <th class="table-head">
                <label for="filter_actor" class="form-label">Thể loại</label>
            </th>
            <th class="table-head">
                <select class="form-select form-control">
                    <option value="TATCA">Tất cả</option>
                    <option :value="typeItem" v-for="(typeItem, index) in types" :key="index">{{ typeItem }}
                    </option>
                </select>
            </th>
        </tr>
    </table>
</template>

<style scoped>
.table-head {
    min-width: 100px;
}

.form-control {
    width: 95%;
}

.form-group {
    position: relative;
    width: 100%;
}

.input_search--icon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    font-size: 1.6rem;
}
</style>