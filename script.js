/* =====================================================
   HẠT MỘC COFFEE - script.js
   Hiển thị danh sách sản phẩm bằng vòng lặp từ dữ liệu mẫu.
   Mục lục: 1. Dữ liệu mẫu   2. Hàm tiện ích   3. Hàm hiển thị
            4. Bộ lọc danh mục  5. Modal đăng ký mua hàng
            6. Khởi động trang
   ===================================================== */

'use strict';

/* 1. DỮ LIỆU MẪU --------------------------------------
   Mỗi sản phẩm là một object. Muốn thêm sản phẩm, chỉ cần
   thêm một object mới vào mảng, không phải viết thêm HTML.
   ------------------------------------------------------ */
const CATEGORIES = [
  { id: 'all',      label: 'Tất cả' },
  { id: 'rang-xay', label: 'Cà phê rang xay' },
  { id: 'pha-san',  label: 'Pha sẵn & tiện lợi' }
];

// Tăng số này mỗi khi sửa ảnh trong assets/ để trình duyệt tải lại ảnh mới thay vì dùng bản cũ trong bộ nhớ đệm
const ASSET_VERSION = 2;

const products = [
  {
    id: 1,
    name: 'Arabica Cầu Đất',
    notes: 'Hương hoa, chua thanh, hậu vị caramel',
    price: 185000,
    weight: '250g',
    image: 'assets/product-1.svg',
    alt: 'Gói cà phê Arabica Cầu Đất 250g',
    category: 'rang-xay',
    tag: { text: 'Bán chạy', type: 'hot' }
  },
  {
    id: 2,
    name: 'Robusta Buôn Ma Thuột',
    notes: 'Đậm đà, hương cacao, hậu vị béo',
    price: 165000,
    weight: '500g',
    image: 'assets/product-2.svg',
    alt: 'Gói cà phê Robusta Buôn Ma Thuột 500g',
    category: 'rang-xay',
    tag: { text: 'Đậm vị', type: 'default' }
  },
  {
    id: 3,
    name: 'Culi Honey',
    notes: 'Ngọt mật ong, trái cây chín, êm dịu',
    price: 195000,
    weight: '250g',
    image: 'assets/product-3.svg',
    alt: 'Gói cà phê Culi Honey 250g',
    category: 'rang-xay',
    tag: { text: 'Mới', type: 'new' }
  },
  {
    id: 4,
    name: 'Cold Brew Chai',
    notes: 'Ủ lạnh 18 giờ, mượt, không gắt',
    price: 55000,
    weight: '330ml',
    image: 'assets/product-4.svg',
    alt: 'Chai Cold Brew 330ml',
    category: 'pha-san',
    tag: { text: 'Giải nhiệt', type: 'hot' }
  },
  {
    id: 5,
    name: 'Phin giấy Drip Bag',
    notes: 'Pha trong 3 phút, chỉ cần nước nóng',
    price: 99000,
    weight: 'Hộp 10',
    image: 'assets/product-5.svg',
    alt: 'Hộp cà phê phin giấy tiện lợi',
    category: 'pha-san',
    tag: { text: 'Tiện lợi', type: 'default' }
  },
  {
    id: 6,
    name: 'Blend Sài Gòn',
    notes: 'Cân bằng, thơm nồng, hợp pha phin',
    price: 175000,
    weight: '500g',
    image: 'assets/product-6.svg',
    alt: 'Gói cà phê Blend Sài Gòn 500g',
    category: 'rang-xay',
    tag: { text: 'Mới', type: 'new' }
  }
];

/* 2. HÀM TIỆN ÍCH ------------------------------------- */

// Đổi số 185000 thành chuỗi "185.000đ"
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

// Chặn ký tự đặc biệt để dữ liệu không làm vỡ HTML
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Chỉ gắn thuộc tính AOS khi thư viện đã được nạp
function hasAOS() {
  return typeof window !== 'undefined' && typeof window.AOS !== 'undefined';
}

/* 3. HÀM HIỂN THỊ ------------------------------------- */

