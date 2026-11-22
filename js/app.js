/* =========================================================
   Kompas Filkom — app.js
   JavaScript sengaja dibuat kecil. Hanya untuk hal yang tidak bisa
   dikerjakan HTML + CSS:
   1. Menyimpan tiket yang sudah didaftar (localStorage)
   2. Status "Mengirim…" sebelum pindah ke Riwayat
   3. Membuka tiket yang dituju dan menutup akordeon tiket
   4. Menyaring event lewat kolom "Cari event"
   Semua interaksi lain (chip filter, checkbox, dialog) tetap CSS.
   Tambahkan ?reset di alamat halaman untuk menghapus data demo.
   ========================================================= */


/* ---------- Penyimpanan tiket ----------
   localStorage = tempat penyimpanan kecil di browser. Isinya tetap ada
   walaupun halaman ditutup, tapi hanya di browser/HP itu saja. */

// Nama "laci" penyimpanan untuk daftar event yang sudah didaftar
const KUNCI = "kompasFilkom.tiket";

// Ambil daftar tiket, contoh hasil: ["magang-go-2026", "bcc-x-merkle"]
// try/catch: kalau penyimpanan diblokir (mode privat), kembalikan daftar kosong
function ambilTiket() {
  try { return JSON.parse(localStorage.getItem(KUNCI)) || []; } catch { return []; }
}

// Simpan daftar tiket (diubah jadi teks JSON karena localStorage hanya bisa menyimpan teks)
function simpanTiket(daftar) {
  try { localStorage.setItem(KUNCI, JSON.stringify(daftar)); } catch { /* mode privat: abaikan */ }
}

// Kalau alamat halaman berisi ?reset (contoh riwayat.html?reset), hapus semua tiket demo
if (new URLSearchParams(location.search).has("reset")) simpanTiket([]);

// Daftar tiket yang tersimpan saat halaman dibuka
const tiket = ambilTiket();


/* ---------- 1a. Halaman detail event ----------
   <body> di halaman detail punya atribut data-event="nama-event".
   Kalau event itu sudah didaftar, tambahkan class .sudah-daftar ke <body>.
   CSS lalu menyembunyikan tombol "Daftar sekarang" dan menampilkan
   kotak "Kamu sudah terdaftar". */
const eventHalaman = document.body.dataset.event;
if (eventHalaman && tiket.includes(eventHalaman)) document.body.classList.add("sudah-daftar");


/* ---------- 1b. Halaman Riwayat ----------
   Semua tiket sudah ada di HTML tetapi disembunyikan CSS.
   Untuk setiap event yang sudah didaftar, tambahkan class .is-terdaftar
   ke tiketnya (#tiket-...) dan ke item daftar desktop (.nv-...) supaya tampil. */
tiket.forEach((slug) => {
  document.querySelectorAll(`#tiket-${slug}, .nv-${slug}`).forEach((el) => el.classList.add("is-terdaftar"));
});


/* ---------- 2. Tombol "Ya, kirim" di dialog konfirmasi ----------
   Tombol ini punya atribut data-daftar="nama-event". Saat diklik:
   simpan tiket → ubah tulisan jadi "Mengirim…" → tunggu 0,7 detik → buka Riwayat. */
document.querySelectorAll("[data-daftar]").forEach((tombol) => {
  tombol.addEventListener("click", (ev) => {
    ev.preventDefault();                                   // tahan dulu, jangan langsung pindah halaman
    const slug = tombol.dataset.daftar;
    if (!tiket.includes(slug)) simpanTiket([...tiket, slug]); // tambahkan event ini ke daftar (kalau belum ada)
    tombol.textContent = "Mengirim…";                      // ganti tulisan tombol
    tombol.classList.add("is-sending");                    // CSS menampilkan lingkaran berputar
    tombol.setAttribute("aria-busy", "true");              // beri tahu pembaca layar bahwa sedang memproses
    setTimeout(() => { location.href = tombol.href; }, 700); // setelah 700 ms, pindah ke riwayat.html#ok-...
  });
});


/* ---------- 3. Riwayat & sertifikat: buka-tutup tiket ----------
   Setiap tiket punya radio tersembunyi (.rr). Radio yang dipilih = tiket yang terbuka. */
const rw = document.querySelector(".rw");
if (rw) {
  // Ambil nama event dari alamat, contoh #ok-magang-go-2026 → "magang-go-2026"
  const tujuan = location.hash.replace(/^#(ok|tiket)-/, "");
  const radioTujuan = tujuan && document.getElementById(`r-${tujuan}`);

  if (radioTujuan) radioTujuan.checked = true; // buka tiket yang dituju (contoh: baru saja didaftar)
  else if (!rw.querySelector(".rr:checked") && matchMedia("(min-width: 1100px)").matches) {
    rw.querySelector(".rr").checked = true; // desktop: pilih tiket pertama supaya panel kanan tidak kosong
  }

  // Mengetuk kepala tiket yang sedang terbuka akan menutupnya lagi (HP/tablet)
  rw.querySelectorAll(".tk-head").forEach((kepala) => {
    kepala.addEventListener("click", (ev) => {
      const radio = document.getElementById(kepala.htmlFor); // radio milik tiket ini
      if (radio.checked) { ev.preventDefault(); radio.checked = false; }
    });
  });
}


/* ---------- 4. Jelajah: kolom "Cari event" ----------
   Setiap kartu event punya atribut data-cari berisi judul, isi, dan
   penyelenggara (huruf kecil). Kartu yang tidak mengandung semua kata
   yang diketik diberi atribut hidden sehingga tersembunyi. */
const cari = document.getElementById("cari");
if (cari) {
  const hasil = document.querySelector(".hasil");               // bagian daftar hasil
  const semuaEvent = [...hasil.querySelectorAll(".ev")];         // semua kartu event

  // Samakan teks: huruf kecil dan tanpa tanda aksen (contoh "É" → "e")
  const rapikan = (teks) => teks.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Saring kartu sesuai isi kolom cari
  const saring = () => {
    // Pecah ketikan jadi kata-kata, contoh "seminar bcc" → ["seminar", "bcc"]
    const kata = rapikan(cari.value.trim()).split(/\s+/).filter(Boolean);
    // Sembunyikan kartu yang tidak memuat SEMUA kata
    semuaEvent.forEach((ev) => { ev.hidden = !kata.every((k) => ev.dataset.cari.includes(k)); });
    // Cek apakah masih ada kartu yang terlihat (gabungan pencarian + filter CSS)
    const adaYangTampil = semuaEvent.some((ev) => getComputedStyle(ev).display !== "none");
    // Kalau kosong, CSS menampilkan pesan "Belum ada event yang cocok"
    hasil.classList.toggle("kosong-js", !adaYangTampil);
  };

  const formSaring = document.getElementById("saring");
  cari.addEventListener("input", saring);                          // saring setiap kali mengetik
  formSaring.addEventListener("change", saring);                   // saring ulang saat chip/sakelar diubah
  formSaring.addEventListener("reset", () => setTimeout(saring));  // tombol "Hapus filter": tunggu form kosong dulu, lalu saring ulang
  formSaring.addEventListener("submit", (ev) => ev.preventDefault()); // jangan muat ulang halaman

  // Enter (keyboard laptop maupun tombol "Cari" di keyboard HP)
  cari.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter" || ev.isComposing) return; // abaikan tombol lain & saat keyboard HP masih menyusun kata
    ev.preventDefault();
    saring();
    cari.blur(); // HP: keyboard tertutup
    document.getElementById("t-hasil").scrollIntoView({ behavior: "smooth", block: "start" }); // gulir ke hasil
  });
}
