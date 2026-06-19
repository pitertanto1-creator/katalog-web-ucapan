BIRTHDAY RETRO TEMPLATE - EASY EDIT VERSION

Cara menjalankan:
1. Extract ZIP.
2. Buka index.html di browser.
3. Klik icon di desktop untuk membuka fitur satu per satu.

Cara mengubah data:
Semua data utama ada di file:

data.js

Yang bisa diubah dari data.js:
- Nama penerima
- Judul website
- Teks welcome
- Judul lagu
- File musik
- Gambar cover lagu
- Teks ucapan di sebelah music player
- Teks birthday_message.txt
- Teks about_you.txt
- Foto galeri
- Teks surprise

Cara mengganti foto:
1. Masukkan gambar ke folder assets/images/
2. Buka data.js
3. Isi bagian photos seperti ini:

photos: [
  "assets/images/foto1.jpg",
  "assets/images/foto2.jpg",
  "assets/images/foto3.jpg",
  "assets/images/foto4.jpg",
  "assets/images/foto5.jpg",
  "assets/images/foto6.jpg"
]

Cara mengganti cover lagu:
1. Masukkan gambar cover ke assets/images/
2. Buka data.js
3. Isi bagian coverImage:

coverImage: "assets/images/cover.jpg"

Cara mengganti lagu:
1. Masukkan file mp3 ke assets/music/
2. Buka data.js
3. Ubah bagian musicFile:

musicFile: "assets/music/lagu.mp3"

Catatan:
- Nama file jangan pakai spasi. Contoh yang aman: foto1.jpg, lagu.mp3, cover.jpg
- Format musik yang disarankan: .mp3
- Format gambar yang disarankan: .jpg, .png, .webp
