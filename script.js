
/* =====================================
   ROTI'O - SCRIPT.JS
   Menu, Foto, Paket Hemat, Keranjang
===================================== */

// GANTI dengan nomor WhatsApp tujuan.
// Gunakan kode negara 62, tanpa tanda +.
const NOMOR_WA = "628xxxxxxxxxx";

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);
}

// DATA MENU DAN FOTO
// Nama file foto mengikuti file yang terlihat di GitHub.
const daftarMenu = [
  {
    id: "roti-original",
    nama: "Roti Original",
    kategori: "Roti",
    harga: 12000,
    foto: "ori.jpg",
    emoji: "🥐",
    deskripsi: "Roti kopi dengan aroma khas."
  },
  {
    id: "roti-cokelat",
    nama: "Roti Cokelat",
    kategori: "Roti",
    harga: 14000,
    foto: "kue.jpg",
    emoji: "🍫",
    deskripsi: "Pilihan roti dengan rasa cokelat."
  },
  {
    id: "croissant",
    nama: "Croissant",
    kategori: "Pastry",
    harga: 18000,
    foto: "crombo.jpg",
    emoji: "🥐",
    deskripsi: "Pastry renyah untuk teman santai."
  },
  {
    id: "croissant-martabak",
    nama: "Martabak",
    kategori: "Pastry",
    harga: 20000,
    foto: "martabak.jpg",
    emoji: "🥮",
    deskripsi: "Camilan dengan rasa yang nikmat."
  },
  {
    id: "cone",
    nama: "Es Krim Cone",
    kategori: "Es Krim",
    harga: 12000,
    foto: "cone.jpg",
    emoji: "🍦",
    deskripsi: "Es krim cone yang menyegarkan."
  },
  {
    id: "latte",
    nama: "Latte",
    kategori: "Minuman",
    harga: 18000,
    foto: "latte.jpg",
    emoji: "☕",
    deskripsi: "Kopi susu dengan rasa lembut."
  },
  {
    id: "boba",
    nama: "Es Boba",
    kategori: "Minuman",
    harga: 18000,
    foto: "esboba.jpg",
    emoji: "🥤",
    deskripsi: "Minuman segar untuk menemani harimu."
  },
  {
    id: "gula-merah",
    nama: "Gula Merah",
    kategori: "Minuman",
    harga: 18000,
    foto: "gulamerah.jpg",
    emoji: "🧋",
    deskripsi: "Minuman dengan rasa gula merah."
  },
  {
    id: "leci",
    nama: "Leci",
    kategori: "Minuman",
    harga: 17000,
    foto: "leci.jpg",
    emoji: "🥤",
    deskripsi: "Minuman dengan rasa leci."
  },
  {
    id: "roti-kopi",
    nama: "Roti Kopi",
    kategori: "Roti",
    harga: 12000,
    foto: "roties.jpg",
    emoji: "🍞",
    deskripsi: "Roti dengan aroma kopi."
  }
];

// DATA PAKET HEMAT
const daftarPaket = [
  {
    id: "paket-1",
    nama: "Paket Santai",
    harga: 25000,
    foto: "ori.jpg",
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
    foto: "roties.jpg",
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
    foto: "cone.jpg",
    emoji: "🎁",
    deskripsi: "Roti Original + Latte + Es Krim",
    isi: [
      { nama: "Roti Original", jumlah: 1 },
      { nama: "Latte", jumlah: 1 },
      { nama: "Es Krim Cone", jumlah: 1 }
    ]
  }
];

let keranjang = [];

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

// MEMBUAT KARTU FOTO PRODUK
function buatFoto(foto, nama, emoji, kelas = "") {
  return `
    <div class="${kelas}">
      <img
        src="${foto}"
        alt="${nama}"
        loading="lazy"
        onerror="
          this.style.display='none';
          this.nextElementSibling.style.display='grid';
        "
      >
      <span class="image-placeholder" style="display:none">
        ${emoji}
      </span>
    </div>
  `;
}

