/* Fatal impacts only. Animation clock advances independently from the music. */
'use strict';
let death = null;
const DEATH_FPS = 24, DEATH_FRAMES = 48, DEATH_DURATION = 2;
const deathNames = ['tiro', 'asteroide', 'raio_serafim', 'penas_serafim', 'colisao'];
const deathArt = Object.fromEntries(deathNames.map(name => {
  const image = new Image();
  image.src = 'art/player/deaths/' + name + '.png';
  return [name, image];
}));
// Replaced by the validated atlas measurements during packaging.
const deathLayout = {"tiro": {"shipWidth": 154, "anchor": {"x": 97.0, "y": 127.85}}, "asteroide": {"shipWidth": 163, "anchor": {"x": 102.5, "y": 128.15}}, "raio_serafim": {"shipWidth": 148, "anchor": {"x": 110.0, "y": 128.05}}, "penas_serafim": {"shipWidth": 147, "anchor": {"x": 103.5, "y": 128.05}}, "colisao": {"shipWidth": 161, "anchor": {"x": 99.5, "y": 128.05}}};

function beginDeath(cause, object = ship) {
  if (death || hp > 0) return;
  const kind = deathNames.includes(cause) ? cause : 'tiro';
  const dx = object.x - ship.x, dy = object.y - ship.y;
  const distance = Math.hypot(dx, dy) || 1;
  death = {kind, age: 0, frame: 0, x: ship.x, y: ship.y,
    tilt: ship.tilt, contact: {x: ship.x + dx / distance * 22,
      y: ship.y + dy / distance * 10}};
  keys = {}; pointer = null; fireTap = false; ship.flash = 0;
  trail.length = 0; warpPoses.length = 0;
  stopShotSound(); stopRadio();
}

function updateDeath(dt) {
  if (!death) return;
  death.age = Math.min(DEATH_DURATION, death.age + dt);
  death.frame = Math.min(DEATH_FRAMES - 1, Math.floor(death.age * DEATH_FPS));
  if (death.age >= DEATH_DURATION) end(false);
}

function updateDeathWorld(dt) {
  const time = audio.currentTime;
  travel += dt * (65 + drive * 180);
  beat = Math.max(0, beat - dt * 3);
  for (const star of stars) {
    star.x -= dt * (40 + star.s * 45) * drive;
    if (star.x < 0) star.x += 960;
  }
  for (const enemy of enemies) {
    enemy.t += dt;
    enemy.x -= (100 + Math.min(level, 15) * 6 + energy * 50) * (enemy.kind ? .65 : 1) * dt;
    enemy.y = enemy.base + Math.sin(enemy.t * (enemy.kind ? 1.6 : 3)) * Math.min(65,45+level*2) * (enemy.kind ? .45 : 1);
  }
  for (const bullet of hostile) { bullet.x += bullet.vx * dt; bullet.y += bullet.vy * dt; }
  for (const bullet of bullets) bullet.x += 650 * dt;
  for (const particle of particles) {
    particle.x += particle.vx * dt; particle.y += particle.vy * dt; particle.t -= dt;
  }
  particles = particles.filter(particle => particle.t > 0);
  enemies = enemies.filter(enemy => enemy.x > -100);
  bullets = bullets.filter(bullet => !bullet.dead && bullet.x < 1000);
  hostile = hostile.filter(bullet => bullet.x > -50 && bullet.x < 1010);
  // Asteroids and Centopeia already derive their movement from the music clock.
  updateSerafim(time);
  $('clock').textContent = fmt(time) + ' / ' + fmt(audio.duration || 933);
}

function drawDeath() {
  if (!death) return;
  const image = deathArt[death.kind], layout = deathLayout[death.kind];
  g.save();
  g.translate(Math.round(death.x), Math.round(death.y));
  g.rotate(death.tilt);
  g.imageSmoothingEnabled = false;
  if (death.frame === 0 || !image.complete || !image.naturalWidth || !layout) {
    // Exact original sprite on contact, also used while an atlas is loading.
    if (death.frame < 24 && loadedArt(shipArt)) {
      const h = 70 * shipArt.naturalHeight / shipArt.naturalWidth;
      g.drawImage(shipArt, -35, Math.round(-h * .545), 70, h);
    }
  } else {
    const cw = image.naturalWidth / 8, ch = image.naturalHeight / 6;
    const scale = 70 / layout.shipWidth;
    g.drawImage(image, death.frame % 8 * cw, Math.floor(death.frame / 8) * ch,
      cw, ch, -layout.anchor.x * scale, -layout.anchor.y * scale, cw * scale, ch * scale);
  }
  g.restore();
}
