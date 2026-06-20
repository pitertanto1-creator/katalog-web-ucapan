console.log("KadoLink upgraded landing page ready");

const slides = document.querySelectorAll(".phone-slide");
const dots = document.querySelectorAll(".slider-dots button");
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");

let currentSlide = 0;
let slideTimer;

function showSlide(index) {
  if (!slides.length) return;

  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentSlide);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function startAutoSlide() {
  slideTimer = setInterval(nextSlide, 3500);
}

function resetAutoSlide() {
  clearInterval(slideTimer);
  startAutoSlide();
}

if (nextBtn && prevBtn && slides.length) {
  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      resetAutoSlide();
    });
  });

  showSlide(0);
  startAutoSlide();
}
// Logika Aktivasi Hamburger Menu KadoLink
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

// 1. Ketika tombol garis 3 diklik
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// 2. Ketika salah satu link menu diklik (Produk, Kontak, dll), menu otomatis menutup kembali
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});