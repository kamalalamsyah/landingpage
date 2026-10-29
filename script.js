
/* =====================================
   ROTI'O - SCRIPT WEBSITE
   Tanpa fitur Bikin Paket Sendiri
===================================== */

// GANTI dengan nomor WhatsApp tujuan pemesanan.
// Gunakan kode negara 62 tanpa tanda +.
// Contoh format: 6281234567890
const NOMOR_WA = "628xxxxxxxxxx";

// FORMAT RUPIAH
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);
}

// DATA MENU
const daftarMenu = [
  {
    id: "roti-original",
    nama: "Roti Original",
    kategori: "Roti",
    harga: 12000,
    emoji: "🥐",
    deskripsi: "Roti kopi dengan aroma khas."
  },
  {
    id: "roti-cokelat",
    nama: "Roti Cokelat",
    kategori: "Roti",
    harga: 14000,
    emoji: "🍫",
    deskripsi: "Roti dengan rasa cokelat."
  },
  {
    id: "croissant",
    nama: "Croissant",
    kategori: "Pastry",
    harga: 18000,
    emoji: "🥐",
    deskripsi: "Pastry renyah dan lembut."
  },
  {
    id: "croissant-martabak",
    nama: "Croissant Martabak",
    kategori: "Pastry",
    harga: 20000,
    emoji: "🥮",
    deskripsi: "Pastry dengan rasa martabak."
  },
  {
    id: "latte",
    nama: "Latte",
    kategori: "Minuman",
    harga: 18000,
    emoji: "☕",
    deskripsi: "Kopi susu dengan rasa lembut."
  },
  {
    id: "americano",
    nama: "Americano",
    kategori: "Minuman",
    harga: 15000,
    emoji: "🧋",
    deskripsi: "Kopi dengan cita rasa khas."
  },
  {
    id: "butterscotch",
    nama: "Latte Butterscotch",
    kategori: "Minuman",
    harga: 22000,
    emoji: "🥤",
    deskripsi: "Latte dengan rasa butterscotch."
  },
  {
    id: "cokelat",
    nama: "Cokelat",
    kategori: "Minuman",
    harga: 18000,
    emoji: "🍫",
    deskripsi: "Minuman cokelat yang nikmat."
  },
  {
    id: "es-krim-vanila",
    nama: "Es Krim Vanila",
    kategori: "Es Krim",
    harga: 12000,
    emoji: "🍦",
    deskripsi: "Es krim rasa vanila."
  },
  {
    id: "es-krim-cokelat",
    nama: "Es Krim Cokelat",
    kategori: "Es Krim",
    harga: 14000,
    emoji: "🍨",
    deskripsi: "Es krim dengan rasa cokelat."
  }
];

// DATA PAKET HEMAT
const daftarPaket = [
  {
    id: "paket-1",
    nama: "Paket Santai",
    harga: 25000,
    emoji: "☕",
    deskripsi: "Roti Original + Latte",
    isi: [
      { nama: "Roti Original", jumlah: 1 },
      { nama: "Latte", jumlah: 1 }
    ]
  },
  {
    id: "paket-2",
    nama: "Paket Berdua",
    harga: 42000,
    emoji: "🥐",
    deskripsi: "2 Roti Original + 2 Latte",
    isi: [
      { nama: "Roti Original", jumlah: 2 },
      { nama: "Latte", jumlah: 2 }
    ]
  },
  {
    id: "paket-3",
    nama: "Paket Komplit",
    harga: 35000,
    emoji: "🎁",
    deskripsi: "Roti Original + Latte + Es Krim Vanila",
    isi: [
      { nama: "Roti Original", jumlah: 1 },
      { nama: "Latte", jumlah: 1 },
      { nama: "Es Krim Vanila", jumlah: 1 }
    ]
  }
];

// KERANJANG
let keranjang = [];

// ELEMEN HTML
const menuGrid = document.getElementById("menuGrid");
const presetGrid = document.getElementById("presetGrid");
const cartPanel = document.getElementById("cartPanel");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const orderSummaryItems =
  document.getElementById("orderSummaryItems");
const orderTotal = document.getElementById("orderTotal");
const toast = document.getElementById("toast");

