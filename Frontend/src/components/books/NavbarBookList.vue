<script>
export default {
    props: {
        bookFilters: { type: Array, default: [] }
    },

    emits: ["filterSubmit"],
    methods: {
        updateChecked(filter) {
            filter.check = !filter.check;
        },

        filterSubmit() {
            this.$emit('filterSubmit', this.bookFilters.filter((item) => item.check))
        }
    }
}
</script>

<template>
    <div class="navbar-input">
        <form action="#" class="" id="form_navbar-input">
            <div class="form-group">
                <input type="text" name="input-search" id="input-search" class="form-control input-search"
                    placeholder="Tìm kiếm...">
                <i class="fa-solid fa-magnifying-glass input-search--icon"></i>
            </div>
        </form>
    </div>
    <ul class="bookFilterList">
        <div class="filter">
            <button class="btn btn_filter" type="submit" @click="filterSubmit">Lọc</button>
        </div>
        <li class="bookFilterItem" v-for="(filterItem, index) in bookFilters" :key="index">
            <div class="bookFilterItem-group">
                <input type="checkbox" :name="filterItem.name" id="form-checkbox" class="form-checkbox"
                    @change="updateChecked(filterItem)" :checked="filterItem.check">
                <label :for="filterItem.name" class="form-label bookFilterItem-label">{{ filterItem.name }}</label>
            </div>
        </li>
    </ul>
</template>

<style scoped>
@import url(/css/components/form.css);

.navbar-input {
    padding: 12px 0px;
}

.form-group {
    position: relative;
}

.input-search--icon {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(-50%, -50%);
    font-size: var(--text-font-normal);
    color: #ccc;
}

.form-control {
    padding-right: 24px;
}

.bookFilterItem {
    display: block;
    border-radius: 5px;
    margin: 8px 0px;
}

.bookFilterItem-group {
    display: flex;
    align-items: center;
}

.bookFilterLink {
    font-size: var(--text-font-normal);
}

.filter {
    width: 100%;
    text-align: right;
}

.btn {
    padding: 4px 12px;
    border-radius: 5px;
    border: none;
}

.btn:hover {
    cursor: pointer;
    transform: scale(1.02);
}

.btn:active {
    transform: scale(0.99);
}

.btn_filter {
    min-width: 60px;
    text-align: center;
    color: white;
    background-color: var(--text-primary);
    font-size: var(--text-font-normal);
}

.bookFilterItem-label {
    font-weight: normal;
}
</style>