// MENAMPILKAN SEMUA MENU
function tampilkanMenu(kategori = "Semua") {
  if (!menuGrid) return;

  const menuTerpilih = daftarMenu.filter(menu =>
    kategori === "Semua" || menu.kategori === kategori
  );

  menuGrid.innerHTML = "";

  if (menuTerpilih.length === 0) {
    menuGrid.innerHTML =
      '<p class="empty-menu">Menu belum tersedia.</p>';
    return;
  }

  menuTerpilih.forEach(menu => {
    const kartu = document.createElement("article");
    kartu.className = "menu-card";

    kartu.innerHTML = `
      ${buatFoto(menu.foto, menu.nama, menu.emoji, "menu-image")
        .replace(
          '<div class="menu-image">',
          '<div class="menu-image">'
        )}

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

// MENAMPILKAN PAKET HEMAT
function tampilkanPaket() {
  if (!presetGrid) return;

  presetGrid.innerHTML = "";

  daftarPaket.forEach(paket => {
    const kartu = document.createElement("article");
    kartu.className = "preset-card";

    kartu.innerHTML = `
      ${buatFoto(
        paket.foto,
        paket.nama,
        paket.emoji,
        "preset-image"
      )}

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

// MENAMBAHKAN MENU
function tambahMenu(id) {
  const menu = daftarMenu.find(item => item.id === id);
  if (!menu) return;

  const itemAda = keranjang.find(
    item => item.id === id && item.tipe === "menu"
  );

  if (itemAda) {
    itemAda.jumlah++;
  } else {
    keranjang.push({
      ...menu,
      tipe: "menu",
      jumlah: 1
    });
  }

  perbaruiKeranjang();
  animasiKeranjang();
  tampilkanToast(menu.nama + " ditambahkan!");
}

// MENAMBAHKAN PAKET
function tambahPaket(id) {
  const paket = daftarPaket.find(item => item.id === id);
  if (!paket) return;

  const itemAda = keranjang.find(
    item => item.id === id && item.tipe === "paket"
  );

  if (itemAda) {
    itemAda.jumlah++;
  } else {
    keranjang.push({
      ...paket,
      tipe: "paket",
      jumlah: 1
    });
  }

  perbaruiKeranjang();
  animasiKeranjang();
  tampilkanToast(paket.nama + " ditambahkan!");
}

// TOMBOL TAMBAH MENU DAN PAKET
document.addEventListener("click", event => {
  const tombolMenu = event.target.closest(".add-cart");
  const tombolPaket = event.target.closest("[data-paket]");

  if (tombolMenu) {
    tambahMenu(tombolMenu.dataset.id);
  }

  if (tombolPaket) {
    tambahPaket(tombolPaket.dataset.paket);
  }
});

// HITUNG ITEM DAN TOTAL
function hitungJumlahItem() {
  return keranjang.reduce(
    (total, item) => total + item.jumlah,
    0
  );
}

function hitungTotal() {
  return keranjang.reduce(
    (total, item) => total + item.harga * item.jumlah,
    0
  );
}

// MEMPERBARUI KERANJANG
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
        Keranjang masih kosong. Pilih menu favoritmu!
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
        <small>${formatRupiah(item.harga)} / item</small>

        <div class="quantity-control">
          <button data-aksi="kurang" data-id="${item.id}"
            data-tipe="${item.tipe}">−</button>

          <span>${item.jumlah}</span>

          <button data-aksi="tambah" data-id="${item.id}"
            data-tipe="${item.tipe}">+</button>
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
    orderSummaryItems.innerHTML =
      '<p class="empty-text">Belum ada menu yang dipilih.</p>';
    return;
  }

  keranjang.forEach(item => {
    const elemen = document.createElement("div");
    elemen.className = "summary-item";

    elemen.innerHTML = `
      <div>
        <b>${item.nama}</b>
        <small>
          ${item.jumlah} × ${formatRupiah(item.harga)}
        </small>
      </div>
      <b>${formatRupiah(item.harga * item.jumlah)}</b>
    `;

    orderSummaryItems.appendChild(elemen);
  });
}

// UBAH JUMLAH
document.addEventListener("click", event => {
  const tombol = event.target.closest("[data-aksi]");
  if (!tombol) return;

  const item = keranjang.find(item =>
    item.id === tombol.dataset.id &&
    item.tipe === tombol.dataset.tipe
  );

  if (!item) return;

  if (tombol.dataset.aksi === "tambah") {
    item.jumlah++;
  } else {
    item.jumlah--;

    if (item.jumlah <= 0) {
      keranjang = keranjang.filter(
        data => data !== item
      );
    }
  }

  perbaruiKeranjang();
});

// ANIMASI KERANJANG
function animasiKeranjang() {
  const tombol = document.getElementById("floatingCart");

  tombol.classList.remove("bump");
  void tombol.offsetWidth;
  tombol.classList.add("bump");
}

// BUKA DAN TUTUP KERANJANG
function bukaKeranjang() {
  cartPanel.classList.add("open");
  cartBackdrop.classList.add("show");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

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
  tampilkanToast("Keranjang dikosongkan.");
});

