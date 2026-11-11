const cards = [...document.querySelectorAll('.gallery-card')];
const dots = [...document.querySelectorAll('.carousel-dots button')];
let activeIndex = 0;

const galleryVideos = cards.map(card => {
  const video = card.querySelector('video');
  const setPreviewFrame = () => {
    if (!Number.isFinite(video.duration)) return;
    video.currentTime = video.duration * Number(video.dataset.frame);
    video.pause();
  };

  video.addEventListener('loadedmetadata', setPreviewFrame, {once: true});
  return {video, setPreviewFrame};
});

const renderCarousel = () => {
  cards.forEach((card, index) => {
    card.classList.remove('is-active', 'is-previous', 'is-next');
    card.setAttribute('aria-hidden', String(index !== activeIndex));

    if (index === activeIndex) {
      card.classList.add('is-active');
    } else if (index === (activeIndex - 1 + cards.length) % cards.length) {
      card.classList.add('is-previous');
    } else if (index === (activeIndex + 1) % cards.length) {
      card.classList.add('is-next');
    }

    const {video, setPreviewFrame} = galleryVideos[index];
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) setPreviewFrame();
  });

  dots.forEach((dot, index) => {
    if (index === activeIndex) {
      dot.setAttribute('aria-current', 'true');
    } else {
      dot.removeAttribute('aria-current');
    }
  });
};

const showCard = index => {
  activeIndex = (index + cards.length) % cards.length;
  renderCarousel();
};

document.querySelector('.carousel-arrow.previous').addEventListener('click', () => {
  showCard(activeIndex - 1);
});

document.querySelector('.carousel-arrow.next').addEventListener('click', () => {
  showCard(activeIndex + 1);
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => showCard(index));
});

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') showCard(activeIndex - 1);
  if (event.key === 'ArrowRight') showCard(activeIndex + 1);
});

renderCarousel();
