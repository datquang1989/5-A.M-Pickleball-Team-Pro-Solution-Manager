# Đưa app 5 A.M Pickleball lên Netlify

Cách A – qua GitHub (khuyên dùng):
1. Tạo repo GitHub mới, tải toàn bộ nội dung thư mục này lên (giữ nguyên cấu trúc: public/, netlify/, netlify.toml, package.json).
2. Netlify → Add new site → Import an existing project → chọn repo. Build command để trống, Publish directory: public (đã khai báo trong netlify.toml).
3. Site configuration → Environment variables → thêm biến ADMIN_PASSWORD = mật khẩu quản trị anh tự đặt.
4. Deploy lại (Deploys → Trigger deploy) để hàm đọc được biến mới.

Cách B – Netlify CLI: npm i -g netlify-cli; netlify login; netlify init (hoặc link); netlify env:set ADMIN_PASSWORD "mat-khau"; netlify deploy --prod

Dùng:
- Mọi người mở link: chỉ XEM (BXH, giải đấu, thành viên), tự cập nhật mỗi 60 giây.
- Quản trị viên bấm "Quản trị" (góc phải trên), nhập mật khẩu → sửa/nhập liệu, dữ liệu tự lưu lên máy chủ. Nhiều quản trị viên sửa cùng lúc thì bản lưu sau cùng thắng.
- Mật khẩu được kiểm tra ngay khi đăng nhập (sai mật khẩu → báo ngay trong khung đăng nhập). Hỗ trợ mật khẩu tiếng Việt có dấu; khoảng trắng đầu/cuối tự bỏ. Đăng nhập được giữ khi tải lại trang (hết khi đóng tab).
- Nếu khung đăng nhập báo "chưa có biến ADMIN_PASSWORD": vào Netlify đặt biến rồi Trigger deploy lại.
- Vẫn nên bấm "Xuất JSON" (tab Tổng quan) định kỳ để sao lưu.
- Muốn dữ liệu cũ từ bản thử: đăng nhập quản trị, dán JSON vào ô nhập → "Nhập từ ô bên dưới".

Kiểm tra khi điện thoại không thấy dữ liệu:
1. Mở  https://<tên-site>.netlify.app/api/state  . Đúng: hiện chữ null (chưa có dữ liệu) hoặc một đoạn JSON dài. Nếu hiện trang web/404 → hàm chưa được triển khai (thường do kéo thả file; hãy deploy qua GitHub hoặc CLI). Nếu hiện lỗi 500 → xem Netlify → Logs → Functions.
2. Netlify → Deploys → mở lần deploy mới nhất, mục Functions phải có "state".
3. Trên app phải thấy nút "Quản trị" góc phải trên. Không có nút + có khung đỏ "Chưa kết nối máy chủ" = hàm chưa chạy.
4. Sau khi đăng nhập quản trị, nhập thử 1 thay đổi: dưới nút phải hiện "Đã đồng bộ". Hiện "Lỗi đồng bộ"/báo sai mật khẩu = chưa đặt ADMIN_PASSWORD hoặc chưa deploy lại sau khi đặt.
5. Dữ liệu đã nhập khi còn ở chế độ cục bộ không tự lên máy chủ: Xuất JSON ở máy tính, đăng nhập quản trị rồi Nhập lại.

Thu/Chi (quỹ team):
- Dữ liệu quỹ lưu riêng (hàm netlify/functions/fund.mjs), không lẫn với dữ liệu thành viên/giải đấu. Mọi người xem được.
- Thủ quỹ nhập liệu: đặt thêm biến môi trường TREASURER_PASSWORD (mật khẩu thủ quỹ), rồi Trigger deploy lại. Thủ quỹ bấm "Đăng nhập" bằng mật khẩu này chỉ sửa được tab Thu/Chi, không sửa được thành viên/giải đấu. Mật khẩu ADMIN_PASSWORD cũng nhập được Thu/Chi.
- Nếu hai người cùng sửa quỹ một lúc, người lưu sau sẽ được báo "dữ liệu vừa được cập nhật", tải lại bản mới rồi nhập lại (không bị ghi đè âm thầm).
- Kiểm tra: mở https://<tên-site>.netlify.app/api/fund  → hiện null (chưa có dữ liệu) hoặc JSON.
