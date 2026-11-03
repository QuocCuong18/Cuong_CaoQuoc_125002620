# dom_interaction.md

**Họ và tên:** Cao Quốc Cường
**MSSV:** 125002620
**Dự án:** Hạt Mộc Coffee - Website cà phê đặc sản Việt Nam
**Thử thách:** Tạo nút "Mua hàng", khi nhấn sẽ hiện Modal (hộp thoại) chứa form đăng ký bằng JavaScript, **không tải lại trang**.

---

## 1. Tổng quan

| Thành phần | Vị trí | Vai trò |
|---|---|---|
| Nút "Mua hàng ngay" | `index.html`, khu vực hero | Mở Modal |
| Nút "Đặt mua" trên mỗi thẻ sản phẩm | Do `script.js` sinh ra (hàm `createProductCard`) | Mở Modal và chọn sẵn sản phẩm đó |
| Modal `<dialog id="order-modal">` | Cuối `<body>` trong `index.html` | Hộp thoại chứa form đăng ký |
| Hàm `initModal()` | `script.js`, mục 5 | Gắn toàn bộ sự kiện, mở/đóng Modal, kiểm tra form |

Hai nút mở Modal đều mang thuộc tính `data-open-modal`; hai loại nút đóng mang thuộc tính `data-close-modal`. JavaScript dựa vào các thuộc tính này để biết nút nào làm gì, nên thêm nút mới không cần viết thêm code.

Modal dùng thẻ HTML `<dialog>`. Hai phương thức có sẵn của thẻ này là `showModal()` (mở, tự có nền mờ, tự khóa thao tác phía sau, tự bắt phím Esc) và `close()` (đóng).

---

## 2. Danh sách sự kiện (event) đã sử dụng

| # | Sự kiện | Gắn vào | Mục đích |
|---|---|---|---|
| 1 | `click` | `document` | Mở Modal khi bấm nút có `data-open-modal` |
| 2 | `mousedown` | `modal` (`<dialog>`) | Ghi nhớ chuột bắt đầu bấm ở đâu |
| 3 | `click` | `modal` | Đóng Modal: nút X, nút "Đóng", hoặc bấm ra nền mờ |
| 4 | `close` | `modal` | Dọn dẹp khi Modal đóng bằng bất kỳ cách nào |
| 5 | `input` | `form` | Xóa lỗi ô đang gõ; tính lại tạm tính khi đổi số lượng |
| 6 | `change` | `form` | Tính lại tạm tính khi đổi sản phẩm |
| 7 | `submit` | `form` | Chặn tải lại trang, kiểm tra dữ liệu, báo kết quả |
| 8 | `click` | `filterBar` | Lọc sản phẩm theo danh mục (từ thử thách trước) |

Phím **Esc** cũng đóng được Modal, nhưng đó là hành vi có sẵn của `<dialog>`, mình không viết trình nghe riêng cho phím này. Khi Esc đóng Modal, sự kiện `close` (số 4) vẫn chạy nên phần dọn dẹp vẫn được thực hiện.

---

## 3. Giải thích từng sự kiện

### 3.1. `click` trên `document`: mở Modal (kỹ thuật ủy quyền sự kiện)

```js
document.addEventListener('click', function (event) {
  const opener = event.target.closest('[data-open-modal]');
  if (opener) {
    openModal(opener.dataset.product);
  }
});
```

- Mình chỉ gắn **một** trình nghe lên `document` thay vì gắn cho từng nút. Lý do: các nút "Đặt mua" do JavaScript sinh ra **sau khi** trang tải xong, và sinh lại mỗi lần bấm bộ lọc. Gắn trực tiếp vào từng nút sẽ mất tác dụng khi nút bị tạo lại.
- Sự kiện click nổi bọt (bubble) từ nút lên `document`. `event.target` là phần tử thật sự bị bấm, `closest('[data-open-modal]')` đi ngược lên tìm nút có thuộc tính đó. Cách này vẫn đúng khi người dùng bấm vào chữ bên trong nút.
- `opener.dataset.product` đọc thuộc tính `data-product="Robusta Buôn Ma Thuột"` của nút. Nút "Mua hàng ngay" không có thuộc tính này nên giá trị là `undefined`, và Modal giữ sản phẩm mặc định.

Hàm `openModal()` làm các việc sau theo thứ tự:

1. `form.reset()` đưa form về trạng thái trống, `clearErrors()` xóa lỗi cũ.
2. Chọn sẵn sản phẩm trong danh sách và tính tạm tính.
3. Hiện form, ẩn màn hình "thành công" (nếu lần trước đã gửi).
4. `document.body.classList.add('modal-open')` để CSS khóa cuộn trang phía sau.
5. `modal.showModal()` để hiển thị hộp thoại. Ô "Họ và tên" có thuộc tính `autofocus` nên con trỏ nhảy vào đó ngay.

### 3.2. `mousedown` và `click` trên Modal: đóng Modal

```js
let pressStartedOnBackdrop = false;
modal.addEventListener('mousedown', function (event) {
  pressStartedOnBackdrop = (event.target === modal);
});

modal.addEventListener('click', function (event) {
  const clickedBackdrop = (event.target === modal && pressStartedOnBackdrop);
  if (clickedBackdrop || event.target.closest('[data-close-modal]')) {
    closeModal();
  }
});
```

- Vùng nền mờ phía sau thuộc về chính thẻ `<dialog>`, nên bấm ra nền mờ thì `event.target === modal`. Bấm vào nội dung bên trong thì `event.target` là phần tử con, Modal không đóng.
- `closest('[data-close-modal]')` bắt hai nút đóng: dấu X ở góc và nút "Đóng" ở màn hình thành công.
- **Vì sao cần thêm `mousedown`?** Giả sử người dùng bôi đen chữ trong ô nhập rồi nhả chuột ngoài nền mờ. Trình duyệt vẫn tạo sự kiện `click` trên `<dialog>`, Modal sẽ đóng nhầm và mất dữ liệu đang nhập. Biến `pressStartedOnBackdrop` ghi lại nơi **bắt đầu** nhấn chuột, chỉ khi cả lúc nhấn lẫn lúc nhả đều ở nền mờ mới đóng. Mình đã chạy thử đúng tình huống này và Modal không đóng nhầm.

### 3.3. `close`: dọn dẹp sau khi đóng

```js
modal.addEventListener('close', function () {
  document.body.classList.remove('modal-open');
});
```

Sự kiện `close` chạy khi Modal đóng bằng **bất kỳ** cách nào: nút X, nút "Đóng", bấm nền mờ hay phím Esc. Đặt việc bỏ khóa cuộn trang ở đây thay vì trong từng nơi gọi `close()` đảm bảo không bao giờ bị sót, tránh lỗi trang bị khóa cuộn mãi sau khi nhấn Esc.

### 3.4. `input`: phản hồi ngay khi gõ

```js
form.addEventListener('input', function (event) {
  const key = event.target.name;
  if (fields[key]) { setError(key, ''); }
  if (event.target === fields.quantity) { updateTotal(); }
});
```

- `input` chạy mỗi lần nội dung ô thay đổi (mỗi ký tự gõ, dán, xóa). Khi người dùng bắt đầu sửa một ô đang báo lỗi, thông báo đỏ của ô đó biến mất ngay.
- Gõ vào ô "Số lượng" thì `updateTotal()` tính lại tiền tạm tính theo thời gian thực.
- Gắn một trình nghe lên `<form>` thay vì từng ô, vì `input` cũng nổi bọt lên form. `event.target.name` cho biết ô nào vừa thay đổi.

### 3.5. `change`: đổi sản phẩm

```js
form.addEventListener('change', function (event) {
  if (event.target === fields.product) { updateTotal(); }
});
```

Với ô chọn `<select>`, sự kiện `change` chạy ngay khi người dùng chọn xong một mục, phù hợp hơn `input` cho trường hợp này. Khi đổi sản phẩm, tạm tính được tính lại từ giá trong mảng `products`.

### 3.6. `submit`: gửi form mà không tải lại trang

```js
form.addEventListener('submit', function (event) {
  event.preventDefault();                       // chặn tải lại trang
  const errors = validateOrder(values);         // kiểm tra dữ liệu
  if (errorKeys.length > 0) {
    errorKeys.forEach(function (key) { setError(key, errors[key]); });
    fields[errorKeys[0]].focus();               // đưa con trỏ về ô lỗi đầu tiên
    return;
  }
  form.hidden = true;                           // ẩn form
  successBox.hidden = false;                    // hiện màn hình cảm ơn
  successTitle.focus();
});
```

- Hành vi mặc định của form là gửi dữ liệu và **tải lại trang**. `event.preventDefault()` chặn điều đó, mọi thứ diễn ra trong JavaScript. Mình đã kiểm tra: sau khi gửi, trang không tải lại, URL và vị trí cuộn giữ nguyên.
- `submit` chạy khi bấm nút "Gửi đăng ký" **và cả khi nhấn Enter** trong ô nhập, nên dùng `submit` tốt hơn `click` trên nút.
- Form có thuộc tính `novalidate` để tắt bong bóng báo lỗi mặc định của trình duyệt, thay bằng thông báo tiếng Việt do `validateOrder()` tạo ra, hiển thị ngay dưới từng ô.

