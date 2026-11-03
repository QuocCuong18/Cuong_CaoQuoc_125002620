# ☕ HẠT MỘC COFFEE
### Website cà phê đặc sản Việt Nam

Hạt Mộc Coffee là dự án website giới thiệu thương hiệu cà phê đặc sản Việt Nam, được thiết kế theo phong cách hiện đại, sang trọng và tinh tế. Website tập trung vào việc giới thiệu sản phẩm, kể câu chuyện thương hiệu và tạo trải nghiệm thuận tiện cho khách hàng.

---

## 📌 1. Giới thiệu dự án

**Tên dự án:** Hạt Mộc Coffee  
**Loại dự án:** Website giới thiệu thương hiệu và sản phẩm cà phê  
**Ngôn ngữ giao diện:** Tiếng Việt  
**Công nghệ chính:** HTML5, CSS3  
**Thiết kế:** Responsive Web Design  
**Font chữ:** Roboto kết hợp font tiêu đề phù hợp với phong cách thương hiệu

### Mục tiêu

- Xây dựng website giới thiệu thương hiệu cà phê Việt Nam.
- Trình bày sản phẩm rõ ràng, trực quan và thu hút.
- Tạo giao diện sang trọng, hiện đại và nhất quán.
- Hỗ trợ hiển thị tốt trên máy tính, máy tính bảng và điện thoại.
- Cung cấp thông tin liên hệ để khách hàng tìm hiểu

---

## 🗂️ 2. Cấu trúc thư mục

```text
├── index.html           # Cấu trúc trang (Semantic HTML5)
├── style.css            # Giao diện, biến CSS, responsive
├── script.js            # Dữ liệu sản phẩm, renderProducts, bộ lọc, Modal đăng ký
├── function_logic.md    # Giải thích cách truyền dữ liệu vào hàm hiển thị
├── dom_interaction.md   # Mô tả các sự kiện (event) dùng cho Modal đăng ký
├── PROMPT_LOG.md        # Nhật ký prompt engineering
└── assets/              # Ảnh SVG: hero, 6 sản phẩm, favicon
```

## ⚙️ 3. Danh sách sản phẩm sinh bằng JavaScript

Danh sách sản phẩm không viết tay trong HTML mà được tạo từ mảng `products` trong `script.js` bằng hàm `renderProducts(list, container)`. Xem chi tiết tại [function_logic.md](function_logic.md).

## 🛒 4. Modal đăng ký mua hàng

Nút **Mua hàng ngay** (đầu trang) và các nút **Đặt mua** (trên từng sản phẩm) mở một hộp thoại `<dialog>` chứa form đăng ký bằng JavaScript, trang không tải lại. Hộp thoại đóng được bằng nút X, bấm ra nền mờ hoặc phím Esc; form có kiểm tra dữ liệu và tự tính tạm tính. Xem các sự kiện đã dùng tại [dom_interaction.md](dom_interaction.md).
