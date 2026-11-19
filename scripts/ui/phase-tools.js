'use strict';
const phasePoints = [
  [0, 'FASE 1 · PORTADORA'], [32, 'FASE 2 · ASTEROIDES'],
  [64, 'FASE 3 · INTERFERÊNCIA'], [96, 'FASE 4 · RESSONÂNCIA'],
  [112, 'CENTOPEIAS'], [128, 'FASE 5 · HIPERESPAÇO'],
  [160, 'ENTRADA DA SINGULARIDADE'], [167, 'DROP · SERAFIM'],
  [175, 'COMBATE · SERAFIM'], [210, 'TRANSFORMAÇÃO · SERAFIM'], [225, 'ASCENSÃO EM CURSO'], [240, 'SERAFIM ASCENDIDO'], [240.39, 'TESTE · COROA DE PENAS'], [253.19, 'TESTE · JULGAMENTO DUPLO'], [265.99, 'TESTE · RELICÁRIOS EM ÓRBITA'], [278.79, 'TESTE · PULSO DA ASCENSÃO'], [291.59, 'COROA · SEGUNDA ONDA'], [304, 'FIM DA SINGULARIDADE']
];
for (let time = 320; time < 933; time += 32) {
  phasePoints.push([time, 'SETOR ' + (1 + Math.floor(time / 32))]);
}
for (const [time, name] of phasePoints) {
  const option = document.createElement('option');
  option.value = time; option.textContent = fmt(time) + ' · ' + name;
  $('phaseSelect').appendChild(option);
}
async function jumpToPhase(target) {
  if (openingGame || seekingPhase) return;
  seekingPhase = true;
  const resume = playing;
  playing = false; audio.pause(); stopShotSound(); stopRadio();
  keys = {}; pointer = null;
  $('phaseGo').disabled = $('nextPhase').disabled = true;
  try {
    initAudio();
    await ctx.resume();
    if (!Number.isFinite(audio.duration)) {
      await new Promise((resolve, reject) => {
        function cleanup() {
          audio.removeEventListener('loadedmetadata', ready);
          audio.removeEventListener('error', fail);
        }
        function ready() { cleanup(); resolve(); }
        function fail() { cleanup(); reject(new Error('Música indisponível')); }
        audio.addEventListener('loadedmetadata', ready, {once:true});
        audio.addEventListener('error', fail, {once:true});
        audio.load();
      });
    }
    const destination = Math.max(0, Math.min(Number(target), audio.duration - .1));
    reset();
    audio.currentTime = destination;
    if (audio.seeking) {
      await new Promise((resolve, reject) => {
        function cleanup() {
          audio.removeEventListener('seeked', ready);
          audio.removeEventListener('error', fail);
        }
        function ready() { cleanup(); resolve(); }
        function fail() { cleanup(); reject(new Error('Falha ao avançar música')); }
        audio.addEventListener('seeked', ready, {once:true});
        audio.addEventListener('error', fail, {once:true});
      });
    }
    level = destination >= BOSS_START && destination < BOSS_END ? 6 : 1 + Math.floor(destination / 32);
    entryPulseDone = destination >= HYPERSPACE_START;
    bossMode = bossWasActive = destination >= BOSS_START && destination < BOSS_END;
    started = true;
    $('clock').textContent = fmt(destination) + ' / ' + fmt(audio.duration);
    $('progress').style.width = destination / audio.duration * 100 + '%';
    draw();
    if (resume) {
      await audio.play();
      showPlaying(); last = performance.now(); playing = true;
    } else showMenu('pause');
  } catch {
    showMenu('pause');
    $('desc').textContent = 'Não foi possível acessar esse ponto da música. Tente novamente.';
  } finally {
    seekingPhase = false;
    $('phaseGo').disabled = $('nextPhase').disabled = false;
  }
}
$('phaseGo').onclick = () => jumpToPhase($('phaseSelect').value);
$('nextPhase').onclick = () => jumpToPhase(
  phasePoints.find(([time]) => time > audio.currentTime + .2)?.[0] || 0);
$('timeline').onclick = event => {
  if (event.target.closest('button')) return;
  const rect = $('timeline').getBoundingClientRect();
  jumpToPhase((event.clientX - rect.left) / rect.width * (audio.duration || 933));
};
for (const [time, name] of phasePoints) {
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'sector-tick';
  button.style.left = time / 933 * 100 + '%';
  button.title = fmt(time) + ' · ' + name;
  button.setAttribute('aria-label', button.title);
  button.onclick = () => jumpToPhase(time);
  $('timeline').appendChild(button);
}
