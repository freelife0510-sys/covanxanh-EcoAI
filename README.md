# EcoAI — Cố Vấn Xanh (AI-Powered Eco Action Hub THPT)

> **Dự án**: Nền tảng Giáo dục Môi trường, Biến đổi Khí hậu & Hành động Xanh dành cho Học sinh THPT  
> **Căn cứ sư phạm**: Chương trình Giáo dục Phổ thông 2018 (Địa lí, Sinh học, Hoạt động trải nghiệm)  
> **Tác giả / Chủ nhiệm dự án**: **Thầy Hồ Sỹ Long** — Hotline chuyên môn: **0943278804**

---

## 🌟 5 Phân Hệ Cốt Lõi (Mạch Học Tập Sư Phạm Khép Kín 4 Bước)

### 1. Trang Chủ & Bản Đồ Khí Hậu Việt Nam 3D Tương Tác
- **Bản đồ chữ S chuẩn xác**, thể hiện đầy đủ và trang trọng chủ quyền thiêng liêng: **Quần đảo Hoàng Sa (TP. Đà Nẵng)** và **Quần đảo Trường Sa (Tỉnh Khánh Hòa)**, đảo Phú Quốc, Côn Đảo...
- Ghim tương tác trực tiếp 5 vùng sinh thái trọng điểm (Bắc Bộ, Miền Trung kiên cường - rừng phòng hộ & bão lũ, Tây Nguyên - rừng đầu nguồn & nước ngầm, ĐBSCL - hạn mặn & rừng ngập mặn, Vùng Biển Đảo - chống rác thải nhựa).
- Tích hợp mô hình biểu tượng Hiệp Sĩ Xanh 3D & Quả cầu sinh thái Net Zero 2050.

### 2. Trợ Lý AI Cố Vấn Xanh Socratic (`EcoMentorChat`)
- Đàm thoại theo phương pháp gợi mở sư phạm: **Giải thích bản chất khoa học ngắn gọn trước (2-3 câu)**, sau đó đặt câu hỏi Socratic liên hệ thực tế học đường và địa phương.
- Hỗ trợ xử lý tiếng Việt thông minh có dấu / không dấu (El Niño, bão lũ miền Trung, gió Lào, rác nhựa, dự án môi trường).
- Giữ lịch sử hội thoại liên tục qua `localStorage` (không bị mất khi chuyển tab).

### 3. Máy Tính Dấu Chân Carbon Học Đường (`CarbonCalculator`)
- Mô hình định lượng chuẩn hóa khoa học theo điều kiện thực tế Việt Nam:
  - **Lưới điện VN 2024**: ~0.681 tCO2e/MWh (nghiên cứu ĐH Bách khoa Hà Nội & Bộ TN&MT).
  - **Điều hòa**: Có tính năng **chia sẻ theo số người dùng chung phòng** (1 - 4 người).
  - **Giao thông học đường**: Xe đạp (0 kg/km), Xe điện (~0.02 kg/km), Xe buýt (~0.035 kg/km), Xe máy xăng (~0.048 kg/km).
  - **Dinh dưỡng & Đồ nhựa**: Phân định phát thải thịt bò, thịt heo và ly nhựa dùng một lần.
- **Thử thách 7 ngày sống xanh trọn vẹn (Day 1 $\rightarrow$ Day 7)** với tính năng lưu tiến độ tự động trên máy và hiệu ứng chúc mừng khi hoàn thành.

### 4. Nhận Diện & Phân Loại Rác Thông Minh (`WasteClassifier`)
- Cập nhật đúng **Quy chuẩn Luật Bảo vệ môi trường 2020** với 3+1 nhóm:
  1. *Rác tái chế* (Trắng / Xanh dương)
  2. *Rác thực phẩm* (Xanh lá cây)
  3. *Rác nguy hại* (Đỏ / Trạm thu hồi riêng: Pin, bóng đèn, hóa chất)
  4. *Rác sinh hoạt khác* (Vàng / Cam / Xám)
- Tính năng **kéo - thả ảnh thực tế** và **tự động nén ảnh bằng HTML5 Canvas** (< 500KB) giúp tải siêu nhanh và tiết kiệm băng thông.
- Cam kết bảo vệ quyền riêng tư học sinh (Luật 91/2025/QH15 & NĐ 356/2025/NĐ-CP): Không chụp khuôn mặt người, xử lý in-memory an toàn.

### 5. Phiếu Học Tập & Đánh Giá Nhận Thức Phục Vụ SKKN (`StudyAssessment`)
- Khung đối chiếu yêu cầu cần đạt với CT GDPT 2018 (Địa lí 10, 12; Sinh học 12; HĐTN 10, 11, 12).
- Bộ câu hỏi trắc nghiệm đo lường trước - sau (Pre/Post-test) tính điểm tự động.
- Nút **In / Xuất Phiếu Kết Quả Học Tập** cá nhân để nộp giáo viên làm minh chứng định lượng cho báo cáo Sáng kiến kinh nghiệm.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Yêu cầu:
- Đã cài đặt **Node.js** (Khuyên dùng bản LTS từ 18.x trở lên) từ [https://nodejs.org/](https://nodejs.org/)

### Chạy nhanh bằng 1-Click (Dành cho Giáo viên & Học sinh):
- **Trên Windows**: Nhấp đúp chuột vào tệp `chay-ecoai-windows.bat`. Ứng dụng sẽ tự động kiểm tra, cài đặt thư viện và mở trình duyệt web tại `http://localhost:3000`.
- **Trên Mac / Linux**: Mở Terminal và chạy lệnh `./chay-ecoai-mac-linux.sh`.

### Chạy bằng dòng lệnh thủ công:
```bash
# 1. Cài đặt thư viện
npm install

# 2. Khởi chạy server phát triển
npm run dev

# 3. Hoặc kiểm tra kiểu TypeScript & build production
npm run lint
npm run build
npm start
```

---

## 🔑 Cấu Hình Google Gemini API Key

- Ứng dụng hoạt động đầy đủ cả ở **Chế độ Ngoại tuyến Mô phỏng (Offline Demo)** và **Chế độ Kết nối AI Trực tiếp (Live AI)**.
- Để sử dụng Gemini 3.8 Flash trực tiếp:
  1. Lấy API Key miễn phí tại [Google AI Studio](https://aistudio.google.com/app/apikey).
  2. Bấm nút **"Cài đặt API Key"** ở góc phải thanh điều hướng và dán khóa vào.
  3. Hoặc cấu hình trong tệp `.env`:
     ```env
     GEMINI_API_KEY="AIzaSy..."
     GEMINI_MODEL="gemini-3.8-flash"
     ```

---

## 📞 Thông Tin Bản Quyền & Hỗ Trợ Chuyên Môn

- **Dự án**: EcoAI — Nền tảng Giáo dục Môi trường & Hành động Xanh THPT
- **Tác giả / Chủ nhiệm**: Thầy Hồ Sỹ Long
- **Hotline hỗ trợ kỹ thuật học đường**: 0943278804
- **Cam kết**: Phục vụ miễn phí vì mục tiêu giáo dục phát triển bền vững và tương lai Net Zero 2050 của Việt Nam.
