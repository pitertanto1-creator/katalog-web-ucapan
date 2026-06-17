const templateCards = document.querySelectorAll(".template-card, .process-card, .price-card");

const revealOnScroll = () => {
  templateCards.forEach((card) => {
    const cardTop = card.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (cardTop < windowHeight - 80) {
      card.classList.add("show");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);