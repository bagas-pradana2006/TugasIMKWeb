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

const KUNCI = "kompasFilkom.tiket";

function ambilTiket() {
  try { return JSON.parse(localStorage.getItem(KUNCI)) || []; } catch { return []; }
}
function simpanTiket(daftar) {
  try { localStorage.setItem(KUNCI, JSON.stringify(daftar)); } catch { /* mode privat: abaikan */ }
}

if (new URLSearchParams(location.search).has("reset")) simpanTiket([]);
const tiket = ambilTiket();

// 1a. Detail event: event yang sudah didaftar menampilkan "Kamu sudah terdaftar"
const eventHalaman = document.body.dataset.event;
if (eventHalaman && tiket.includes(eventHalaman)) document.body.classList.add("sudah-daftar");

// 1b. Riwayat: tampilkan semua tiket yang tersimpan
tiket.forEach((slug) => {
  document.querySelectorAll(`#tiket-${slug}, .nv-${slug}`).forEach((el) => el.classList.add("is-terdaftar"));
});

// 2. Tombol "Ya, kirim": simpan tiket, tampilkan "Mengirim…", lalu pindah ke Riwayat
document.querySelectorAll("[data-daftar]").forEach((tombol) => {
  tombol.addEventListener("click", (ev) => {
    ev.preventDefault();
    const slug = tombol.dataset.daftar;
    if (!tiket.includes(slug)) simpanTiket([...tiket, slug]);
    tombol.textContent = "Mengirim…";
    tombol.classList.add("is-sending");
    tombol.setAttribute("aria-busy", "true");
    setTimeout(() => { location.href = tombol.href; }, 700);
  });
});

// 3. Riwayat & sertifikat: buka tiket yang dituju, akordeon bisa ditutup lagi
const rw = document.querySelector(".rw");
if (rw) {
  const tujuan = location.hash.replace(/^#(ok|tiket)-/, "");
  const radioTujuan = tujuan && document.getElementById(`r-${tujuan}`);
  if (radioTujuan) radioTujuan.checked = true;
  else if (!rw.querySelector(".rr:checked") && matchMedia("(min-width: 1100px)").matches) {
    rw.querySelector(".rr").checked = true; // desktop: panel kanan tidak boleh kosong
  }
  rw.querySelectorAll(".tk-head").forEach((kepala) => {
    kepala.addEventListener("click", (ev) => {
      const radio = document.getElementById(kepala.htmlFor);
      if (radio.checked) { ev.preventDefault(); radio.checked = false; }
    });
  });
}

// 4. Jelajah: kolom "Cari event" menyaring berdasarkan judul, topik, dan penyelenggara
const cari = document.getElementById("cari");
if (cari) {
  const hasil = document.querySelector(".hasil");
  const semuaEvent = [...hasil.querySelectorAll(".ev")];
  const rapikan = (teks) => teks.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  const saring = () => {
    const kata = rapikan(cari.value.trim()).split(/\s+/).filter(Boolean);
    semuaEvent.forEach((ev) => { ev.hidden = !kata.every((k) => ev.dataset.cari.includes(k)); });
    const adaYangTampil = semuaEvent.some((ev) => getComputedStyle(ev).display !== "none");
    hasil.classList.toggle("kosong-js", !adaYangTampil);
  };

  cari.addEventListener("input", saring);
  cari.form.addEventListener("change", saring);
  cari.form.addEventListener("reset", () => setTimeout(saring));
  // Enter: tidak memuat ulang halaman, tutup keyboard HP, lalu gulir ke hasil
  cari.form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    saring();
    cari.blur();
    document.getElementById("t-hasil").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
