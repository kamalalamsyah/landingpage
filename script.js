const rupiah = amount => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(amount);

const products = [
  { id: "latte", name: "Latte Butterscotch", category: "Minuman", price: 18000, rating: "4.8", emoji: "☕", image: "latte.jpg" },
  { id: "gula-merah", name: "Cokelat Gula Merah", category: "Minuman", price: 16000, rating: "4.7", emoji: "🥤", image: "gulamerah.jpg" },
  { id: "teh-leci", name: "Teh Leci Es", category: "Minuman", price: 14000, rating: "4.6", emoji: "🧋", image: "leci.jpg" },
  { id: "cromboo", name: "Crombo'O", category: "Pastry", price: 17000, rating: "4.8", emoji: "🥐", image: "crombo.jpg" },
  { id: "martabak", name: "Croissant Martabak", category: "Pastry", price: 16000, rating: "4.7", emoji: "🥮", image: "martabak.jpg" },
  { id: "kue-cokelat", name: "Kue Cokelat", category: "Pastry", price: 15000, rating: "4.6", emoji: "🍫", image: "kue.jpg" },
  { id: "es-vanila", name: "Es Krim Roti Vanila Cokelat", category: "Es Krim", price: 15000, rating: "4.7", emoji: "🍦", image: "roties.jpg" },
  { id: "boba", name: "Es Krim Boba Pelangi", category: "Es Krim", price: 14000, rating: "4.5", emoji: "🍨", image: "esboba.jpg" },
  { id: "kerucut", name: "Es Krim Kerucut", category: "Es Krim", price: 12000, rating: "4.4", emoji: "🍦", image: "cone.jpg" },
  { id: "original", name: "Roti Original", category: "Roti", price: 10000, rating: "4.6", emoji: "🍞", image: "ori.jpg" }
];

const presets = [
  { id: "paket-1", name: "Paket Ngemil 1", desc: "Crombo'O + Teh Leci Es", items: { cromboo: 1, "teh-leci": 1 }, price: 26000, normal: 31000, emoji: "🥐" },
  { id: "paket-2", name: "Paket Ngemil 2", desc: "Croissant Martabak + Latte Butterscotch", items: { martabak: 1, latte: 1 }, price: 31000, normal: 34000, emoji: "☕" },
  { id: "paket-3", name: "Paket Manis 3", desc: "Es Krim Vanila Cokelat + Cokelat Gula Merah", items: { "es-vanila": 1, "gula-merah": 1 }, price: 27000, normal: 31000, emoji: "🍦" },
  { id: "paket-4", name: "Paket Lengkap", desc: "Latte Butterscotch + Crombo'O + Es Krim Boba Pelangi", items: { latte: 1, cromboo: 1, boba: 1 }, price: 46000, normal: 49000, emoji: "🎁" }
];

const cart = new Map();
let activeCategory = "Semua";
let customPackage = {};
let toastTimer;

