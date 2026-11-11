const music = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicPrompt = document.getElementById('musicPrompt');
const musicPromptMessage = document.getElementById('musicPromptMessage');
const musicAccept = document.getElementById('musicAccept');
const homeButton = document.getElementById('homeButton');
const sectionFrames = [
  document.querySelector('.trailer-frame'),
  document.querySelector('.description-frame'),
  document.querySelector('.gallery-frame'),
  document.querySelector('.footer-frame')
];
const pageSections = [
  document.querySelector('.hero'),
  document.querySelector('#next'),
  document.querySelector('.description-section'),
  document.querySelector('.gallery-section'),
  document.querySelector('.site-footer')
];
let requestedSectionIndex = null;
let sectionIndexResetTimer;

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const updateMusicButton = () => {
  const isPlaying = !music.paused;
  musicToggle.textContent = isPlaying ? 'MUSIC: ON' : 'MUSIC: OFF';
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
};

const startMusic = async () => {
  try {
    await music.play();
    updateMusicButton();
    return true;
  } catch (error) {
    console.error('Gagal memutar background.mp3:', error);
    musicPromptMessage.textContent = 'Musik belum bisa diputar. Periksa file background.mp3 lalu tekan OK untuk mencoba lagi.';
    return false;
  }
};

musicAccept.addEventListener('click', async () => {
  if (await startMusic()) {
    musicPrompt.hidden = true;
  }
});

musicToggle.addEventListener('click', async () => {
  if (music.paused) {
    await startMusic();
    return;
  }

  music.pause();
  updateMusicButton();
});

music.addEventListener('error', () => {
  musicToggle.textContent = 'AUDIO TIDAK TERSEDIA';
  musicToggle.setAttribute('aria-pressed', 'false');
  musicPromptMessage.textContent = 'File assets/background.mp3 tidak bisa dimuat. Periksa file di folder assets.';
  console.error('Tidak dapat memuat assets/background.mp3. Pastikan file berada di folder assets.');
});

homeButton.addEventListener('click', () => {
  document.querySelector('.hero').scrollIntoView({behavior:'smooth'});
});

window.addEventListener('message', event => {
  const isSectionFrame = sectionFrames.some(frame => frame.contentWindow === event.source);
  if (!isSectionFrame || event.data?.type !== 'reundo-section-scroll') return;
  navigateOneSection(event.data.deltaY);
});

const navigateOneSection = deltaY => {
  if (!deltaY) return;

  if (requestedSectionIndex === null) {
    requestedSectionIndex = pageSections.reduce((closestIndex, section, index) => {
      const closestDistance = Math.abs(pageSections[closestIndex].getBoundingClientRect().top);
      const distance = Math.abs(section.getBoundingClientRect().top);
      return distance < closestDistance ? index : closestIndex;
    }, 0);
  }

  const direction = Math.sign(deltaY);
  requestedSectionIndex = Math.max(0, Math.min(pageSections.length - 1, requestedSectionIndex + direction));
  pageSections[requestedSectionIndex].scrollIntoView({behavior: 'smooth', block: 'start'});

  clearTimeout(sectionIndexResetTimer);
  sectionIndexResetTimer = setTimeout(() => {
    requestedSectionIndex = null;
  }, 700);
};

window.addEventListener('pageshow', () => window.scrollTo(0, 0), {once:true});
