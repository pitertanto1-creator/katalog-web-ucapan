PERBAIKAN BIRTHDAY AJONG 01

Penyebab perubahan tidak tampil:
1. index.html memanggil style.css dari /core/retro/birthday-retro-windows/
2. index.html memanggil data.js dari /core/retro/birthday-retro-windows/
3. index.html memanggil script.js dari /core/retro/birthday-retro-windows/
4. script.js menimpa isi Message, About You, foto, nama, musik, dan surprise menggunakan data.js lama.

Cara memasang:
1. Ganti file index.html, data.js, script.js, dan style.css di folder:
   klien/birthday-ajong-01/
2. Pastikan folder assets berisi langsung:
   assets/foto1.jpg
   assets/foto2.jpg
   assets/foto3.jpg
   assets/foto4.jpg
   assets/birthday-song.mp3
3. Jalankan:
   git add klien/birthday-ajong-01
   git commit -m "Perbaiki data client birthday-ajong-01"
   git push origin main
4. Tunggu deployment Vercel Ready.
5. Buka link lalu tekan Ctrl+F5.

Untuk perubahan customer berikutnya, edit data.js milik folder klien.
