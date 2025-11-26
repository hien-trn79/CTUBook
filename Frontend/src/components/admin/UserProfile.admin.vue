<script>
import muonService from '@/services/muon.service';
import requestService from '@/services/request.service';
import chitietdonmuonService from '@/services/chitietdonmuon.service';
import { getCurrentAdmin, getCurrentUser } from '@/utils/auth.util.js';
import userService from '@/services/user.service';

export default {
    data() {
        return {
            currentUser: null,
            userInfo: [
                {
                    key: 'USERNAME',
                    label: 'Tên tài khoản'
                },
                {
                    key: 'HOVATEN',
                    label: 'Họ và tên'
                },
                {
                    key: 'EMAIL',
                    label: 'Email'
                },
                {
                    key: 'DIENTHOAI',
                    label: 'Số điện thoại'
                },
                {
                    key: 'DIACHI',
                    label: 'Địa chỉ'
                },
                {
                    key: 'NGAYSINH',
                    label: 'Ngày sinh'
                },
                {
                    key: 'PHAI',
                    label: 'Phái'
                },
            ],
            stats: {
                donMuon: 0,
                yeuCau: 0,
                sachDangMuon: 0
            },
            isLoadingStats: false
        }
    },

    methods: {
        // returns human-readable label for account type
        getTypeLabel(user) {
            if (!user) return 'Chưa rõ';
            const v = user.LOAITK;
            if (v === 0 || v === '0' || v === 'reader' || v === 'docgia') return 'Độc giả';
            if (v === 1 || v === '1' || v === 'admin' || v === 'quantri') return 'Quản trị viên';
            return 'Khác';
        },

        // returns a CSS class for styling the badge based on account type
        getTypeClass(user) {
            if (!user) return 'badge-unknown';
            const v = user.LOAITK;
            if (v === 0 || v === '0' || v === 'reader' || v === 'docgia') return 'badge-reader';
            if (v === 1 || v === '1' || v === 'admin' || v === 'quantri') return 'badge-admin';
            return 'badge-unknown';
        },

        // backward-compatible wrapper
        getTypeUser(user) {
            return this.getTypeLabel(user);
        },

        async getCurrentUser() {
            try {
                let user = getCurrentAdmin();
                user = await userService.findByUsername(user.id);
                if (user.length > 0) {
                    this.currentUser = user[0];
                }
            } catch (error) {
                console.error('Error parsing currentUser from localStorage', error);
                this.currentUser = null;
            }
        },

        async loadStats() {
            if (!this.currentUser || !this.currentUser._id) return;
            this.isLoadingStats = true;
            try {
                // tổng số đơn mượn
                const tickets = await muonService.getByMaDocGia(this.currentUser._id);
                this.stats.donMuon = Array.isArray(tickets) ? tickets.length : 0;

                // tổng số yêu cầu
                const requests = await requestService.getByMaDocGia(this.currentUser._id);
                this.stats.yeuCau = Array.isArray(requests) ? requests.length : 0;

                // số sách đang mượn: tính các ticket có TRANGTHAI === 1
                const activeTickets = (Array.isArray(tickets) ? tickets : []).filter(t => Number(t.TRANGTHAI) === 1);
                // fetch details for each active ticket in parallel
                const detailPromises = activeTickets.map(t => chitietdonmuonService.getIDDonMuon(t._id).catch(() => []));
                const details = await Promise.all(detailPromises);
                let totalBorrowed = 0;
                details.forEach(arr => {
                    if (Array.isArray(arr)) {
                        arr.forEach(d => {
                            totalBorrowed += Number(d.SOLUONG || 0);
                        });
                    }
                });
                this.stats.sachDangMuon = totalBorrowed;
            } catch (err) {
                console.error('Error loading stats', err);
            } finally {
                this.isLoadingStats = false;
            }
        },

        onEditProfile() {
            // emit event so parent can handle navigation/editing
            this.$emit('edit-profile', this.currentUser);
        },

        getValue(key) {
            if (!this.currentUser) return '';
            // special handling for some keys
            if (key === 'FULLNAME') return this.currentUser.FULLNAME || `${this.currentUser.HOLOT || ''} ${this.currentUser.TEN || ''}`.trim();
            if (key === 'NGAYSINH') return this.formatDate(this.currentUser.NGAYSINH);
            return this.currentUser[key] ?? '';
        },

        formatDate(dateString) {
            if (!dateString) return '';
            try {
                const d = new Date(dateString);
                return d.toLocaleDateString('vi-VN');
            } catch (e) {
                return dateString;
            }
        }
    },

    async mounted() {
        await this.getCurrentUser();
        // load stats after currentUser is available
        await this.loadStats();
    }
}
</script>

