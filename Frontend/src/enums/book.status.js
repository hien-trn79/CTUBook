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
  [bookStatus.NONE]: "text-black",
  [bookStatus.WAITTING]: "text-orange",
  [bookStatus.APPROVED]: "text-green",
  [bookStatus.RETURNED]: "text-blue",
};
