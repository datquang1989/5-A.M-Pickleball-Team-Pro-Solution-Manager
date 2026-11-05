# Lịch sử phiên bản – 5 A.M Pickleball

Cách dùng: mỗi lần cập nhật, file gửi kèm có tên dạng `5AM-vNN.zip`. Muốn quay lại phiên bản nào, báo số phiên bản (ví dụ v7) để lấy đúng gói đó.
Lưu ý: dữ liệu (thành viên, giải đấu, quỹ) lưu riêng trên Netlify nên đổi phiên bản code không làm mất dữ liệu. Phiên bản hiện tại hiển thị ở cuối trang app.

| Bản | Nội dung chính | File thay đổi |
|---|---|---|
| v1 | Sửa lỗi đăng nhập quản trị: khung đăng nhập, kiểm tra mật khẩu ngay, giữ phiên, hỗ trợ mật khẩu tiếng Việt | index.html, state.mjs |
| v2 | Phân trình chi tiết S+/S/S−… (15 mức) | index.html |
| v3 | Tab Hỏi/Đáp: mốc trình, cách tính điểm | index.html |
| v4 | BXH Tổng quan hiện top 10 + nút xem đầy đủ | index.html |
| v5 | Chấm trình game Đánh nối và WC rally (hệ số 0.03) | index.html |
| v6 | Màu riêng cho các nhóm trình S–A–B–C–D | index.html |
| v7 | Giao diện trận đấu mới (bảng điểm, huy chương, Δ trình) | index.html |
| v8 | Thẻ số liệu Tổng quan có màu và biểu tượng | index.html |
| v9 | Tab Tập luyện (sáng/chiều/tối, hệ số 0.03) | index.html |
| v10 | Mục Nổi bật trong tháng ở Tổng quan | index.html |
| v11 | Tab Thu/Chi (thủ quỹ nhập liệu, biến TREASURER_PASSWORD) | index.html, state.mjs, fund.mjs (mới) |
| v12 | Random Robin Đôi Nam Nữ; sửa lỗi treo khi random nhiều người; hiển thị số phiên bản | index.html |
| v13 | Random Robin Hỗn hợp (đôi nam nữ + đôi cùng giới trong cùng hoạt động, cân bằng số trận nam/nữ) | index.html |
| v14 | Random Robin Hỗn hợp đều số trận (chọn số sân + số trận/người, tạo toàn bộ lịch một lần) | index.html |
| v15 | Bản quyền ở chân trang; tab Thông báo; tab Thành viên tách Nam/Nữ + phong độ 5 trận + xuất Excel/CSV; sửa người tham gia khi chưa bắt đầu, chọn người tách Nam/Nữ; Giải Đánh team nhiều vòng (vòng bảng → bán kết → chung kết, tranh 3-4); thêm các thể thức Mini game vào Giải đấu | index.html |
| v16 | Mini game có Đánh Team và Đánh Team có phân trình (tự chia team cân bằng nam/nữ, trình); Random Robin hỗn hợp đều số trận có phân trình (mini + giải); tình trạng sức khỏe thành viên | index.html |
| v17 | Danh sách thành viên từng Team trong các hoạt động Đánh Team; bảng Nam/Nữ ở tab Thành viên xếp dọc, không bị cắt cột Phong độ (5 trận); nút kết quả ngẫu nhiên (test) và xoá tỷ số | index.html |
| v18 | Chấm trình kiểu DUPR: kết quả xét cả tỷ số, K giảm theo số trận đã đánh, hệ số theo loại hoạt động (mini/giải/tập) và Đánh nối/WC; thông số chỉnh được trong Hỏi/Đáp (mục 12); viết lại mục 3, 6, 7, 8 | index.html |
