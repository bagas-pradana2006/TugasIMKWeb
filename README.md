# Kompas Filkom

Platform informasi event Fakultas Ilmu Komputer Universitas Brawijaya. Proyek Akhir Interaksi Manusia dan Komputer (IMK) Tahap 2, **Kelompok 4**.

🔗 **Demo:** [https://bagas-pradana2006.github.io/TugasIMKWeb/](https://bagas-pradana2006.github.io/TugasIMKWeb/)

Website ini adalah implementasi desain High-Fidelity dari laporan Tahap 2. Dibuat hanya dengan **HTML + CSS, tanpa JavaScript**.

## Anggota Kelompok

- Ibrahim Bagas Pradana
- Shane Archie Saputro

## Cara Menjalankan

1. Buka link demo di atas, **atau**
2. Unduh repository ini, lalu buka `index.html` di browser.

## Struktur Folder

```
├── index.html          Layar 1a · Beranda
├── jelajah.html        Layar 1b · Jelajah event (cari & saring)
├── event/              Layar 2  · Detail event (satu file per event)
├── daftar/             Layar 3  · Registrasi + dialog konfirmasi
├── riwayat.html        Layar 4  · Riwayat / tiket
├── sertifikat.html     Layar 5  · Event yang sudah diikuti + unduh sertifikat
├── sertifikat/         Contoh file sertifikat (PDF)
└── css/
    ├── style.css       Design system: token warna, tipografi, komponen, responsif
    ├── jelajah.css     Aturan saring event
    └── riwayat.css     Aturan buka/tutup tiket
```

## Interaksi Tanpa JavaScript

| Interaksi | Cara kerjanya |
|---|---|
| Chip jenis event, penyelenggara, sakelar sertifikat | Input radio/checkbox + `:has(:checked)` menyembunyikan event yang tidak cocok |
| Jumlah event ("17 event") | CSS counter (`counter-increment`) hanya menghitung event yang tampil |
| Pesan "Belum ada event yang cocok" + reset | Aturan `:has()` untuk kombinasi filter yang kosong; tombol `type="reset"` mengembalikan filter |
| Tombol "Daftar sekarang" aktif setelah dicentang | `.aksi:has(.setuju:not(:checked))` menurunkan opasitas ke 45% dan mematikan klik |
| Validasi nomor WhatsApp | `pattern="08[0-9]{8,11}"` + `:user-invalid` (border merah 2px + pesan error) |
| Tombol "Kirim pendaftaran" nonaktif sampai form valid | `.reg-form:has(:invalid)` |
| Dialog konfirmasi (X, Periksa lagi, Esc, klik latar) | Atribut HTML `popover` + `popovertarget` |
| Tiket muncul setelah "Ya, kirim" | Tautan ke `riwayat.html#ok-nama-event`, lalu `:target` menampilkan pesan hijau + tiket |
| Akordeon tiket (HP/tablet) dan daftar + detail (desktop) | Radio tersembunyi + label yang terhubung lewat atribut `for` |

## Responsif

| Ukuran layar | Tampilan |
|---|---|
| HP (< 768px) | Menu bawah, kotak aksi menempel di bawah layar |
| Tablet (768–1099px) | Menu atas, kartu event 2 kolom |
| Desktop (≥ 1100px) | Grid 12 kolom (container 1200px), panel samping |
| HP dimiringkan (tinggi ≤ 500px) | Kotak aksi tidak menempel, menu bawah lebih pendek, `text-size-adjust: 100%` mencegah teks membesar sendiri |

## Design System

- **Font:** Bricolage Grotesque (teks utama), JetBrains Mono (NIM, kode tiket, nomor sertifikat)
- **Warna utama:** navy `#14213D`, panel `#EEF3F8`, aksen oranye `#C2410C`
- **Aksesibilitas:** semua pasangan warna teks lulus WCAG 2.2 Level AA; status selalu memakai warna + ikon + teks

## Catatan

- Kolom "Cari event" hanya menampilkan saran judul (datalist). Menyaring berdasarkan teks membutuhkan JavaScript.
- Tiket baru hanya tampil selama alamat halaman masih `#ok-...`, karena tidak ada penyimpanan data.
- Data event diambil dari info event FILKOM UB periode Oktober–November 2026.