// Nhận MỘT sản phẩm (object), trả về chuỗi HTML của thẻ <li> tương ứng
function createProductCard(product, index) {
  const tagClass = product.tag && product.tag.type !== 'default'
    ? ' tag-' + product.tag.type
    : '';
  const tagHtml = product.tag
    ? `<span class="tag${tagClass}">${escapeHTML(product.tag.text)}</span>`
    : '';
  // Các thẻ so le độ trễ 0 - 100 - 200ms theo cột để hiện lần lượt
  const aosAttrs = hasAOS()
    ? ` data-aos="zoom-in-up" data-aos-delay="${(index % 3) * 100}"`
    : '';

  return `
        <li${aosAttrs}>
          <article class="card">
            <figure class="card-media">
              <img src="${escapeHTML(product.image)}?v=${ASSET_VERSION}" alt="${escapeHTML(product.alt)}" loading="lazy" width="400" height="480">
              ${tagHtml}
            </figure>
            <section class="card-body">
              <h3>${escapeHTML(product.name)}</h3>
              <p class="notes">${escapeHTML(product.notes)}</p>
              <p class="price-row"><span class="price">${formatPrice(product.price)}</span><span class="weight">${escapeHTML(product.weight)}</span></p>
              <button type="button" class="btn btn-small" data-open-modal data-product="${escapeHTML(product.name)}">Đặt mua</button>
            </section>
          </article>
        </li>`;
}

/* HÀM CHÍNH
   renderProducts(list, container)
   - list      : mảng các object sản phẩm (dữ liệu truyền vào)
   - container : phần tử HTML sẽ chứa các thẻ sản phẩm (nơi hiển thị)
   - trả về    : số sản phẩm đã hiển thị
   Hàm dùng vòng lặp for để duyệt từng phần tử của mảng, mỗi lần lặp
   sinh ra một thẻ sản phẩm rồi nối vào chuỗi HTML. */
function renderProducts(list, container) {
  if (!container) {
    return 0;
  }

  // Danh sách rỗng: hiển thị thông báo thay vì để trống
  if (!Array.isArray(list) || list.length === 0) {
    container.innerHTML =
      '<li class="empty-state">Chưa có sản phẩm nào trong danh mục này.</li>';
    return 0;
  }

  let html = '';
  for (let i = 0; i < list.length; i++) {
    html += createProductCard(list[i], i);
  }
  container.innerHTML = html;
  return list.length;
}

// Dùng lại chính mảng products để tạo các <option> cho form liên hệ
function renderProductOptions(list, selectElement) {
  if (!selectElement) {
    return;
  }
  let html = '';
  for (let i = 0; i < list.length; i++) {
    html += `<option>${escapeHTML(list[i].name)}</option>`;
  }
  selectElement.innerHTML = html;
}

/* 4. BỘ LỌC DANH MỤC ---------------------------------- */

// Trả về mảng mới chỉ gồm sản phẩm thuộc danh mục được chọn
function filterProducts(list, categoryId) {
  if (categoryId === 'all') {
    return list;
  }
  return list.filter(function (product) {
    return product.category === categoryId;
  });
}

// Tạo các nút lọc từ mảng CATEGORIES (cũng bằng vòng lặp)
function renderFilterButtons(categories, list, filterBar, activeId) {
  if (!filterBar) {
    return;
  }
  let html = '';
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const isActive = category.id === activeId;
    const count = filterProducts(list, category.id).length;
    html += `
        <li>
          <button type="button" class="filter-btn${isActive ? ' is-active' : ''}" data-category="${category.id}" aria-pressed="${isActive}">
            ${escapeHTML(category.label)} <span class="filter-count">${count}</span>
          </button>
        </li>`;
  }
  filterBar.innerHTML = html;
}

/* 5. MODAL ĐĂNG KÝ MUA HÀNG ----------------------------
   Hộp thoại là thẻ <dialog id="order-modal"> trong index.html.
   JS mở bằng showModal(), đóng bằng close(), form được xử lý
   bằng sự kiện submit nên trang KHÔNG bị tải lại.
   ------------------------------------------------------ */