<template>
    <div class="userPage">
        <article class="userPage-article">
            <header class="userPage-header">
                <h3 class="userPage-header--title">Thông tin độc giả</h3>
                <router-link :to="`/admin/${getValue('_id')}/updateAdmin`" class="edit-btn">Chỉnh sửa</router-link>
            </header>

            <main class="userPage-main">
                <div class="userTop">
                    <div class="avatarWrap">
                        <img :src="(currentUser && currentUser.IMAGE) ? currentUser.IMAGE : 'https://res.cloudinary.com/dw7aqqwti/image/upload/v1761294585/UserDefault_vch7wc.jpg'"
                            alt="" class="userPage-img">
                        <div class="userType" :class="getTypeClass(currentUser)">
                            <span class="badge-icon" v-if="getTypeClass(currentUser) === 'badge-admin'">👑</span>
                            <span class="badge-icon" v-else>📚</span>
                            <span class="badge-label">{{ getTypeLabel(currentUser) }}</span>
                        </div>
                    </div>
                </div>

                <div class="userInfor">
                    <ul class="userInfor-list">
                        <li class="userInfor--item" v-for="infor in userInfo" :key="infor.key">
                            <p class="section_content userInfor_content">
                                {{ infor.label }}: <span class="section_value">{{ getValue(infor.key) }}</span>
                            </p>
                        </li>
                    </ul>
                </div>
            </main>
        </article>

        <!-- <aside class="userPage-aside">
            <header class="userPage-header userPage-aside-header">
                <h3 class="userPage-header--title">Lưu trữ & Thống kê</h3>
            </header>

            <div class="stats-wrap">
                <div class="stat-card">
                    <div class="stat-icon">📁</div>
                    <div class="stat-body">
                        <div class="stat-label">Số đơn mượn</div>
                        <div class="stat-value">{{ stats.donMuon }}</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">📝</div>
                    <div class="stat-body">
                        <div class="stat-label">Số yêu cầu</div>
                        <div class="stat-value">{{ stats.yeuCau }}</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">📚</div>
                    <div class="stat-body">
                        <div class="stat-label">Sách đang mượn</div>
                        <div class="stat-value">{{ stats.sachDangMuon }}</div>
                    </div>
                </div>

                <div v-if="isLoadingStats" class="stats-loading">Đang tải thống kê...</div>
            </div>
        </aside> -->
    </div>
</template>

<style scoped>
.userPage {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}


.userType {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.95rem;
    color: white;
    padding: 6px 10px;
    text-align: center;
    border-radius: 999px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.12);
}

.avatarWrap {
    position: relative;
    display: inline-block;
}

.userPage-img {
    height: 120px;
    width: 120px;
    border-radius: 50%;
    display: block;
    object-fit: cover;
    border: 4px solid #fff;
}

.userType {
    position: absolute;
    right: -6px;
    bottom: -6px;
    transform: translate(0, 0);
}

.badge-admin {
    background: linear-gradient(135deg, #ff7a18, #af002d);
}

.badge-reader {
    background: linear-gradient(135deg, #00b09b, #96c93d);
}

.badge-unknown {
    background: linear-gradient(135deg, #6a6a6a, #bdbdbd);
}

.badge-icon {
    font-size: 1rem;
    line-height: 1;
}

.badge-label {
    font-weight: 600;
    font-size: 1.2rem;
    letter-spacing: 0.8px;
}

.userPage-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border-bottom: 2px solid rgb(3, 93, 250);
    margin-bottom: 12px;
}

.userPage-header--title {
    width: fit-content;
    padding: 8px;
    color: white;
    background-color: rgb(3, 93, 250);
    font-size: var(--text-font-sm);
    border-top-right-radius: 7px;
    border-top-left-radius: 7px;
}

.userPage-article {
    grid-area: userPage-article;
    padding: 20px;
    border-left: 2px solid var(--text-primary);
    background-color: white;
    width: 75vw;
    border-radius: 10px;
}

.userPage-main {
    padding: 24px;
    text-align: center;
}

.userPage-img {
    height: 120px;
    width: 120px;
    border-radius: 50%;
}

.userPage-aside {
    grid-area: userPage-aside;
    padding: 20px;
    background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
}

.userPage-aside-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.edit-btn {
    background: linear-gradient(90deg, #0066cc, #004fa3);
    color: #fff;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1.3rem;
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.edit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 102, 204, 0.35);
    background: linear-gradient(90deg, #0052a3, #003875);
}

.edit-btn:active {
    transform: translateY(0);
}

.stats-wrap {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
}

.stat-card {
    display: flex;
    gap: 14px;
    align-items: center;
    background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 102, 204, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    border-color: rgba(0, 102, 204, 0.2);
}

.stat-icon {
    font-size: 2rem;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #e6f0ff 0%, #f0f6ff 100%);
    border-radius: 12px;
    transition: transform 0.3s ease;
}

.stat-card:hover .stat-icon {
    transform: scale(1.1) rotate(5deg);
}

.stat-body {
    display: flex;
    flex-direction: column;
}

.stat-label {
    font-size: 1rem;
    color: #6b7280;
    font-weight: 500;
    margin-bottom: 4px;
}

.stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #0b5ed7;
    line-height: 1;
}

/* Per-stat color variants */
.stat-card:nth-child(1) .stat-icon {
    background: linear-gradient(135deg, #e6f0ff 0%, #cce0ff 100%);
}

.stat-card:nth-child(1) .stat-value {
    color: #0b5ed7;
}

.stat-card:nth-child(2) .stat-icon {
    background: linear-gradient(135deg, #fff7e6 0%, #ffe8cc 100%);
}

.stat-card:nth-child(2) .stat-value {
    color: #d97706;
}

.stat-card:nth-child(3) .stat-icon {
    background: linear-gradient(135deg, #e9f7ee 0%, #d1f0db 100%);
}

.stat-card:nth-child(3) .stat-value {
    color: #16a34a;
}

.stats-loading {
    color: #6b7280;
    font-size: 0.95rem;
    text-align: center;
    margin-top: 8px;
    font-style: italic;
}

/* Responsive layout */
@media (max-width: 920px) {
    .userPage {
        grid-template-areas: 'userPage-article' 'userPage-aside';
        grid-template-columns: 1fr;
        min-width: 100%;
    }

    .userPage-article {
        border-right: none;
        border-bottom: 2px solid #e5e7eb;
    }

    .stats-wrap {
        gap: 10px;
    }

    .stat-card {
        padding: 14px;
    }
}

/* Smooth user info list */
.userInfor-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.userInfor--item {
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s ease;
}

.userInfor_content {
    font-size: 1.4rem;
    color: #374151;
    font-weight: bold;
}

.section_value {
    color: #374151;
    font-weight: normal;
    padding-left: 12px;
}
</style>