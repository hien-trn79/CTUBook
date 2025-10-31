<script>
export default {
    props: {
        notification: { type: Object, default: () => ({}) },
        id: { type: String, default: '' },
        bookSelected: { type: Object, default: () => ({}) }
    },

    methods: {
        closeModal() {
            this.$emit('close-modal', false);
        },

        removeBook() {
            this.$emit('remove-book-method', this.bookSelected._id);
            this.closeModal();
        }
    },

    mounted() {
    }
}
</script>

<template>
    <div id="modal">
        <div class="modal-noti">
            <header class="modal-header">
                <h2 class="modal--title">{{ notification.title }}</h2>
                <p class="modal--content modal-book_selected">
                    <img :src="this.bookSelected.IMAGE" alt="" class="modal-img">
                    <strong>{{ this.bookSelected.TENSACH }}</strong>
                </p>
            </header>
            <main class="modal-main">
                <p class="modal--content">{{ notification.content }}</p>
                <p class="modal--description">{{ notification.description }}</p>
            </main>
            <footer class="modal-footer">
                <button class="btn btn--accept" @click="removeBook(this.id)">Xóa</button>
                <button class="btn btn--close" @click="closeModal">Đóng</button>
            </footer>
            <button class="btn-cross" @click="closeModal">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    </div>

</template>

<style scoped>
.modal-noti {
    position: fixed;
    left: 50%;
    top: 0%;
    transform: translateX(-50%);
    background-color: white;
    border-radius: 7px;
    min-width: 300px;
    max-width: 600px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 24px;
    z-index: 11;
}

.modal--title {
    font-size: var(--text-font-title2);
    padding-bottom: 10px;
    color: rgb(12, 46, 141);
}

.modal-img {
    width: 50px;
    height: auto;
    margin-right: 8px;
}

.modal-book_selected {
    display: flex;
    align-items: center;
    padding: 12px 0px;
}

.modal--content,
.modal--description {
    font-size: var(--text-font-normal);
    margin-bottom: 8px;
    color: #333;
}

.modal-footer {
    border-top: 1px solid #eee;
    padding-top: 24px;
    text-align: right;
}

.btn-cross {
    position: absolute;
    top: 5%;
    right: 2%;
    background-color: transparent;
    border: none;
    font-size: 1.7rem;
}

.btn-cross:hover {
    cursor: pointer;
    color: rgb(202, 3, 3);
}

.btn {
    min-width: 80px;
    margin-right: 8px;
    font-size: var(--text-font-normal);
}

.btn--close {
    background-color: rgb(202, 3, 3);
    color: white;
}

.btn--accept {
    background-color: rgb(12, 107, 231);
    color: white;
}
</style>