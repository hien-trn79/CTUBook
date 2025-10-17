export const bookStatus = Object.freeze({
  NONE: 0,
  WAITTING: 1,
  APPROVED: 2,
  RETURNED: 3,
});

export const bookLabel = {
  [bookStatus.NONE]: "Chưa mượn",
  [bookStatus.WAITTING]: "Chờ duyệt",
  [bookStatus.APPROVED]: "Đã duyệt",
  [bookStatus.RETURNED]: "Đã trả",
};

export const bookClass = {
  [bookStatus.NONE]: "text-gray",
  [bookStatus.WAITTING]: "text-orange",
  [bookStatus.APPROVED]: "text-green",
  [bookStatus.RETURNED]: "text-blue",
};

export const request = {
  0: "Chờ xác nhận",
  1: "Đã xác nhận",
};

export const ClassRequest = {
  0: "text-blue",
  1: "text-green",
};
