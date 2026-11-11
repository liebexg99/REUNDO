let wheelUnlockTimer;
let wheelGestureLocked = false;

const sendSectionScroll = deltaY => {
  if (window.parent !== window && deltaY !== 0 && !wheelGestureLocked) {
    wheelGestureLocked = true;
    window.parent.postMessage({type: 'reundo-section-scroll', deltaY}, '*');
  }
};

window.addEventListener('wheel', event => {
  if (event.deltaY === 0) return;
  event.preventDefault();

  if (!wheelGestureLocked) sendSectionScroll(event.deltaY);
  clearTimeout(wheelUnlockTimer);
  wheelUnlockTimer = setTimeout(() => {
    wheelGestureLocked = false;
  }, 180);
}, {passive:false});

let touchStartY = null;

window.addEventListener('touchstart', event => {
  touchStartY = event.touches[0].clientY;
}, {passive:true});

window.addEventListener('touchmove', event => {
  if (touchStartY === null) return;
  const deltaY = touchStartY - event.touches[0].clientY;
  if (Math.abs(deltaY) < 40) return;
  event.preventDefault();
  window.parent.postMessage({type: 'reundo-section-scroll', deltaY}, '*');
  touchStartY = null;
}, {passive:false});

window.addEventListener('touchend', () => {
  touchStartY = null;
}, {passive:true});
