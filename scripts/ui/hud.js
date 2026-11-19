'use strict';
const hudState = {score:0, hp:5, scoreFlash:0, damageFlash:0, time:0};

function hudPlate(x, y, width, height) {
  g.beginPath();
  g.moveTo(x + 10, y); g.lineTo(x + width - 10, y);
  g.lineTo(x + width, y + 9); g.lineTo(x + width - 6, y + height - 6);
  g.lineTo(x + width - 16, y + height); g.lineTo(x + 5, y + height);
  g.lineTo(x, y + height - 9); g.closePath();
  g.fillStyle = '#130f17ed'; g.fill();
  g.strokeStyle = '#8e704b'; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#d9b981';
  g.fillRect(x + 13, y + 3, width - 29, 1);
  for (const rivetX of [x + 8, x + width - 12]) {
    g.fillStyle = '#6b5038'; g.fillRect(rivetX, y + 10, 3, 3);
    g.fillStyle = '#c6a878'; g.fillRect(rivetX, y + 10, 1, 1);
  }
}

function drawHud(context=g) {
  const g=context;
  const time = audio.currentTime;
  const dt = Math.max(0, Math.min(.1, time - hudState.time));
  if (score < hudState.score || time < hudState.time) {
    hudState.scoreFlash = hudState.damageFlash = 0;
  }
  if (score > hudState.score + 10) hudState.scoreFlash = .18;
  if (hp < hudState.hp) hudState.damageFlash = .65;
  hudState.score = score; hudState.hp = hp; hudState.time = time;
  hudState.scoreFlash = Math.max(0, hudState.scoreFlash - dt);
  hudState.damageFlash = Math.max(0, hudState.damageFlash - dt);
  g.save();
  g.globalAlpha = 1; g.textBaseline = 'middle'; g.textAlign = 'left';
  hudPlate(12, 8, 276, 62);
  hudPlate(358, 8, 244, 46);
  hudPlate(696, 8, 252, 62);
  g.font = 'bold 12px "Pulse Serif", serif'; g.fillStyle = '#dfc59a';
  g.fillText('CASCO', 30, 28);
  g.fillText('PULSO', 30, 51);
  for (let i = 0; i < 5; i++) {
    const x = 91 + i * 35;
    g.beginPath(); g.moveTo(x + 5, 20); g.lineTo(x + 33, 20);
    g.lineTo(x + 28, 35); g.lineTo(x, 35); g.closePath();
    const lostSegment = i === hp && hudState.damageFlash > 0 && Math.floor(time * 16) % 2 === 0;
    g.fillStyle = i < hp ? '#cb493a' : lostSegment ? '#ffb99a' : '#32272b'; g.fill();
    g.strokeStyle = '#735246'; g.lineWidth = 1; g.stroke();
    if (i < hp) { g.fillStyle = '#f78760'; g.fillRect(x + 6, 22, 23, 2); }
  }
  const pulse = Math.max(0, Math.min(1, 1 - cooldown / 8));
  g.fillStyle = '#34292a'; g.fillRect(91, 44, 173, 12);
  g.fillStyle = cooldown > 0 ? '#ae7b38' : '#e5b65f';
  g.fillRect(92, 45, Math.round(171 * pulse), 10);
  g.fillStyle = '#f9dfa4'; g.fillRect(92, 45, Math.round(171 * pulse), 2);
  g.font = 'bold 10px Georgia, serif'; g.textAlign = 'center';
  g.fillStyle = cooldown > 0 ? '#f6e0b3' : '#302019';
  g.fillText(cooldown > 0 ? Math.ceil(cooldown) + ' s' : 'PRONTO', 178, 51);
  g.font = 'bold 12px "Pulse Serif", serif'; g.fillStyle = '#d6b478';
  g.fillText('PONTOS', 409, 31);
  g.font = 'bold 23px Georgia, serif'; g.textAlign = 'right';
  g.fillStyle = hudState.scoreFlash > 0 ? '#fff5d3' : '#f0dfbc';
  g.fillText(Math.floor(score).toLocaleString('pt-BR'), 583, 31);
  g.font = 'bold 12px "Pulse Serif", serif'; g.textAlign = 'left';
  g.fillStyle = '#d6b478'; g.fillText('TEMPO', 714, 27);
  g.textAlign = 'right'; g.fillStyle = '#f0dfbc'; g.font = 'bold 20px Georgia, serif';
  g.fillText(fmt(time), 929, 27);
  g.font = '12px "Pulse Serif", serif'; g.fillStyle = '#c4ae8a';
  const phaseName = bossMode ? 'SINGULARIDADE' : names[(level - 1) % names.length];
  g.fillText(phaseName, 929, 51);
  g.textAlign = 'left'; g.font = '10px "Pulse Serif", serif';
  g.fillStyle = '#a89173';
  g.fillText(automaticFire ? 'TIRO AUTO · T' : 'TIRO MANUAL · F / T', 30, 83);
  g.restore();
}
