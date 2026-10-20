# NHẬT KÝ PROMPT ENGINEERING (VIBE CODING LOG)

- **Họ và tên:** Cao Quốc Cường
- **MSSV:** [điền MSSV của bạn]
- **Tên đề tài Website:** Hạt Mộc Coffee - Website bán cà phê đặc sản Việt Nam
- **Công cụ AI đã sử dụng:** Claude (Anthropic)

## 1. Yêu cầu ban đầu (System/Initial Prompt)

> *Prompt tổng quan ban đầu dùng để khởi tạo khung website.*

```text
Bạn hãy đóng vai là một chuyên gia nhiều năm kinh nghiệm viết web và có nhiều năm
giảng dạy. Hãy làm hết tất cả cho tôi đầy đủ yêu cầu của đề kiểm tra giữa kỳ (đính
kèm file PDF), tiêu chuẩn cực kỳ khắt khe, không được vượt quá các quy chuẩn của đề
bài, chỉ sử dụng HTML và CSS. Tạo một cửa hàng sản phẩm thật bắt mắt, giao diện đẹp
đến mức nhìn vào là muốn xem không rời mắt. Hoàn thiện tất cả yêu cầu của bài.
```

**Chủ đề được chọn:** Website bán cà phê rang xay "Hạt Mộc Coffee", gồm 6 sản phẩm, quy trình, cảm nhận khách hàng và form liên hệ.

## 2. Quá trình tinh chỉnh & Giải quyết sự cố (Iteration Iterations)

### Lần 1: Dựng khung Semantic HTML & CSS Variable
- **Prompt đã dùng:** "Dựng `index.html` chuẩn Semantic HTML5 gồm `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. Hạn chế tối đa thẻ `<div>`. Viết `style.css` có `:root` khai báo biến màu, font, spacing, bo góc, đổ bóng; layout dùng Flexbox và Grid."
- **Kết quả AI tạo ra:** Trang gồm 6 khối: hero, giới thiệu, sản phẩm, quy trình, cảm nhận khách hàng, liên hệ. Toàn bộ trang dùng thẻ ngữ nghĩa (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<figcaption>`, `<address>`, `<blockquote>`, `<footer>`) và không có thẻ `<div>` nào. Biến CSS gồm `--primary-color`, `--secondary-color`, `--dark-color`, `--cream-color`, `--font-heading`, `--font-body`, `--space-*`, `--radius`, `--shadow-*`.
- **Nhận xét & Tinh chỉnh của SV:** Kiểm tra lại mã nguồn, xác nhận không còn `<div>` vô nghĩa; các danh sách sản phẩm, bước quy trình dùng `<ul>`/`<ol>` đúng ngữ nghĩa. Menu mobile dùng checkbox + CSS thuần nên không cần JavaScript. *(Bạn bổ sung thêm nhận xét thật của mình, ví dụ yêu cầu đổi tông màu hoặc đổi tên thương hiệu.)*

### Lần 2: Tích hợp thư viện Animate.css & AOS
- **Prompt đã dùng:** "Tích hợp Animate.css cho tiêu đề, Hero Section và nút CTA. Tích hợp AOS cho hiệu ứng xuất hiện khi cuộn trang ở các section. Dùng hiệu ứng vừa phải, không gây rối mắt. Tự viết hiệu ứng `:hover`, `:focus` bằng CSS cho nút và các thẻ card."
- **Kết quả AI tạo ra:**
  - Animate.css (CDN): `fadeInDown` cho tiêu đề, `fadeInUp` cho đoạn dẫn và nút CTA, `zoomIn` cho ảnh hero, `bounceIn` cho huy hiệu giảm giá, có `animate__delay-*` để các phần tử xuất hiện lần lượt.
  - AOS 2.3.4 (CDN): `fade-up`, `zoom-in-up`, `fade-right`, `flip-left`, `fade-left` kèm `data-aos-delay`; khởi tạo bằng `AOS.init({ once: true })`.
  - CSS tự viết: nút nâng lên và phóng nhẹ khi hover, card sản phẩm nâng lên và ảnh phóng to, gạch chân động ở menu, ô form đổi viền và đổ bóng khi focus, `:focus-visible` cho điều hướng bàn phím.
- **Thách thức gặp phải:** Hiệu ứng AOS không chạy nếu quên gọi `AOS.init()` sau khi nạp thư viện; các thẻ có `transform` khi hover có thể xung đột với `transform` của AOS.
- **Cách sửa prompt (Debug prompt):** "Hiệu ứng AOS không xuất hiện, kiểm tra lại thứ tự nạp `aos.js` và `AOS.init()` ở cuối `<body>`. Đặt `data-aos` lên thẻ `<li>` bao ngoài, còn hiệu ứng hover viết trên thẻ `<article>` bên trong để hai `transform` không đè nhau." Sau khi sửa, hiệu ứng cuộn và hover chạy mượt, không giật.

### Lần 3: Hoàn thiện giao diện, responsive và trải nghiệm
- **Prompt đã dùng:** "Làm giao diện đẹp, cân đối, bắt mắt. Thêm hình sản phẩm trong thư mục `assets/`, responsive cho tablet và điện thoại, tôn trọng người dùng giảm chuyển động."
- **Kết quả AI tạo ra:** 8 ảnh SVG tự vẽ trong `assets/` (hero, 6 sản phẩm, favicon); 3 breakpoint (1024px, 860px, 600px); `prefers-reduced-motion`; liên kết "Bỏ qua điều hướng"; thuộc tính `alt`, `aria-label` cho ảnh và menu.
- **Nhận xét & Tinh chỉnh của SV:** Xem trên nhiều kích thước màn hình và kiểm tra menu mobile. *(Ghi thêm những chỗ bạn tự chỉnh, ví dụ giá sản phẩm, số điện thoại, địa chỉ thật.)*

## 3. Đánh giá cá nhân về quá trình Vibe Coding

- **AI đã giúp bạn tiết kiệm thời gian ở phần nào nhất?**
  AI giúp nhiều nhất ở việc dựng khung Semantic HTML5, hệ thống CSS Variables nhất quán và viết media query responsive. Phần minh họa sản phẩm bằng SVG cũng được tạo nhanh mà không cần tìm ảnh bản quyền.

- **Bài học rút ra khi đặt câu hỏi (Prompt) cho AI trong thiết kế web?**
  1. Prompt càng cụ thể (tên thẻ, tên thư viện, tên hiệu ứng, giới hạn "không dùng `<div>` vô nghĩa") thì mã sinh ra càng sát yêu cầu.
  2. Cần chia nhỏ yêu cầu theo từng lượt (khung HTML, rồi CSS, rồi hiệu ứng) để dễ kiểm tra và sửa lỗi.
  3. Khi gặp lỗi, mô tả rõ hiện tượng và nguyên nhân nghi ngờ (ví dụ AOS không chạy do thứ tự nạp script) giúp AI sửa đúng chỗ.
  4. Luôn tự đọc lại mã, kiểm tra trên trình duyệt và đối chiếu với thang điểm của đề thay vì tin hoàn toàn vào kết quả của AI.
