let wheelGestureLocked = false;
let wheelUnlockTimer;

const sendSectionScroll = deltaY => {
  if (window.parent !== window && deltaY !== 0 && !wheelGestureLocked) {
    wheelGestureLocked = true;
    window.parent.postMessage({type: 'reundo-section-scroll', deltaY}, '*');
  }
};

window.addEventListener('wheel', event => {
  if (event.deltaY === 0) return;
  event.preventDefault();

  clearTimeout(wheelUnlockTimer);
  if (!wheelGestureLocked) sendSectionScroll(event.deltaY);
  wheelUnlockTimer = setTimeout(() => {
    wheelGestureLocked = false;
  }, 220);
}, {passive:false});

let touchStartY = null;
let touchUnlockTimer;

window.addEventListener('touchstart', event => {
  touchStartY = event.touches[0].clientY;
}, {passive:true});

window.addEventListener('touchmove', event => {
  if (touchStartY === null) return;
  const deltaY = touchStartY - event.touches[0].clientY;
  if (Math.abs(deltaY) < 40) return;
  event.preventDefault();
  sendSectionScroll(deltaY);
  touchStartY = null;
}, {passive:false});

window.addEventListener('touchend', () => {
  touchStartY = null;
  clearTimeout(touchUnlockTimer);
  touchUnlockTimer = setTimeout(() => {
    wheelGestureLocked = false;
  }, 220);
}, {passive:true});
