/* Presentation only. The existing game supplies the music clock and positions. */
window.pulseFX = (() => {
  let graphics, game, layer, fallback;
  const disabled = new URLSearchParams(location.search).has('canvas');
  function mount() {
    layer = document.createElement('div');
    layer.className = 'fx-layer';
    document.getElementById('c').after(layer);
    const useCanvas = () => {
      if (fallback) return;
      const canvas = document.createElement('canvas');
      canvas.width = 960;
      canvas.height = 480;
      layer.replaceChildren(canvas);
      fallback = canvas.getContext('2d');
    };
    if (disabled || !window.Phaser || !Phaser.Device.Features.webGL) {
      useCanvas();
      return;
    }
    try {
      game = new Phaser.Game({
        type: Phaser.WEBGL, width: 960, height: 480, parent: layer,
        transparent: true, pixelArt: true, audio: {noAudio: true},
        input: {keyboard: false, mouse: false, touch: false, gamepad: false},
        scene: {create() {
          graphics = this.add.graphics();
          layer.dataset.renderer = 'WebGL';
        }}
      });
      game.canvas?.addEventListener('webglcontextlost', () => {
        graphics = null;
        useCanvas();
        game.destroy(true);
      }, {once: true});
    } catch {
      useCanvas();
    }
  }
  function render(time, bass, ship, impact, hidden) {
    if (!layer) return;
    layer.hidden = hidden;
    if (hidden) return;
    graphics?.clear();
    fallback?.clearRect(0, 0, 960, 480);
    const dot = (x, y, width, height, color, alpha) => {
      if (graphics) graphics.fillStyle(color, alpha).fillRect(x, y, width, height);
      else if (fallback) {
        fallback.globalAlpha = alpha;
        fallback.fillStyle = '#' + color.toString(16).padStart(6, '0');
        fallback.fillRect(x, y, width, height);
      }
    };
    const radio = time >= 71 && time < 110;
    const warp = Math.max(0, Math.min(1, (time - 160) / 7)) * (time < 167);
    for (let i = 0; i < (radio ? 8 : 24); i++) {
      const speed = 13 + (i % 3) * 18 + warp * 320;
      const x = 960 - (i * 187 + time * speed) % 960;
      const y = i % 2 ? 57 + i * 13 % 71 : 374 + i * 19 % 74;
      dot(Math.round(x), y, 2 + Math.floor(warp * 37), 1, warp ? 0xa1ebff : 0xd1a064, .16 + bass * .2);
    }
    if (time >= 160 && time < 173) {
      const reveal = Math.min(1, (time - 160) / 7) * Math.min(1, (173 - time) / 4);
      for (let i = 0; i < 14; i++) {
        const angle = i * 2.399 + time * .35;
        const radius = 155 - reveal * 58 + 12 * Math.sin(i * 7 + time);
        dot(Math.round(824 + Math.cos(angle) * radius), Math.round(210 + Math.sin(angle) * radius),
          2 + i % 3, 2, 0xe8ba68, reveal * .55);
      }
    }
    if (impact > .55) dot(Math.round(ship.x - 6), Math.round(ship.y + 12), 3, 2, 0xffc27a, .75);
  }
  return {mount, render};
})();
