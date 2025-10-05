<script>
export default {
    props: {
        bookFilters: { type: Array, default: [] }
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
        <li class="bookFilterItem" v-for="(filterItem, index) in bookFilters" :key="index">
            <div class="bookFilterItem-group">
                <input type="checkbox" :name="filterItem.name" id="form-checkbox" class="form-checkbox">
                <label :for="filterItem.name" class="form-label bookFilterItem-label">{{ filterItem.name }}</label>
            </div>
        </li>
    </ul>
</template>

<style>
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
    padding: 6px;
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
</style>