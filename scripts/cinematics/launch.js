'use strict';
const launchFrames = Array.from({length:24}, (_, index) =>
  loadArt('art/cinematics/launch/' + String(index + 1).padStart(3, '0') + '.png'));
const launchReady = Promise.all(launchFrames.map(image => image.decode()));
launchReady.catch(() => {});
const launchFrameDurations = [.32,.32,.36,.3,.3,.4,
  .28,.28,.28,.28,.28,.28,.28,.28,.28,.28,
  .35,.4,.4,.4,.4,.45,.45,.65];
const launchFrameEnds = [];
let launchSceneDuration = 0;
for (const duration of launchFrameDurations) {
  launchSceneDuration += duration;
  launchFrameEnds.push(launchSceneDuration);
}
const launchDuration = launchSceneDuration + .6;
const launchCanvas = $('launchScene');
const launchContext = launchCanvas.getContext('2d');
let cancelLaunch = null;
function renderLaunch(time) {
  const frame = launchFrameEnds.findIndex(end => time < end);
  const index = frame < 0 ? launchFrames.length - 1 : frame;
  launchContext.imageSmoothingEnabled = false;
  launchContext.drawImage(launchFrames[index], 0, 0, 960, 480);
  const fadeIn = Math.max(0, 1 - time / .2);
  const fadeOut = Math.max(0, Math.min(1, (time - launchSceneDuration) / .6));
  launchContext.fillStyle = 'rgba(0,0,0,' + Math.max(fadeIn, fadeOut) + ')';
  launchContext.fillRect(0, 0, 960, 480);
}

function launchSound(frequency, duration, type, volume) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(25, frequency * .48), ctx.currentTime + duration);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume * audio.volume, ctx.currentTime + .025);
  gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + duration);
  oscillator.connect(gain); gain.connect(ctx.destination);
  oscillator.start(); oscillator.stop(ctx.currentTime + duration + .03);
  return oscillator;
}

async function playLaunchFilm() {
  await launchReady;
  launchCanvas.hidden = false;
  $('overlay').inert = true;
  menuPage = 'launch';
  return new Promise(resolve => {
    let request, previous = performance.now(), elapsed = 0, nextSound = 0;
    const sounds = [[launchFrameEnds[2],780,.12,'square',.035],
      [launchFrameEnds[3],180,.55,'triangle',.09],
      [launchFrameEnds[15],160,.6,'triangle',.09],
      [launchFrameEnds[17],220,.6,'triangle',.07],
      [launchFrameEnds[19]-.05,920,.08,'square',.03],
      [launchFrameEnds[19],65,.7,'sawtooth',.045],
      [launchFrameEnds[21],95,1.05,'sawtooth',.055]];
    const voices = [];
    function finish() {
      cancelAnimationFrame(request);
      voices.forEach(voice => { try { voice.stop(); } catch {} });
      document.removeEventListener('visibilitychange', visibility);
      cancelLaunch = null;
      resolve();
    }
    function visibility() { previous = performance.now(); }
    document.addEventListener('visibilitychange', visibility);
    cancelLaunch = finish;
    function frame(now) {
      if (!document.hidden) {
        elapsed += Math.min(.05, (now - previous) / 1000);
        while (nextSound < sounds.length && elapsed >= sounds[nextSound][0]) {
          const [, frequency, duration, type, volume] = sounds[nextSound++];
          voices.push(launchSound(frequency, duration, type, volume));
        }
        renderLaunch(Math.min(elapsed, launchDuration));
      }
      previous = now;
      if (elapsed >= launchDuration) finish();
      else request = requestAnimationFrame(frame);
    }
    request = requestAnimationFrame(frame);
  });
}