const PHONE_PATTERN = /^(0|\+84)\d{9}$/;      // 0912345678 hoặc +84912345678
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tạm tính = đơn giá của sản phẩm được chọn x số lượng (lấy giá từ mảng products)
function calcTotal(list, productName, quantity) {
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) {
    return 0;
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].name === productName) {
      return list[i].price * qty;
    }
  }
  return 0;
}

// Nhận các giá trị người dùng nhập, trả về object lỗi (rỗng = hợp lệ)
function validateOrder(values) {
  const errors = {};
  if (String(values.name).trim().length < 2) {
    errors.name = 'Vui lòng nhập họ và tên (ít nhất 2 ký tự).';
  }
  const phone = String(values.phone).replace(/[\s.\-]/g, '');
  if (!PHONE_PATTERN.test(phone)) {
    errors.phone = 'Số điện thoại chưa đúng, ví dụ 0912 345 678.';
  }
  const email = String(values.email).trim();
  if (email !== '' && !EMAIL_PATTERN.test(email)) {
    errors.email = 'Email chưa đúng định dạng.';
  }
  if (!values.product) {
    errors.product = 'Vui lòng chọn sản phẩm.';
  }
  const qty = Number(values.quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
    errors.quantity = 'Số lượng từ 1 đến 99.';
  }
  return errors;
}

function initModal() {
  const modal = document.getElementById('order-modal');
  const form = document.getElementById('order-form');
  if (!modal || !form || typeof modal.showModal !== 'function') {
    return;
  }

  const fields = {
    name: document.getElementById('order-name'),
    phone: document.getElementById('order-phone'),
    email: document.getElementById('order-email'),
    product: document.getElementById('order-product'),
    quantity: document.getElementById('order-qty')
  };
  const totalOutput = document.getElementById('order-total');
  const successBox = document.getElementById('order-success');
  const successTitle = document.getElementById('order-success-title');
  const successText = document.getElementById('order-success-text');

  // Danh sách sản phẩm trong Modal cũng lấy từ mảng products
  renderProductOptions(products, fields.product);

  /* --- Các hàm hỗ trợ --- */
  function setError(key, message) {
    const errorBox = document.getElementById('error-' + key);
    if (errorBox) {
      errorBox.textContent = message || '';
    }
    if (message) {
      fields[key].setAttribute('aria-invalid', 'true');
    } else {
      fields[key].removeAttribute('aria-invalid');
    }
  }

  function clearErrors() {
    Object.keys(fields).forEach(function (key) { setError(key, ''); });
  }

  function updateTotal() {
    totalOutput.textContent = formatPrice(
      calcTotal(products, fields.product.value, fields.quantity.value)
    );
  }

  function hasOption(select, value) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === value) {
        return true;
      }
    }
    return false;
  }

  // MỞ Modal: đưa form về trạng thái ban đầu, chọn sẵn sản phẩm, rồi hiển thị
  function openModal(productName) {
    form.reset();
    clearErrors();
    if (productName && hasOption(fields.product, productName)) {
      fields.product.value = productName;
    }
    updateTotal();
    form.hidden = false;
    successBox.hidden = true;
    document.body.classList.add('modal-open'); // khóa cuộn trang phía sau
    if (!modal.open) {
      modal.showModal();
    }
  }

  // ĐÓNG Modal
  function closeModal() {
    if (modal.open) {
      modal.close();
    }
  }

  /* --- Các sự kiện --- */

  // 1) click toàn trang: bắt mọi nút có thuộc tính data-open-modal.
  //    Dùng ủy quyền sự kiện vì nút "Đặt mua" được JS sinh ra sau khi trang tải.
  document.addEventListener('click', function (event) {
    const opener = event.target.closest('[data-open-modal]');
    if (opener) {
      openModal(opener.dataset.product);
    }
  });

  // 2a) mousedown: ghi nhận chuột bắt đầu bấm ở đâu. Nếu người dùng bôi đen chữ trong
  //     ô nhập rồi nhả chuột ra nền mờ thì trình duyệt vẫn tạo sự kiện click trên <dialog>;
  //     biến này giúp không đóng Modal nhầm trong trường hợp đó.
  let pressStartedOnBackdrop = false;
  modal.addEventListener('mousedown', function (event) {
    pressStartedOnBackdrop = (event.target === modal);
  });

  // 2b) click trong Modal: nút đóng (dấu x, nút "Đóng") hoặc bấm ra vùng nền mờ.
  //     Bấm vào nền mờ thì event.target chính là thẻ <dialog>.
  modal.addEventListener('click', function (event) {
    const clickedBackdrop = (event.target === modal && pressStartedOnBackdrop);
    if (clickedBackdrop || event.target.closest('[data-close-modal]')) {
      closeModal();
    }
  });

  // 3) close: chạy khi Modal đóng bằng BẤT KỲ cách nào (nút, nền mờ, phím Esc)
  modal.addEventListener('close', function () {
    document.body.classList.remove('modal-open');
  });

  // 4) input: xóa thông báo lỗi của ô đang gõ; đổi số lượng thì tính lại tạm tính
  form.addEventListener('input', function (event) {
    const key = event.target.name;
    if (fields[key]) {
      setError(key, '');
    }
    if (event.target === fields.quantity) {
      updateTotal();
    }
  });

  // 5) change: đổi sản phẩm trong danh sách chọn thì tính lại tạm tính
  form.addEventListener('change', function (event) {
    if (event.target === fields.product) {
      updateTotal();
    }
  });

  // 6) submit: chặn hành vi mặc định (tải lại trang), kiểm tra dữ liệu rồi báo kết quả
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const values = {
      name: fields.name.value,
      phone: fields.phone.value,
      email: fields.email.value,
      product: fields.product.value,
      quantity: fields.quantity.value
    };
    const errors = validateOrder(values);
    const errorKeys = Object.keys(errors);

    clearErrors();
    if (errorKeys.length > 0) {
      errorKeys.forEach(function (key) { setError(key, errors[key]); });
      fields[errorKeys[0]].focus(); // đưa con trỏ về ô lỗi đầu tiên
      return;
    }

    const quantity = Number(values.quantity);
    const total = calcTotal(products, values.product, quantity);
    successText.textContent =
      'Cảm ơn ' + values.name.trim() + '! Hạt Mộc đã ghi nhận đăng ký ' +
      quantity + ' x ' + values.product + ' (tạm tính ' + formatPrice(total) +
      ') và sẽ gọi số ' + values.phone.trim() + ' trong vòng 30 phút.';
    form.hidden = true;
    successBox.hidden = false;
    successTitle.focus();
  });
}