const $ = id => document.getElementById(id);
const productById = id => products.find(p => p.id === id);
const totalItems = () => [...cart.values()].reduce((sum, item) => sum + item.qty, 0);
const cartTotal = () => [...cart.values()].reduce((sum, item) => sum + item.price * item.qty, 0);

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function renderProducts() {
  const filtered = activeCategory === "Semua"
    ? products
    : products.filter(p => p.category === activeCategory);

  $("menuGrid").innerHTML = filtered.map(p => `
    <article class="menu-card">
      <div class="menu-picture">
        <img src="${p.image}" alt="${p.name}" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <span class="menu-emoji" style="display:none">${p.emoji}</span>
      </div>
      <div class="menu-info">
        <h3>${p.name}</h3>
        <span class="category-label">${p.category}</span>
        <div class="menu-price">${rupiah(p.price)}</div>
        <div class="menu-bottom">
          <span class="rating">★ <span style="color:#66594f">${p.rating}</span></span>
          <button class="add-btn" data-add="${p.id}" aria-label="Tambah ${p.name}">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addItem(id, qty = 1, priceOverride = null, nameOverride = null) {
  if (qty <= 0) return;
  const product = productById(id);
  const price = priceOverride ?? product?.price;
  const name = nameOverride ?? product?.name;
  if (price == null || !name) return;

  if (cart.has(id)) {
    cart.get(id).qty += qty;
  } else {
    cart.set(id, { id, name, price, qty });
  }
  renderCart();
  showToast(`${name} ditambahkan ke keranjang.`);
}

function changeQty(id, delta) {
  if (!cart.has(id)) return;
  const item = cart.get(id);
  item.qty += delta;
  if (item.qty <= 0) cart.delete(id);
  renderCart();
}

function renderCart() {
  const entries = [...cart.values()];
  const count = totalItems();
  const total = cartTotal();

  $("headerCount").textContent = count;
  $("floatingCount").textContent = count;
  $("cartTotal").textContent = rupiah(total);
  $("orderTotal").textContent = rupiah(total);

  if (!entries.length) {
    $("cartItems").innerHTML = '<p class="empty-text">Keranjang masih kosong. Yuk, pilih menu favoritmu!</p>';
    $("orderSummaryItems").innerHTML = '<p class="empty-text">Belum ada menu yang dipilih.</p>';
    return;
  }

  $("cartItems").innerHTML = entries.map(item => `
    <div class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <small>${rupiah(item.price)} / item</small>
        <div class="cart-item-controls">
          <button data-minus="${item.id}" aria-label="Kurangi ${item.name}">−</button>
          <span>${item.qty}</span>
          <button data-plus="${item.id}" aria-label="Tambah ${item.name}">+</button>
        </div>
      </div>
      <strong>${rupiah(item.price * item.qty)}</strong>
    </div>
  `).join("");

  $("orderSummaryItems").innerHTML = entries.map(item => `
    <div class="summary-line">
      <span>${item.name}<small>${item.qty} × ${rupiah(item.price)}</small></span>
      <b>${rupiah(item.price * item.qty)}</b>
    </div>
  `).join("");
}

function openCart() {
  $("cartPanel").classList.add("open");
  $("cartBackdrop").classList.add("open");
  $("cartPanel").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $("closeCart").focus();
}

function closeCart() {
  $("cartPanel").classList.remove("open");
  $("cartBackdrop").classList.remove("open");
  $("cartPanel").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderPackageChoices() {
  $("packageChoices").innerHTML = products.map(p => `
    <div class="package-choice">
      <div><b>${p.name}</b><small>${rupiah(p.price)} / item</small></div>
      <div class="quantity-controls">
        <button data-package-minus="${p.id}" aria-label="Kurangi ${p.name}">−</button>
        <span>${customPackage[p.id] || 0}</span>
        <button data-package-plus="${p.id}" aria-label="Tambah ${p.name}">+</button>
      </div>
    </div>
  `).join("");
  updatePackageTotal();
}

function updatePackageTotal() {
  const quantity = Object.values(customPackage).reduce((sum, n) => sum + n, 0);
  const total = Object.entries(customPackage).reduce((sum, [id, qty]) => {
    return sum + (productById(id)?.price || 0) * qty;
  }, 0);
  $("packageQuantity").textContent = `${quantity} item`;
  $("packageTotal").textContent = rupiah(total);
  $("addPackage").disabled = quantity === 0;
  $("addPackage").style.opacity = quantity === 0 ? ".55" : "1";
}

function renderPresets() {
  $("presetGrid").innerHTML = presets.map(p => `
    <article class="preset-card">
      <div class="preset-emoji">${p.emoji}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="preset-prices"><strong>${rupiah(p.price)}</strong><del>${rupiah(p.normal)}</del></div>
      <button class="btn btn-primary" data-preset="${p.id}">Pilih Paket +</button>
    </article>
  `).join("");
}

function addPreset(preset) {
  const name = preset.name;
  const packageId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  addItem(packageId, 1, preset.price, name);
  const item = cart.get(packageId);
  item.description = preset.desc;
}

$("categoryNav").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".category").forEach(b => b.classList.toggle("active", b === button));
  renderProducts();
});

$("menuGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addItem(button.dataset.add);
});

$("packageChoices").addEventListener("click", event => {
  const plus = event.target.closest("[data-package-plus]");
  const minus = event.target.closest("[data-package-minus]");
  if (plus) {
    const id = plus.dataset.packagePlus;
    customPackage[id] = (customPackage[id] || 0) + 1;
  }
  if (minus) {
    const id = minus.dataset.packageMinus;
    customPackage[id] = Math.max(0, (customPackage[id] || 0) - 1);
    if (customPackage[id] === 0) delete customPackage[id];
  }
  renderPackageChoices();
});

$("addPackage").addEventListener("click", () => {
  const entries = Object.entries(customPackage).filter(([, qty]) => qty > 0);
  if (!entries.length) return showToast("Pilih minimal satu menu untuk paketmu.");

  const total = entries.reduce((sum, [id, qty]) => sum + productById(id).price * qty, 0);
  const description = entries.map(([id, qty]) => `${productById(id).name} ×${qty}`).join(", ");
  const id = `racikan-${Date.now()}`;
  addItem(id, 1, total, "Paket Racikan");
  cart.get(id).description = description;
  customPackage = {};
  renderPackageChoices();
});

$("presetGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-preset]");
  if (!button) return;
  const preset = presets.find(p => p.id === button.dataset.preset);
  if (preset) addPreset(preset);
});

$("cartItems").addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  if (plus) changeQty(plus.dataset.plus, 1);
  if (minus) changeQty(minus.dataset.minus, -1);
});

["floatingCart", "headerCart", "reviewCart"].forEach(id => {
  $(id).addEventListener("click", openCart);
});
$("closeCart").addEventListener("click", closeCart);
$("cartBackdrop").addEventListener("click", closeCart);
$("clearCart").addEventListener("click", () => {
  cart.clear();
  renderCart();
  showToast("Keranjang sudah dikosongkan.");
});

$("goCheckout").addEventListener("click", () => {
  closeCart();
  $("pemesanan").scrollIntoView({ behavior: "smooth" });
  if (!cart.size) showToast("Pilih menu terlebih dahulu.");
  else $("customerName").focus({ preventScroll: true });
});

$("menuToggle").addEventListener("click", () => {
  const nav = $("navigation");
  nav.classList.toggle("open");
  $("menuToggle").setAttribute("aria-expanded", nav.classList.contains("open"));
});

$("navigation").addEventListener("click", event => {
  if (event.target.closest("a")) {
    $("navigation").classList.remove("open");
    $("menuToggle").setAttribute("aria-expanded", "false");
  }
});

$("orderType").addEventListener("change", event => {
  const delivery = event.target.value === "Antar ke alamat";
  $("addressGroup").classList.toggle("hidden", !delivery);
  $("customerAddress").required = delivery;
});

$("orderForm").addEventListener("submit", event => {
  event.preventDefault();

  if (!cart.size) {
    showToast("Keranjang masih kosong. Pilih menu terlebih dahulu.");
    openCart();
    return;
  }

  const form = new FormData(event.currentTarget);
  const name = String(form.get("customerName")).trim();
  const phone = String(form.get("customerPhone")).trim();
  const type = String(form.get("orderType"));
  const time = String(form.get("pickupTime")).trim();
  const address = String(form.get("customerAddress") || "").trim();
  const notes = String(form.get("notes") || "").trim();

  if (!name || !phone || !type || !time) {
    showToast("Lengkapi semua kolom wajib.");
    return;
  }
  if (type === "Antar ke alamat" && !address) {
    showToast("Masukkan alamat pengantaran.");
    $("customerAddress").focus();
    return;
  }

  const lines = [...cart.values()].map(item =>
    `- ${item.name} (${item.qty} x ${rupiah(item.price)}) = ${rupiah(item.qty * item.price)}`
  );

  const message = [
    "*PESANAN ROTI'O*",
    "",
    `Nama: ${name}`,
    `WhatsApp pelanggan: ${phone}`,
    `Metode: ${type}`,
    `Waktu: ${time}`,
    ...(type === "Antar ke alamat" ? [`Alamat: ${address}`] : []),
    "",
    "*Detail menu:*",
    ...lines,
    "",
    `*TOTAL: ${rupiah(cartTotal())}*`,
    `Catatan: ${notes || "-"}`,
    "",
    "Mohon konfirmasi ketersediaan menu dan pesanan saya. Terima kasih."
  ].join("\n");

  // Ganti nomor di bawah dengan nomor WhatsApp bisnis dalam format internasional.
  // Contoh Indonesia: 6281234567890 (tanpa tanda +, spasi, atau angka 0 di depan).
  const whatsappNumber = "6281234567890";

  if (whatsappNumber === "6281234567890") {
    showToast("Ganti nomor WhatsApp bisnis di script.js sebelum menerima pesanan.");
  }

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

$("year").textContent = new Date().getFullYear();

renderProducts();
renderPackageChoices();
renderPresets();
renderCart();
