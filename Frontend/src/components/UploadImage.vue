<script>
export default {
    props: {
        image: { type: String, defautl: null }
    },

    data() {
        return {
            previewUrl: null,
        }
    },

    methods: {
        uploadImage() {
            this.$refs.formInput.click();
        },

        handlerUpload() {
            let file = event.target.files[0];
            this.$emit('file', file);

            this.previewUrl = URL.createObjectURL(file);
        },

        getImageUrl() {
            if (this.image) {
                this.previewUrl = this.image;
            }
        }
    },

    mounted() {
        this.getImageUrl();
    }
}
</script>

<template>
    <div class="form-group form_image-header">
        <label for="book-image" class="form-label" style="text-align: left;">Hình ảnh</label>
        <div class="form_image-main">
            <input type="file" class="form-input input_upload" ref="formInput" hidden="true" @change="handlerUpload"
                name="IMAGE">
            <button class="btn btn-upload" @click.prevent="uploadImage">Chọn ảnh</button>
            <div class="image_area">
                <i class="fa-solid fa-cloud-arrow-up form_upload--icon" v-if="!this.previewUrl"></i>
                <img :src="this.previewUrl" alt="" class="book-img" v-if="this.previewUrl">
            </div>
        </div>
    </div>
</template>

<style scoped>
.form_image-header {
    width: 100%;
    text-align: center;
}

.form_image-main {
    display: flex;
    align-items: center;
}

.image_area {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    width: 180px;
    background-color: rgba(237, 242, 246, 0.259);
    border-radius: 7px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1);
    margin-left: 24px;
    overflow: hidden;
}

.form_upload--icon {
    font-size: 4rem;
    color: rgb(179, 219, 255);
}

.book-img {
    width: 100%;
}
</style>