<script>

export default {
    props: {
        books: { type: Object },
        headListTable: { type: Array, default: [] },
        colValueList: { type: Array, default: [] },
        colValueContactIcon: { type: Array, default: [] },
        colClass: { type: Object, default: () => ({}) },
        colLabel: { type: Object, default: () => ({}) }
    },

    methods: {
        ColLabel(status) {
            return this.colLabel[status];
        },

        ColClass(status) {
            return this.colClass[status]
        }
    },

    mounted() {
    }
}
</script>

<template>
    <table class="bookList-table">
        <tr class="bookList_row row-head">
            <th class="bookList_head" v-for="theadItem in headListTable">{{ theadItem }}</th>
            <th class="bookList_head">Trạng thái</th>
            <th class="bookList_head">Thao tác</th>
        </tr>

        <tr class="bookList_row" v-if="colValueList.length > 0" v-for="(bookItem, index) in books" :key="index">
            <td class="bookList_col bookList_ten">{{ index + 1 }}</td>
            <td class="bookList_col bookList_ten" v-for="(colValueItem) in colValueList">{{
                bookItem[colValueItem] }}
            </td>
            <td class="bookList_col" :class="ColClass(bookItem.TRANGTHAI)">{{ ColLabel(bookItem.TRANGTHAI) }}</td>
            <td class="bookList_col bookList_update">
                <router-link :to="`${bookItem._id}/${icon.url}`" v-for="(icon) in colValueContactIcon">
                    <i :class="[icon.icon, icon.id, 'icon', icon.color]"></i>
                </router-link>
            </td>
        </tr>
    </table>
</template>

<style>
.bookShowList--title {
    font-size: 1.8rem;
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
    border-bottom: 1px solid #ececec;
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
    margin-right: 6px;
}

.bookList--icon:hover {
    cursor: pointer;
}

.bookList_update {
    min-width: 100px;
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
</style>