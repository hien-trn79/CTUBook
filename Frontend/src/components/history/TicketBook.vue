<script>
import { hinhthuc, trangthai, ClassTrangThai } from '../../enums/muon.enum.js';
export default {
    props: {
        ticket: {
            type: Object,
            default: () => ({
                _id: '',
                THOIGIANMUON: '',
                THOIGIANTRA: '',
                books: [],

            })
        }
    },

    data() {
        return {
            trangthai,
            hinhthuc,
            ClassTrangThai
        }
    },

    computed: {
        // Tính tổng số lượng sách trong đơn mượn
        totalQuantity() {
            if (!this.ticket.books || this.ticket.books.length === 0) {
                return 0;
            }
            return this.ticket.books.reduce((sum, item) => {
                return sum + (item.SOLUONG || 0);
            }, 0);
        },

        // Format ngày tháng
        formattedStartDate() {
            return this.formatDate(this.ticket.THOIGIANMUON);
        },

        formattedEndDate() {
            return this.formatDate(this.ticket.THOIGIANTRA);
        }
    },

    methods: {
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            } catch (error) {
                return dateString;
            }
        },

        // Lấy hình ảnh sách, nếu không có thì dùng ảnh mặc định
        getBookImage(book) {
            return book?.IMAGE || '/CTUBook_Logo.png';
        },

        getStatusTicket(trangthai) {
            return this.trangthai[trangthai] || 'Không xác định';
        }
    },

    mounted() {
        console.log('ticket in TicketBook:', this.ticket);
    }
}
</script>

<template>
    <div class="ticket_book">
        <div class="ticket_status" :class="ClassTrangThai[ticket.TRANGTHAI]">
            {{ getStatusTicket(ticket.TRANGTHAI) }}
        </div>
        <div class="ticket_book-header">
            <h3 class="ticket--title">Đơn mượn</h3>
            <p class="ticket_content ticket_idDonMuon">Mã: {{ ticket._id }}</p>
        </div>

        <div class="ticket_book-main">
            <div class="ticket_info">
                <p class="ticket_content">
                    <i class="ticket--icon fa-regular fa-calendar"></i>
                    <span class="ticket_start">{{ formattedStartDate }}</span>
                    <span class="ticket_separator">→</span>
                    <span class="ticket_end">{{ formattedEndDate }}</span>
                </p>
                <p class="ticket_content">
                    <strong>Tổng số lượng:</strong>
                    <span class="ticket_quantity">{{ totalQuantity }} quyển</span>
                </p>
            </div>
            <!-- Danh sách sách trong đơn mượn -->
            <div v-if="ticket.books && ticket.books.length > 0" class="ticket_books-list">
                <h4 class="books-list_title">Sách đã mượn:</h4>
                <div class="book_item" v-for="(item, index) in ticket.books" :key="index">
                    <img :src="getBookImage(item.book)" alt="Book cover" class="book_item-img">
                    <div class="book_item-info">
                        <p class="book_name">{{ item.book?.TENSACH || 'N/A' }}</p>
                        <p class="book_author">{{ item.book?.TACGIA || 'N/A' }}</p>
                        <p class="book_quantity">Số lượng: <strong>{{ item.SOLUONG }}</strong></p>
                    </div>

                </div>
            </div>

            <!-- Trạng thái đang load -->
            <div v-else-if="!ticket.books" class="loading-books">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>Đang tải thông tin sách...</span>
            </div>

            <!-- Không có sách -->
            <div v-else class="empty-books">
                <p>Không có sách trong đơn mượn này</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.ticket_book {
    position: relative;
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
}

.ticket_book:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}

.ticket_status {
    position: absolute;
    top: 0;
    right: 0;
    border: 2px solid;
    padding: 6px 12px;
    font-size: 1.4rem;
    border-top-right-radius: 8px;
    border-bottom-left-radius: 8px;
    min-width: 80px;
    text-align: center;
}

.ticket_book-header {
    border-bottom: 2px solid var(--color-ctu, #0066cc);
    padding-bottom: 12px;
    margin-bottom: 16px;
}

.ticket--title {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--color-ctu, #0066cc);
    margin-bottom: 8px;
}

.ticket_idDonMuon {
    font-size: 1.2rem;
    color: #7f8c8d;
    font-family: monospace;
}

.ticket_book-main {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.ticket_info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.ticket_content {
    font-size: 1.4rem;
    color: #555;
    display: flex;
    align-items: center;
    gap: 8px;
}

.ticket--icon {
    color: var(--color-ctu, #0066cc);
    font-size: 1.6rem;
}

.ticket_separator {
    color: var(--color-ctu, #0066cc);
    font-weight: bold;
    margin: 0 4px;
}

.ticket_start,
.ticket_end {
    font-weight: 500;
}

.ticket_quantity {
    color: var(--color-ctu, #0066cc);
    font-weight: bold;
}

/* Books list */
.ticket_books-list {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #ecf0f1;
}

.books-list_title {
    font-size: 1.6rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 12px;
}

.book_item {
    display: flex;
    gap: 12px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 6px;
    margin-bottom: 8px;
    transition: background-color 0.2s ease;
}

.book_item:hover {
    transform: none;
    background-color: #f8f9fa;
}

.book_item:hover .book_item-img {
    transform: none;
}

.book_item-img {
    width: 60px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.book_item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
}

.book_name {
    font-size: 1.4rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
}

.book_author {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin: 0;
}

.book_quantity {
    font-size: 1.2rem;
    color: #555;
    margin: 0;
}

/* Loading state */
.loading-books {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 20px;
    color: #7f8c8d;
    font-size: 1.4rem;
}

.loading-books i {
    font-size: 1.6rem;
}

/* Empty state */
.empty-books {
    padding: 20px;
    text-align: center;
    color: #95a5a6;
    font-size: 1.4rem;
}
</style>