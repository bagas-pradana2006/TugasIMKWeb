# Kompas Filkom

Platform informasi event Fakultas Ilmu Komputer Universitas Brawijaya. Proyek Akhir Interaksi Manusia dan Komputer (IMK), **Kelompok 4**.

🔗 **Demo:** https://bagas-pradana2006.github.io/TugasIMKWeb/

Implementasi desain High-Fidelity dari laporan Tahap 2, dibangun **dominan HTML + CSS** dengan satu file JavaScript kecil (`js/app.js`). Versi ini sudah memuat perbaikan dari evaluasi usability (Heuristic Evaluation dan Cognitive Walkthrough).

## Anggota Kelompok

- Ibrahim Bagas Pradana
- Shane Archie Saputro

## Cara Menjalankan

1. Buka link demo di atas, **atau**
2. Unduh repository ini, lalu buka `index.html` di browser.

Untuk menghapus data demo (tiket yang sudah didaftar), tambahkan `?reset` di akhir alamat, misalnya `riwayat.html?reset`.

## Struktur Folder

```
├── index.html          Layar 1a · Beranda
├── jelajah.html        Layar 1b · Jelajah event (cari & saring)
├── event/              Layar 2  · Detail event (satu file per event)
├── daftar/             Layar 3  · Registrasi + dialog konfirmasi
├── riwayat.html        Layar 4  · Riwayat / tiket
├── sertifikat.html     Layar 5  · Event yang sudah diikuti + unduh sertifikat
├── sertifikat/         Contoh file sertifikat (PDF)
├── aset/poster/        Poster event (opsional)
├── js/
│   └── app.js          JavaScript kecil (± 60 baris)
└── css/
    ├── style.css       Design system: token warna, tipografi, komponen, responsif
    ├── jelajah.css     Aturan saring event dan judul hasil
    ├── daftar.css      Daftar "Lengkapi dulu" di form registrasi
    └── riwayat.css     Aturan buka/tutup tiket
```

## Pembagian HTML/CSS dan JavaScript

| Interaksi | Dikerjakan oleh | Cara kerjanya |
|---|---|---|
| Chip jenis event, penyelenggara, sakelar sertifikat | CSS | Input radio/checkbox + `:has(:checked)` menyembunyikan event yang tidak cocok |
| Jumlah event ("17 event") | CSS | CSS counter (`counter-increment`) hanya menghitung event yang tampil |
| Judul hasil + tombol "Hapus filter" | CSS | `:has()` membaca chip aktif dan `#cari:not(:placeholder-shown)`; tombol `type="reset"` |
| Tombol "Daftar sekarang" aktif setelah dicentang | CSS | Tombol asli disembunyikan sampai dicentang; sebelumnya tampil tiruan `aria-disabled`, jadi tidak bisa ditekan lewat keyboard |
| Validasi form + daftar "Lengkapi dulu" | HTML + CSS | `required`, `pattern`, `:user-invalid`, dan `.reg-form:has(#f-...:invalid)` |
| Dialog konfirmasi (X, Periksa lagi, Esc, klik latar) | HTML | Atribut `popover` + `popovertarget`; `autofocus` memindahkan fokus ke dialog |
| Akordeon tiket (HP/tablet) & daftar + detail (desktop) | CSS | Radio tersembunyi + label yang terhubung lewat atribut `for` |
| Tiket tersimpan setelah mendaftar | JavaScript | `localStorage` menyimpan event yang didaftar; tiket tampil di Riwayat dan detail event berubah jadi "Kamu sudah terdaftar" |
| Status "Mengirim…" | JavaScript | Tombol "Ya, kirim" menampilkan putaran loading sebelum pindah ke Riwayat |
| Kolom "Cari event" | JavaScript | Menyaring judul, topik, isi, dan penyelenggara; bekerja bersama filter CSS |
| Akordeon tiket bisa ditutup lagi | JavaScript | Mengetuk tiket yang sedang terbuka menutupnya |

Kalau JavaScript mati, web tetap bisa dipakai: tiket baru tampil lewat `:target` (`riwayat.html#ok-nama-event`), hanya tidak tersimpan.

## Responsif

| Ukuran layar | Tampilan |
|---|---|
| HP (< 768px) | Menu bawah, kotak aksi ringkas menempel di bawah layar |
| Tablet (768–1099px) | Menu atas, kartu event 2 kolom, tiket akordeon |
| Desktop (≥ 1100px) | Grid 12 kolom (container 1200px), panel samping, daftar tiket + detail |
| HP dimiringkan (tinggi ≤ 500px) | Kotak aksi tidak menempel, menu bawah lebih pendek, `text-size-adjust: 100%` mencegah teks membesar sendiri |

## Menambah Poster Event (opsional)

Poster hanya tampil di halaman detail. Event tanpa poster tetap rapi karena bagian ini tidak dimunculkan.

1. Simpan poster di `aset/poster/`, contoh `aset/poster/magang-go-2026.webp` (usahakan ± 200 KB).
2. Buka file detail event, contoh `event/magang-go-2026.html`.
3. Tempel kode ini tepat setelah penutup `</section>` milik kotak judul (`class="hero"`):

```html
<figure class="poster">
  <img src="../aset/poster/magang-go-2026.webp" alt="Poster Magang GO! 2026" loading="lazy" decoding="async">
</figure>
```

## Design System

- **Font:** Bricolage Grotesque (teks utama), JetBrains Mono (NIM, kode tiket, nomor sertifikat)
- **Warna utama:** navy `#14213D`, panel `#EEF3F8`, aksen oranye `#C2410C`
- **Aksesibilitas:** pasangan warna teks lulus WCAG 2.2 Level AA; status selalu memakai warna + ikon + teks

## Catatan

- Data event diambil dari info event FILKOM UB periode Oktober–November 2026. Waktu di prototipe mengikuti Hi-Fi (22 Oktober 2026).
- Tiket disimpan di browser masing-masing (`localStorage`), bukan di server.