// MENUJU CHECKOUT
function menujuPemesanan() {
  tutupKeranjang();

  document.getElementById("pemesanan").scrollIntoView({
    behavior: "smooth"
  });
}

document.getElementById("goCheckout")
  .addEventListener("click", menujuPemesanan);

document.getElementById("reviewCart").addEventListener("click", () => {
  if (keranjang.length === 0) {
    tampilkanToast("Pilih menu terlebih dahulu.");
  }

  bukaKeranjang();
});

// METODE PESANAN DAN ALAMAT
const orderType = document.getElementById("orderType");
const addressGroup = document.getElementById("addressGroup");
const customerAddress = document.getElementById("customerAddress");

orderType.addEventListener("change", () => {
  const perluAlamat = orderType.value === "Antar ke alamat";

  addressGroup.classList.toggle("hidden", !perluAlamat);
  customerAddress.required = perluAlamat;

  if (!perluAlamat) customerAddress.value = "";
});

// KIRIM PESANAN KE WHATSAPP
document.getElementById("orderForm").addEventListener("submit", event => {
  event.preventDefault();

  if (keranjang.length === 0) {
    tampilkanToast("Pilih menu terlebih dahulu.");
    bukaKeranjang();
    return;
  }

  if (NOMOR_WA.includes("x")) {
    tampilkanToast("Atur nomor WhatsApp di script.js terlebih dahulu.");
    return;
  }

  const nama = document.getElementById("customerName").value.trim();
  const telepon = document.getElementById("customerPhone").value.trim();
  const metode = orderType.value;
  const waktu = document.getElementById("pickupTime").value.trim();
  const alamat = customerAddress.value.trim();
  const catatan = document.getElementById("notes").value.trim();

  if (!nama || !telepon || !metode || !waktu) {
    tampilkanToast("Lengkapi data pemesanan.");
    return;
  }

  if (metode === "Antar ke alamat" && !alamat) {
    tampilkanToast("Masukkan alamat pengantaran.");
    customerAddress.focus();
    return;
  }

  let pesan = "PESANAN ROTI'O\n\n";
  pesan += `Nama: ${nama}\n`;
  pesan += `Nomor WhatsApp: ${telepon}\n`;
  pesan += `Metode: ${metode}\n`;
  pesan += `Waktu: ${waktu}\n`;

  if (metode === "Antar ke alamat") {
    pesan += `Alamat: ${alamat}\n`;
  }

  pesan += "\nDETAIL PESANAN:\n";

  keranjang.forEach((item, index) => {
    pesan += `${index + 1}. ${item.nama}\n`;
    pesan += `Jumlah: ${item.jumlah}\n`;
    pesan += `Subtotal: ${formatRupiah(item.harga * item.jumlah)}\n`;

    if (item.tipe === "paket" && item.isi) {
      pesan += "Isi paket:\n";

      item.isi.forEach(isi => {
        pesan += `- ${isi.nama} (${isi.jumlah})\n`;
      });
    }

    pesan += "\n";
  });

  pesan += `TOTAL: ${formatRupiah(hitungTotal())}\n`;

  if (catatan) pesan += `Catatan: ${catatan}\n`;

  pesan += "\nMohon konfirmasi pesanan. Terima kasih!";

  const url =
    `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`;

  window.open(url, "_blank", "noopener,noreferrer");
});

// NAVIGASI MOBILE
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

// TAMPILKAN SEMUA MENU DAN PAKET SAAT HALAMAN DIBUKA
tampilkanMenu();
tampilkanPaket();
perbaruiKeranjang();
