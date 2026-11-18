'use strict';
const launchAssets = Object.fromEntries(['pilot','cockpit','flame','fuselage','foreground','hangar'].map(name => [name, loadArt('art/launch-' + name + (name === 'hangar' ? '.webp' : '.png'))]));
const launchReady = Promise.all(Object.values(launchAssets).map(image => image.decode()));
launchReady.catch(() => {});
const launchDuration = 8.45;
const launchCanvas = $('launchScene');
const launchContext = launchCanvas.getContext('2d');
let cancelLaunch = null;
const launchClamp = value => Math.max(0, Math.min(1, value));
const launchEase = value => { const t = launchClamp(value); return t * t * (3 - 2 * t); };

function renderLaunch(time) {
  const c = launchContext;
  c.clearRect(0, 0, 960, 480);
  c.imageSmoothingEnabled = false;
  c.drawImage(launchAssets.hangar, 0, 0, 960, 480);
  const lift = launchEase((time - 6.2) / .7);
  const acceleration = launchClamp((time - 6.95) / .9);
  const shipX = 310 + 900 * acceleration * acceleration;
  const shipY = 248 - 64 * lift;
  const width = 450;
  const height = width * launchAssets.fuselage.height / launchAssets.fuselage.width;
  const cockpitX = shipX + 235;
  const cockpitY = shipY + 79;
  const ignition = launchClamp((time - 5.75) / .5);
  const vibration = time > 5.75 && time < 6.7 ? Math.sin(time * 71) * 1 : 0;
  c.save();
  c.translate(0, vibration);
  if (time > 5.75) {
    const frame = Math.floor(time * 18) % 4;
    const flameWidth = (90 + 150 * acceleration) * ignition;
    const energyWidths = [101, 105, 110, 112];
    const nozzleX = shipX + 10;
    const nozzleY = shipY + height * .55;
    c.drawImage(launchAssets.flame, frame * 128, 0, energyWidths[frame], 64,
      nozzleX - flameWidth, nozzleY - 35, flameWidth, 70);
    for (let i = 0; i < 18; i++) {
      const progress = (time * 1.7 + i * .137) % 1;
      c.globalAlpha = (1 - progress) * ignition * .6;
      c.fillStyle = i % 2 ? '#e9a657' : '#f8e1ac';
      c.fillRect(shipX - progress * 120, shipY + height * .52 + i % 7 * 3, 3, 2);
    }
    c.globalAlpha = 1;
  }
  c.drawImage(launchAssets.fuselage, shipX, shipY, width, height);
  let frame, pilotX, pilotFoot;
  if (time < 1) {
    frame = Math.floor(time * 8) % 4;
    pilotX = 420 + 100 * launchEase(time);
    pilotFoot = 396;
  } else if (time < 2) {
    frame = 4 + Math.min(3, Math.floor((time - 1) * 4));
    pilotX = 520; pilotFoot = 396;
  } else if (time < 4) {
    const t = (time - 2) / 2;
    frame = 8 + Math.min(7, Math.floor(t * 8));
    pilotX = 520 + 65 * launchEase(t);
    pilotFoot = 396 - 52 * Math.sin(Math.min(1, t * 1.8) * Math.PI / 2) + 22 * launchEase((t - .65) / .35);
  } else {
    frame = 15; pilotX = cockpitX + 13; pilotFoot = cockpitY + 62;
  }
  if (time >= 2.9) {
    c.save();
    c.beginPath(); c.rect(cockpitX - 30, cockpitY - 80, 135, 133); c.clip();
  }
  c.drawImage(launchAssets.pilot, frame % 4 * 128, Math.floor(frame / 4) * 160, 128, 160,
    pilotX - 48, pilotFoot - 120, 96, 120);
  if (time >= 2.9) c.restore();
  if (time >= 2.9) c.drawImage(launchAssets.foreground, shipX, shipY, width, height);
  let opening = time < 1.25 ? 0 : time < 2 ? (time - 1.25) / .75 : time < 4 ? 1 : 1 - (time - 4) / .65;
  const canopyFrame = Math.round(launchClamp(opening) * 3);
  c.drawImage(launchAssets.cockpit, canopyFrame * 128, 0, 128, 128,
    cockpitX - 11, cockpitY - 98, 110, 110);
  // Telescopic ladder keeps its upper mounts fixed to the fuselage.
  const retraction = launchEase((time - 4.7) / .8);
  const hatchClosure = launchEase((time - 5.5) / .2);
  const mountX = cockpitX - 20;
  const mountY = cockpitY + 20;
  const ladderLength = (396 - mountY) * (1 - retraction);
  if (retraction < 1) {
    const lean = 18 * (1 - retraction);
    c.strokeStyle = '#a4875c'; c.lineWidth = 3;
    c.beginPath();
    c.moveTo(mountX, mountY);
    c.lineTo(mountX - lean, mountY + ladderLength);
    c.moveTo(mountX + 22, mountY);
    c.lineTo(mountX + 22 - lean, mountY + ladderLength);
    c.stroke();
    for (let i = 1; i <= 3; i++) {
      const fraction = i / 3;
      c.fillStyle = '#756951';
      c.fillRect(Math.round(mountX - lean * fraction),
        Math.round(mountY + ladderLength * fraction), 23, 3);
    }
  }
  // The cover slides across the stowed ladder compartment.
  if (time >= 4.7) {
    c.fillStyle = '#171415'; c.fillRect(mountX - 3, mountY - 3, 29, 7);
    c.fillStyle = '#a4875c'; c.fillRect(mountX - 3, mountY - 3, Math.round(29 * hatchClosure), 6);
    c.fillStyle = '#dbbd83'; c.fillRect(mountX - 3, mountY - 3, Math.round(29 * hatchClosure), 1);
  }
  c.restore();
  const fade = Math.max(1 - launchEase(time / .25), launchEase((time - 7.85) / .6));
  c.fillStyle = 'rgba(0,0,0,' + fade + ')'; c.fillRect(0, 0, 960, 480);
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
    const sounds = [[1.3, 780, .12, 'square', .035], [1.4, 180, .55, 'triangle', .09],
      [4.05, 160, .6, 'triangle', .09], [4.7, 220, .8, 'triangle', .07], [5.68, 920, .08, 'square', .03],
      [5.75, 65, .9, 'sawtooth', .045], [6.75, 95, 1.05, 'sawtooth', .055]];
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
