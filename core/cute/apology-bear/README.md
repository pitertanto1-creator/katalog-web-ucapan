# Apology Cute Bear - Final Version

Versi ini sudah dibersihkan dari mode admin.
Tidak ada tombol upload foto, tidak ada upload lagu dari website, dan tidak ada indikator admin.

## Cara menjalankan

1. Buka folder project.
2. Klik dua kali file `index.html`.
3. Website langsung berjalan di browser.

## Cara mengganti teks

Buka file:

```text
data.js
```

Ubah bagian:

- `hero`
- `intro`
- `galleryCaptions`
- `notes`
- `letterDefault`
- `closing`
- `messages`

## Cara mengganti foto galeri

Masukkan foto ke folder:

```text
assets/
```

Contoh nama file:

```text
foto-1.jpg
foto-2.jpg
foto-3.jpg
foto-4.jpg
foto-5.jpg
foto-6.jpg
foto-7.jpg
```

Lalu ubah bagian ini di `data.js`:

```js
galleryImages: {
    p1: "assets/foto-1.jpg",
    p2: "assets/foto-2.jpg",
    p3: "assets/foto-3.jpg",
    p4: "assets/foto-4.jpg",
    f1: "assets/foto-5.jpg",
    f2: "assets/foto-6.jpg",
    f3: "assets/foto-7.jpg"
}
```

## Cara mengganti GIF beruang

Masukkan GIF ke folder `assets`, lalu ubah bagian ini di `data.js`:

```js
images: {
    heroBear: "assets/bear-hero.gif",
    introBear: "assets/bear-intro.gif",
    closingBear: "assets/bear-closing.gif"
}
```

## Cara memasang lagu

Masukkan file lagu ke folder `assets`, contoh:

```text
lagu-kita.mp3
```

Lalu ubah bagian ini di `data.js`:

```js
music: {
    src: "assets/lagu-kita.mp3",
    defaultTitle: "Judul Lagu",
    defaultArtist: "Nama Penyanyi"
}
```

Kalau `src` masih kosong, tombol play otomatis nonaktif.

## Struktur folder

```text
apology-bear-final/
├── index.html
├── style.css
├── script.js
├── data.js
├── README.md
└── assets/
    ├── bear-hero.svg
    ├── bear-intro.svg
    ├── bear-closing.svg
    └── placeholder-photo.svg
```