/* 6. KHỞI ĐỘNG TRANG ---------------------------------- */
function initShop() {
  const grid = document.getElementById('product-grid');
  const filterBar = document.getElementById('filter-bar');
  const resultCount = document.getElementById('result-count');
  const productSelect = document.getElementById('sp');

  function showCategory(categoryId) {
    const visible = filterProducts(products, categoryId);
    renderProducts(visible, grid);
    renderFilterButtons(CATEGORIES, products, filterBar, categoryId);
    if (resultCount) {
      resultCount.textContent = 'Đang hiển thị ' + visible.length + '/' + products.length + ' sản phẩm';
    }
    // Thẻ mới được thêm sau khi AOS khởi tạo nên cần quét lại
    if (hasAOS()) {
      window.AOS.refreshHard();
    }
  }

  // Bấm nút lọc: dùng một trình nghe sự kiện cho cả thanh lọc
  if (filterBar) {
    filterBar.addEventListener('click', function (event) {
      const button = event.target.closest('button[data-category]');
      if (button) {
        showCategory(button.dataset.category);
      }
    });
  }

  renderProductOptions(products, productSelect);
  showCategory('all');
}

if (typeof document !== 'undefined') {
  if (hasAOS()) {
    // Khởi tạo AOS TRƯỚC khi render, để AOS tự quét các thẻ vừa tạo
    window.AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });
  }
  initShop();
  initModal();
}

// Cho phép chạy thử logic bằng Node.js (không ảnh hưởng trình duyệt)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { products, CATEGORIES, formatPrice, createProductCard, renderProducts, filterProducts, calcTotal, validateOrder };
}