// NOTIFIKASI
let toastTimer;

function tampilkanToast(pesan) {
  toast.textContent = pesan;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// TAMPILKAN MENU
function tampilkanMenu(kategori = "Semua") {
  const menuTerpilih = daftarMenu.filter(menu => {
    return kategori === "Semua" || menu.kategori === kategori;
  });

  menuGrid.innerHTML = "";

  if (menuTerpilih.length === 0) {
    menuGrid.innerHTML = `
      <p class="empty-menu">Menu belum tersedia.</p>
    `;
    return;
  }

  menuTerpilih.forEach(menu => {
    const kartu = document.createElement("article");
    kartu.className = "menu-card";

    kartu.innerHTML = `
      <div class="menu-image">
        <span class="image-placeholder">${menu.emoji}</span>
        <span class="menu-badge">${menu.kategori}</span>
      </div>

      <div class="menu-info">
        <h3>${menu.nama}</h3>
        <p>${menu.deskripsi}</p>

        <div class="menu-card-bottom">
          <span class="menu-price">
            ${formatRupiah(menu.harga)}
          </span>

          <button
            class="add-cart"
            data-id="${menu.id}"
            aria-label="Tambah ${menu.nama}"
            title="Tambah ke keranjang"
          >+</button>
        </div>
      </div>
    `;

    menuGrid.appendChild(kartu);
  });
}

// FILTER KATEGORI
document.querySelectorAll(".category").forEach(tombol => {
  tombol.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(item => {
      item.classList.remove("active");
    });

    tombol.classList.add("active");

    tampilkanMenu(tombol.dataset.category);
  });
});

// TAMPILKAN PAKET HEMAT
function tampilkanPaket() {
  presetGrid.innerHTML = "";

  daftarPaket.forEach(paket => {
    const kartu = document.createElement("article");
    kartu.className = "preset-card";

    kartu.innerHTML = `
      <div class="preset-icon">${paket.emoji}</div>

      <h3>${paket.nama}</h3>
      <p>${paket.deskripsi}</p>

      <div class="preset-price">
        ${formatRupiah(paket.harga)}
      </div>

      <button
        class="btn btn-primary"
        data-paket="${paket.id}"
      >
        + Tambah Paket
      </button>
    `;

    presetGrid.appendChild(kartu);
  });
}

// TAMBAH MENU KE KERANJANG
function tambahMenu(id) {
  const menu = daftarMenu.find(item => item.id === id);

  if (!menu) return;

  const itemAda = keranjang.find(item => item.id === id);

  if (itemAda) {
    itemAda.jumlah++;
  } else {
    keranjang.push({
      ...menu,
      jumlah: 1,
      tipe: "menu"
    });
  }

  perbaruiKeranjang();
  animasiKeranjang();
  tampilkanToast(menu.nama + " ditambahkan ke keranjang!");
}

// TAMBAH PAKET KE KERANJANG
function tambahPaket(id) {
  const paket = daftarPaket.find(item => item.id === id);

  if (!paket) return;

  const itemAda = keranjang.find(item => item.id === id);

  if (itemAda) {
    itemAda.jumlah++;
  } else {
    keranjang.push({
      ...paket,
      kategori: "Paket Hemat",
      tipe: "paket",
      jumlah: 1
    });
  }

  perbaruiKeranjang();
  animasiKeranjang();
  tampilkanToast(paket.nama + " ditambahkan ke keranjang!");
}

// EVENT TOMBOL MENU DAN PAKET
document.addEventListener("click", event => {
  const tombolMenu = event.target.closest(".add-cart");

  if (tombolMenu) {
    tambahMenu(tombolMenu.dataset.id);
  }

  const tombolPaket = event.target.closest("[data-paket]");

  if (tombolPaket) {
    tambahPaket(tombolPaket.dataset.paket);
  }
});

// HITUNG TOTAL ITEM
function hitungJumlahItem() {
  return keranjang.reduce((total, item) => {
    return total + item.jumlah;
  }, 0);
}

// HITUNG TOTAL HARGA
function hitungTotal() {
  return keranjang.reduce((total, item) => {
    return total + item.harga * item.jumlah;
  }, 0);
}

