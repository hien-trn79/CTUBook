<script>
import BookService from '@/services/book.service.js';
import RequestService from '@/services/request.service.js';
import UserService from '@/services/user.service.js';
import MuonService from '@/services/muon.service.js';

export default {
    data() {
        return {
            totalBook: 0,
            totalRequest: 0,
            totalUser: 0,
            totalBorrow: 0,
            isLoading: true
        }
    },
    methods: {
        async getTotalBooks() {
            try {
                const result = (await BookService.getCount()).count;
                this.totalBook = result;
            } catch (error) {
                console.error('Error fetching total books:', error);
                this.totalBook = 0;
            }
        },

        async getTotalRequests() {
            try {
                const result = (await RequestService.getCount()).count;
                this.totalRequest = result;
            } catch (error) {
                console.error('Error fetching total requests:', error);
                this.totalRequest = 0;
            }
        },

        async getTotalUsers() {
            try {
                const users = await UserService.getAll();
                this.totalUser = Array.isArray(users) ? users.length : 0;
            } catch (error) {
                console.error('Error fetching total users:', error);
                this.totalUser = 0;
            }
        },

        async getTotalBorrows() {
            try {
                const borrows = await MuonService.getAll();
                this.totalBorrow = Array.isArray(borrows) ? borrows.length : 0;
            } catch (error) {
                console.error('Error fetching total borrows:', error);
                this.totalBorrow = 0;
            }
        },

        async loadAllData() {
            this.isLoading = true;
            await Promise.all([
                this.getTotalBooks(),
                this.getTotalRequests(),
                this.getTotalUsers(),
                this.getTotalBorrows()
            ]);
            this.isLoading = false;
        }
    },

    mounted() {
        this.loadAllData();
    }

}
</script>

<template>
    <div class="dashboard-admin">
        <header class="dashboard-header">
            <div class="dashboard-header-content">
                <h1 class="dashboard-title">
                    <i class="fa-solid fa-chart-line"></i>
                    Tổng quan hệ thống
                </h1>
                <p class="dashboard-subtitle">Thống kê và quản lý thư viện</p>
            </div>
            <button class="btn-refresh" @click="loadAllData" :disabled="isLoading">
                <i class="fa-solid fa-rotate" :class="{ 'fa-spin': isLoading }"></i>
                {{ isLoading ? 'Đang tải...' : 'Làm mới' }}
            </button>
        </header>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Đang tải dữ liệu...</p>
        </div>

        <!-- Dashboard Stats -->
        <div v-else class="dashboard_list">
            <!-- Books Card -->
            <div class="dashboard_item dashboard_item--books">
                <div class="dashboard_item-icon">
                    <i class="fa-solid fa-book"></i>
                </div>
                <div class="dashboard_item-content">
                    <h3 class="dashboard_item--title">Tổng số sách</h3>
                    <span class="dashboard_item--value">{{ totalBook }}</span>
                    <p class="dashboard_item--desc">Sách trong thư viện</p>
                </div>
            </div>

            <!-- Requests Card -->
            <div class="dashboard_item dashboard_item--requests">
                <div class="dashboard_item-icon">
                    <i class="fa-solid fa-file-circle-plus"></i>
                </div>
                <div class="dashboard_item-content">
                    <h3 class="dashboard_item--title">Yêu cầu mượn</h3>
                    <span class="dashboard_item--value">{{ totalRequest }}</span>
                    <p class="dashboard_item--desc">Đang chờ xử lý</p>
                </div>
            </div>

            <!-- Borrows Card -->
            <div class="dashboard_item dashboard_item--borrows">
                <div class="dashboard_item-icon">
                    <i class="fa-solid fa-book-open-reader"></i>
                </div>
                <div class="dashboard_item-content">
                    <h3 class="dashboard_item--title">Đơn mượn</h3>
                    <span class="dashboard_item--value">{{ totalBorrow }}</span>
                    <p class="dashboard_item--desc">Tổng đơn mượn sách</p>
                </div>
            </div>

            <!-- Users Card -->
            <div class="dashboard_item dashboard_item--users">
                <div class="dashboard_item-icon">
                    <i class="fa-solid fa-users"></i>
                </div>
                <div class="dashboard_item-content">
                    <h3 class="dashboard_item--title">Tài khoản</h3>
                    <span class="dashboard_item--value">{{ totalUser }}</span>
                    <p class="dashboard_item--desc">Người dùng đăng ký</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dashboard-admin {
    min-height: 100vh;
}

/* Header */
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding: 24px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.dashboard-header-content {
    flex: 1;
}

.dashboard-title {
    font-size: 2.4rem;
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.dashboard-title i {
    color: #3b82f6;
}

.dashboard-subtitle {
    font-size: 1.4rem;
    color: #64748b;
    margin: 0;
}

.btn-refresh {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: linear-gradient(90deg, #3b82f6, #2563eb);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.4rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-refresh:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-refresh:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Loading State */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    gap: 16px;
}

.loading-state i {
    font-size: 3rem;
    color: #3b82f6;
}

.loading-state p {
    font-size: 1.6rem;
    color: #64748b;
}

/* Dashboard Stats Grid */
.dashboard_list {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin-top: 24px;
}

/* Dashboard Item Card */
.dashboard_item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 20px;
    background: white;
    border-radius: 10px;
    padding: 26px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    min-width: 220px;
}

.dashboard_item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, currentColor, transparent);
    opacity: 0.8;
}

.dashboard_item:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* Icon Container */
.dashboard_item-icon {
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    font-size: 2.8rem;
    transition: transform 0.3s ease;
    flex-shrink: 0;
}

.dashboard_item:hover .dashboard_item-icon {
    transform: scale(1.1) rotate(5deg);
}

/* Content */
.dashboard_item-content {
    flex: 1;
}

.dashboard_item--title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
}

.dashboard_item--value {
    font-size: 3.2rem;
    font-weight: 800;
    line-height: 1;
    display: block;
    margin-bottom: 6px;
}

.dashboard_item--desc {
    font-size: 1.2rem;
    color: #94a3b8;
    margin: 0;
}

/* Card Variants */
.dashboard_item--books {
    color: #3b82f6;
}

.dashboard_item--books .dashboard_item-icon {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #2563eb;
}

.dashboard_item--books .dashboard_item--value {
    color: #1e40af;
}

.dashboard_item--requests {
    color: #f59e0b;
}

.dashboard_item--requests .dashboard_item-icon {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #d97706;
}

.dashboard_item--requests .dashboard_item--value {
    color: #b45309;
}

.dashboard_item--borrows {
    color: #10b981;
}

.dashboard_item--borrows .dashboard_item-icon {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #059669;
}

.dashboard_item--borrows .dashboard_item--value {
    color: #047857;
}

.dashboard_item--users {
    color: #8b5cf6;
}

.dashboard_item--users .dashboard_item-icon {
    background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
    color: #7c3aed;
}

.dashboard_item--users .dashboard_item--value {
    color: #6d28d9;
}

/* Responsive */
@media (max-width: 768px) {
    .dashboard-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
    }

    .dashboard_list {
        grid-template-columns: 1fr;
    }

    .dashboard-title {
        font-size: 2rem;
        justify-content: center;
    }
}
</style>