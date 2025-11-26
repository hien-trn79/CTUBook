<script>

import bookService from '@/services/book.service';
import chitietdonmuonService from '@/services/chitietdonmuon.service';
import muonService from '@/services/muon.service';

import TicketBook from '@/components/history/TicketBook.vue';
import { getCurrentUser } from '@/utils/auth.util';
import userService from '@/services/user.service';

export default {
    components: {
        TicketBook
    },

    data() {
        return {
            tickets: [],
            currentUser: null,
            isLoading: true,
            error: null
        }
    },

    methods: {
        async getDonMuon() {
            try {
                // lay nguoi dung hien tai
                let currentUserData = getCurrentUser();
                currentUserData = await userService.findByUsername(currentUserData.id);

                if (!currentUserData) {
                    throw new Error('Có lỗi khi xem lịch sử đơn mượn.');
                }


                // Xử lý cả trường hợp array và object
                this.currentUser = currentUserData[0];
                if (!this.currentUser || !this.currentUser._id) {
                    throw new Error('Thông tin người dùng không hợp lệ.');
                }

                // lay don muon cua doc gia hien tai
                const data = await muonService.getByMaDocGia(this.currentUser._id);
                this.tickets = data || [];
            } catch (error) {
                console.error('Lỗi khi lấy đơn mượn:', error);
                this.error = error.message;
                this.tickets = [];
            }
        },

        async updateDataTickets() {
            try {
                // Lấy lại danh sách đơn mượn
                this.tickets = await muonService.getByMaDocGia(this.currentUser._id);

                // Xử lý từng đơn mượn
                const ticketPromises = this.tickets.map(async (ticket) => {
                    // Khởi tạo mảng books
                    ticket.books = [];

                    // Lấy chi tiết đơn mượn
                    const maDonMuon = ticket._id;
                    const chitietdonmuon = await chitietdonmuonService.getIDDonMuon(maDonMuon);

                    // Lấy thông tin sách cho từng chi tiết (sử dụng Promise.all để chờ tất cả)
                    const bookPromises = chitietdonmuon.map(async (chitiet) => {
                        const maSach = chitiet.MASACH;
                        const book = await bookService.getId(maSach);
                        return {
                            book: book,
                            SOLUONG: chitiet.SOLUONG
                        };
                    });

                    // Đợi tất cả sách được load xong
                    ticket.books = await Promise.all(bookPromises);

                    return ticket;
                });

                // Đợi tất cả tickets được xử lý xong
                await Promise.all(ticketPromises);

            } catch (error) {
                console.error('Lỗi khi cập nhật thông tin đơn mượn:', error);
                this.error = 'Không có thông tin đơn mượn.';
            }
        },

        getTotalBooks() {
            let sum = 0;
            this.tickets.forEach(ticket => {
                if (ticket.books && Array.isArray(ticket.books)) {
                    sum += ticket.books.length;
                }
            });
            return sum;
        }
    },

    async mounted() {
        try {
            this.isLoading = true;
            await this.getDonMuon();
            await this.updateDataTickets();
        } catch (error) {
            console.error('Lỗi khi khởi tạo trang:', error);
        } finally {
            this.isLoading = false;
        }
    }
}
</script>
<template>
    <div class="history_page">
        <h2 class="section--title history--title">Lịch sử đơn mượn</h2>

        <!-- Loading state -->
        <div v-if="isLoading" class="loading-container">
            <i class="fa-solid fa-spinner fa-spin loading-icon"></i>
            <p>Đang tải lịch sử đơn mượn...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="error-container">
            <i class="fa-solid fa-exclamation-circle error-icon"></i>
            <p class="error-message">{{ error }}</p>
        </div>

        <!-- Content -->
        <article v-else class="history_page-main">
            <section class="history_page--left">
                <!-- Empty state -->
                <div v-if="tickets.length === 0" class="empty-state">
                    <i class="fa-regular fa-folder-open empty-icon"></i>
                    <p class="empty-message">Bạn chưa có đơn mượn nào</p>
                </div>

                <!-- Tickets list -->
                <div v-else class="tickets_list" v-for="(ticket, index) in tickets" :key="ticket._id || index">
                    <TicketBook :ticket="ticket" />
                </div>
            </section>

            <section class="tickets_info history_page--right">
                <div class="info-card">
                    <h3 class="info-title">Thông tin chi tiết</h3>
                    <p class="info-content">Tổng số đơn mượn: <strong>{{ tickets.length }}</strong></p>
                    <p class="info-content">Tổng số sách đã mượn: <strong class="text-red">{{ getTotalBooks()
                            }}</strong></p>
                </div>
            </section>
        </article>
    </div>
</template>

<style>
.history_page {
    min-height: 100vh;
    width: 90vw;
}

.history--title {
    font-size: var(--text-font-title2);
    width: fit-content;
    text-align: left;
    padding: 8px 4px 6px 4px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--text-primary);
}

.history_page-main {
    display: grid;
    grid-template-areas: 'history_page--left history_page--right';
    grid-template-columns: 2fr 1fr;
    column-gap: 12px;
}

.history_page--left {
    grid-area: history_page--left;
}

.history_page--right {
    grid-area: history_page--right;
}

/* Loading state */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
}

.loading-icon {
    font-size: 3rem;
    color: var(--color-ctu, #0066cc);
}

.loading-container p {
    font-size: 1.4rem;
    color: #666;
}

/* Error state */
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
    padding: 20px;
}

.error-icon {
    font-size: 3rem;
    color: #e74c3c;
}

.error-message {
    font-size: 1.4rem;
    color: #e74c3c;
    text-align: center;
}

/* Empty state */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
    background-color: white;
    border-radius: 8px;
    padding: 40px;
}

.empty-icon {
    font-size: 4rem;
    color: #bdc3c7;
}

.empty-message {
    font-size: 1.6rem;
    color: #7f8c8d;
}

/* Info card */
.info-card {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-title {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 16px;
    color: #0066cc;
}

.info-content {
    font-size: var(--text-font-normal);
    color: #555;
    margin-bottom: 8px;
}
</style>