// PERBARUI KERANJANG DAN RINGKASAN
function perbaruiKeranjang() {
  const jumlah = hitungJumlahItem();
  const total = hitungTotal();

  document.getElementById("headerCount").textContent = jumlah;
  document.getElementById("floatingCount").textContent = jumlah;

  cartTotal.textContent = formatRupiah(total);
  orderTotal.textContent = formatRupiah(total);

  tampilkanIsiKeranjang();
  tampilkanRingkasan();
}

// ISI KERANJANG
function tampilkanIsiKeranjang() {
  cartItems.innerHTML = "";

  if (keranjang.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-text">
        Keranjang masih kosong. Yuk, pilih menu favoritmu!
      </p>
    `;
    return;
  }

  keranjang.forEach(item => {
    const elemen = document.createElement("div");
    elemen.className = "cart-item";

    elemen.innerHTML = `
      <div>
        <h4>${item.emoji} ${item.nama}</h4>

        <small>
          ${formatRupiah(item.harga)} / item
        </small>

        <div class="quantity-control">
          <button
            data-aksi="kurang"
            data-id="${item.id}"
            aria-label="Kurangi jumlah ${item.nama}"
          >−</button>

          <span>${item.jumlah}</span>

          <button
            data-aksi="tambah"
            data-id="${item.id}"
            aria-label="Tambah jumlah ${item.nama}"
          >+</button>
        </div>
      </div>

      <div class="cart-item-price">
        ${formatRupiah(item.harga * item.jumlah)}
      </div>
    `;

    cartItems.appendChild(elemen);
  });
}

// RINGKASAN PESANAN
function tampilkanRingkasan() {
  orderSummaryItems.innerHTML = "";

  if (keranjang.length === 0) {
    orderSummaryItems.innerHTML = `
      <p class="empty-text">Belum ada menu yang dipilih.</p>
    `;
    return;
  }

  keranjang.forEach(item => {
    const elemen = document.createElement("div");
    elemen.className = "summary-item";

    elemen.innerHTML = `
      <div>
        <b>${item.nama}</b>
        <small>${item.jumlah} item × ${formatRupiah(item.harga)}</small>
      </div>

      <b>${formatRupiah(item.harga * item.jumlah)}</b>
    `;

    orderSummaryItems.appendChild(elemen);
  });
}

// UBAH JUMLAH ITEM DI KERANJANG
document.addEventListener("click", event => {
  const tombol = event.target.closest("[data-aksi]");

  if (!tombol) return;

  const id = tombol.dataset.id;
  const aksi = tombol.dataset.aksi;

  const item = keranjang.find(item => item.id === id);

  if (!item) return;

  if (aksi === "tambah") {
    item.jumlah++;
  }

  if (aksi === "kurang") {
    item.jumlah--;

    if (item.jumlah <= 0) {
      keranjang = keranjang.filter(item => item.id !== id);
    }
  }

  perbaruiKeranjang();
});

// ANIMASI TOMBOL KERANJANG
function animasiKeranjang() {
  const tombol = document.getElementById("floatingCart");

  tombol.classList.remove("bump");

  void tombol.offsetWidth;

  tombol.classList.add("bump");
}

// BUKA KERANJANG
function bukaKeranjang() {
  cartPanel.classList.add("open");
  cartBackdrop.classList.add("show");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

// TUTUP KERANJANG
function tutupKeranjang() {
  cartPanel.classList.remove("open");
  cartBackdrop.classList.remove("show");
  cartPanel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.getElementById("floatingCart")
  .addEventListener("click", bukaKeranjang);

document.getElementById("headerCart")
  .addEventListener("click", bukaKeranjang);

document.getElementById("closeCart")
  .addEventListener("click", tutupKeranjang);

cartBackdrop.addEventListener("click", tutupKeranjang);

// KOSONGKAN KERANJANG
document.getElementById("clearCart").addEventListener("click", () => {
  if (keranjang.length === 0) {
    tampilkanToast("Keranjang sudah kosong.");
    return;
  }

  keranjang = [];
  perbaruiKeranjang();
  tampilkanToast("Keranjang berhasil dikosongkan.");
});

// NAVIGASI KE PEMESANAN
function menujuPemesanan() {
  tutupKeranjang();

  document.getElementById("pemesanan").scrollIntoView({
    behavior: "smooth"
  });
}

document.getElementById("goCheckout")
  .addEventListener("click", menujuPemesanan);

document.getElementById("reviewCart")
  .addEventListener("click", () => {
    if (keranjang.length === 0) {
      tampilkanToast("Pilih menu terlebih dahulu.");
      bukaKeranjang();
      return;
    }

    bukaKeranjang();
  });

// PILIH METODE PESANAN
const orderType = document.getElementById("orderType");
const addressGroup = document.getElementById("addressGroup");
const customerAddress = document.getElementById("customerAddress");

orderType.addEventListener("change", () => {
  const perluAlamat = orderType.value === "Antar ke alamat";

  addressGroup.classList.toggle("hidden", !perluAlamat);
  customerAddress.required = perluAlamat;

  if (!perluAlamat) {
    customerAddress.value = "";
  }
});

// FORM PEMESANAN WHATSAPP
document.getElementById("orderForm").addEventListener("submit", event => {
  event.preventDefault();

  if (keranjang.length === 0) {
    tampilkanToast("Keranjang masih kosong. Pilih menu dahulu.");
    bukaKeranjang();
    return;
  }

  if (NOMOR_WA.includes("x")) {
    tampilkanToast("Atur nomor WhatsApp tujuan di script.js terlebih dahulu.");
    return;
  }

  const nama = document.getElementById("customerName").value.trim();
  const telepon = document.getElementById("customerPhone").value.trim();
  const metode = orderType.value;
  const waktu = document.getElementById("pickupTime").value.trim();
  const alamat = customerAddress.value.trim();
  const catatan = document.getElementById("notes").value.trim();

  if (!nama || !telepon || !metode || !waktu) {
    tampilkanToast("Lengkapi data pemesanan terlebih dahulu.");
    return;
  }

  if (metode === "Antar ke alamat" && !alamat) {
    tampilkanToast("Masukkan alamat pengantaran.");
    customerAddress.focus();
    return;
  }

  let pesan = `PESANAN ROTI'O\n\n`;
  pesan += `Nama: ${nama}\n`;
  pesan += `Nomor WhatsApp: ${telepon}\n`;
  pesan += `Metode: ${metode}\n`;
  pesan += `Waktu: ${waktu}\n`;

  if (metode === "Antar ke alamat") {
    pesan += `Alamat: ${alamat}\n`;
  }

  pesan += `\nDETAIL PESANAN:\n`;

  keranjang.forEach((item, index) => {
    pesan += `${index + 1}. ${item.nama}\n`;
    pesan += `   Jumlah: ${item.jumlah}\n`;
    pesan += `   Harga: ${formatRupiah(item.harga * item.jumlah)}\n`;

    if (item.tipe === "paket" && item.isi) {
      pesan += `   Isi paket:\n`;

      item.isi.forEach(isi => {
        pesan += `   - ${isi.nama} (${isi.jumlah} item)\n`;
      });
    }
  });

  pesan += `\nTOTAL: ${formatRupiah(hitungTotal())}\n`;

  if (catatan) {
    pesan += `\nCatatan: ${catatan}\n`;
  }

  pesan += `\nMohon konfirmasi ketersediaan dan total pesanan. Terima kasih!`;

  const url =
    `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`;

  window.open(url, "_blank", "noopener,noreferrer");
});

// MENU MOBILE
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
  const terbuka = navigation.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", terbuka);
  menuToggle.textContent = terbuka ? "✕" : "☰";
});

navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// TUTUP KERANJANG DENGAN TOMBOL ESCAPE
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    tutupKeranjang();
    navigation.classList.remove("open");
    menuToggle.textContent = "☰";
  }
});

// TAHUN FOOTER
document.getElementById("year").textContent =
  new Date().getFullYear();

// TAMPILKAN WEBSITE
tampilkanMenu();
tampilkanPaket();
perbaruiKeranjang();