Quy tắc kiểm tra:

| Ô | Điều kiện hợp lệ |
|---|---|
| Họ và tên | Ít nhất 2 ký tự sau khi bỏ khoảng trắng hai đầu |
| Số điện thoại | Dạng `0xxxxxxxxx` hoặc `+84xxxxxxxxx` (đủ 10 chữ số, cho phép khoảng trắng, dấu chấm, gạch ngang) |
| Email | Không bắt buộc; nếu nhập thì phải đúng dạng `ten@mien.xx` |
| Sản phẩm | Phải chọn một sản phẩm |
| Số lượng | Số nguyên từ 1 đến 99 |

Dữ liệu chỉ được xử lý ngay trên trình duyệt, **chưa gửi đi đâu** vì trang chưa có máy chủ. Màn hình "Đăng ký thành công" là phản hồi giao diện để minh họa.

### 3.7. `click` trên thanh lọc (từ thử thách trước)

Cùng kỹ thuật ủy quyền: một trình nghe trên thanh lọc, `event.target.closest('button[data-category]')` xác định nút nào được bấm rồi gọi lại `renderProducts()` với danh sách đã lọc.

---

## 4. Các thao tác DOM đã dùng

| Thao tác | Dùng ở đâu |
|---|---|
| `document.getElementById(...)` | Lấy Modal, form, các ô nhập, vùng báo lỗi |
| `element.closest(selector)` | Tìm nút được bấm trong ủy quyền sự kiện |
| `element.dataset.product` | Đọc thuộc tính `data-product` |
| `modal.showModal()` / `modal.close()` / `modal.open` | Mở, đóng, kiểm tra trạng thái Modal |
| `classList.add / remove` | Bật tắt lớp `modal-open` để khóa cuộn trang |
| `element.hidden = true/false` | Chuyển giữa form và màn hình thành công |
| `element.textContent = ...` | Ghi nội dung thông báo lỗi, tạm tính, lời cảm ơn (an toàn, không chèn HTML) |
| `setAttribute / removeAttribute('aria-invalid')` | Đánh dấu ô lỗi cho CSS (viền đỏ) và trình đọc màn hình |
| `form.reset()` | Đưa form về trống mỗi lần mở lại |
| `element.focus()` | Đưa con trỏ về ô lỗi đầu tiên, hoặc về tiêu đề thành công |
| `event.preventDefault()` | Chặn form tải lại trang |

---

## 5. Trải nghiệm và khả năng truy cập

- **Bàn phím:** Esc đóng Modal, Tab di chuyển trong Modal (trình duyệt giữ con trỏ không thoát ra phía sau), Enter gửi form.
- **Trình đọc màn hình:** `<dialog>` kèm `aria-labelledby` và `aria-describedby`; thông báo lỗi có `role="alert"` nên được đọc ngay; ô lỗi có `aria-invalid="true"`.
- **Không giật trang:** khi Modal mở, trang phía sau bị khóa cuộn bằng lớp `modal-open`.
- **Giảm chuyển động:** hiệu ứng xuất hiện của Modal tự tắt với người dùng bật "giảm chuyển động" trong hệ điều hành.
- **Giao diện điện thoại:** Modal nằm gọn trong màn hình, hai ô "Sản phẩm" và "Số lượng" xếp thành một cột, nội dung cuộn được nếu màn hình thấp.

---

## 6. Đã kiểm tra những gì

Mình viết bài kiểm tra tự động chạy trên trình duyệt Chrome thật, gồm 36 bước, kết quả đều đạt:

- Mở Modal bằng nút "Mua hàng ngay" và nút "Đặt mua"; sản phẩm được chọn sẵn đúng.
- Đóng bằng nút X, bấm nền mờ, phím Esc; kéo chuột từ ô nhập ra nền **không** đóng nhầm.
- Form rỗng báo lỗi, con trỏ về ô lỗi đầu tiên; gõ vào ô thì lỗi ô đó biến mất.
- Số điện thoại và email sai bị từ chối; dữ liệu đúng hiện màn hình thành công.
- Tạm tính đúng khi đổi số lượng và sản phẩm.
- Sau khi gửi, **trang không tải lại**, URL và vị trí cuộn không đổi.
- Mở lại Modal thì form trống, không còn thông báo cũ.
- Trên màn hình điện thoại Modal nằm gọn trong khung hình; không có lỗi JavaScript nào.
