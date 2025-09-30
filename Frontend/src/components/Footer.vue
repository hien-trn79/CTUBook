<script>
export default {
    data() {
        return {
            infor: [
                {
                    name: 'Thông tin',
                    content: ['Liên hệ hỗ trợ', 'Thông tin', 'Giới thiệu', 'Hướng dẫn độc giả']
                },
                {
                    name: 'Chính sách',
                    content: ['Chính sách sinh viên', 'Chính sách cán bộ, viên chức', 'Chính sách độc giả tự do']
                }
            ],
            lienHe: {
                name: 'Liên hệ',
                content: [
                    {
                        icon: 'fa-solid fa-location-dot',
                        text: 'Khu II, Đại học Cần Thơ, Đường 3/2, Phường Ninh Kiều, Thành phố Cần Thơ'
                    },
                    {
                        icon: 'fa-solid fa-phone',
                        text: '(0292)3839981'
                    },
                    {
                        icon: 'fa-solid fa-envelope',
                        text: 'CTUBook@ctu.edu.vn'
                    }
                ]
            }
        }
    }

}
</script>

<template>
    <div class="footer-main">
        <div class="footer--left">
            <div class="footer_logo">
                <img src="/CTUBook_Logo.png" alt="" class="footer_logo-img">
                <h2 class="footer--title">CTUBOOK</h2>
                <p class="footer_content">Nhà xuất bản Đại học Cần Thơ</p>
            </div>
        </div>

        <div class="footer--right">
            <div class="infor_read" v-for="(inforItem, index) in infor" :key="index">
                <h2 class="footer--title">{{ inforItem.name }}</h2>
                <ul class="infor_list infor_list--1">
                    <li class="infor_item" v-for="(item, index) in inforItem.content" :key="index">
                        <a href="#" class="infor--link footer_content">{{ item }}</a>
                    </li>
                </ul>
            </div>

            <div class="infor_read">
                <h2 class="footer--title">{{ lienHe.name }}</h2>
                <ul class="infor_list infor_list--1">
                    <li class="infor_item" v-for="(lienHeItem, index) in lienHe.content" :key="index">
                        <a href="#" class="infor--link footer_content">
                            <i :class="['infor__icon', lienHeItem.icon]"></i>
                            {{ lienHeItem.text }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style>
@import url('/css/components/footer.css');
</style>