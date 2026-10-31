import { COLORS } from '../config.js';
import { BOSSES } from '../data/bosses.js';
import { createNewSave, hasSave, loadGame } from '../engine/save.js';

const PANELS = Object.freeze({
  MENU: 'menu',
  COMMANDS: 'commands',
  CREDITS: 'credits',
});

export class HomeState {
  constructor(game) {
    this.game = game;
    this.panel = PANELS.MENU;
    this.time = 0;
    this.stars = createStars(48);
  }

  enter() {
    this.panel = PANELS.MENU;
    this.renderUi();
  }

  exit() {}

  update(dt) {
    this.time += dt;
  }

  render(renderer) {
    drawDuskSky(renderer, this.time, this.stars);
    drawMeadow(renderer, this.time);
    drawLantern(renderer, 52, 118, this.time);
    drawLantern(renderer, 268, 122, this.time + 1.4);
  }

  renderUi() {
    const overlay = this.game.overlay;
    overlay.show(this.#html());
    overlay.onAll('[data-action]', 'click', (event) => {
      const action = event.currentTarget.getAttribute('data-action');
      this.#handle(action);
    });
  }

  #handle(action) {
    if (action === 'play') {
      const save = hasSave() ? loadGame() : createNewSave();
      this.game.startPlay(save, { resume: hasSave() });
      return;
    }
    if (action === 'new') {
      this.game.startPlay(createNewSave(), { resume: false });
      return;
    }
    if (action === 'commands') {
      this.panel = PANELS.COMMANDS;
      this.renderUi();
      return;
    }
    if (action === 'credits') {
      this.panel = PANELS.CREDITS;
      this.renderUi();
      return;
    }
    if (action === 'back') {
      this.panel = PANELS.MENU;
      this.renderUi();
    }
  }

  #html() {
    if (this.panel === PANELS.COMMANDS) return commandsHtml();
    if (this.panel === PANELS.CREDITS) return creditsHtml();
    return menuHtml();
  }
}

function menuHtml() {
  const continueLabel = hasSave() ? 'Continua' : 'Gioca';
  const newGame = hasSave()
    ? `<button class="menu-btn menu-btn--ghost" type="button" data-action="new">Nuova partita</button>`
    : '';

  return `
    <section class="panel panel--home">
      <p class="eyebrow">Un mondo · Nove prove</p>
      <h1 class="title">Ninefold<br>Legends</h1>
      <p class="tagline">Esplora, costruisci, forgia. Sconfiggi i nove.</p>
      <nav class="menu-stack" aria-label="Menu principale">
        <button class="menu-btn" type="button" data-action="play">${continueLabel}</button>
        ${newGame}
        <button class="menu-btn menu-btn--ghost" type="button" data-action="commands">Comandi</button>
        <button class="menu-btn menu-btn--ghost" type="button" data-action="credits">Crediti</button>
      </nav>
    </section>
  `;
}

function commandsHtml() {
  return `
    <section class="panel panel--sheet">
      <h2 class="panel-title">Comandi</h2>
      <ul class="key-list">
        <li><kbd>W A S D</kbd><span>Muovi il personaggio</span></li>
        <li><kbd>I</kbd><span>Apri / chiudi inventario</span></li>
        <li><kbd>Esc</kbd><span>Torna alla Home</span></li>
        <li><kbd>Mouse</kbd><span>Menu e inventario (click)</span></li>
      </ul>
      <p class="hint">Il combattimento boss arriverà con meccaniche dedicate, una per ogni sigillo.</p>
      <button class="menu-btn" type="button" data-action="back">Indietro</button>
    </section>
  `;
}

function creditsHtml() {
  const seals = BOSSES.map((boss) => `<li>${boss.tier}. ${boss.name}</li>`).join('');
  return `
    <section class="panel panel--sheet">
      <h2 class="panel-title">Crediti</h2>
      <p class="lede">Ninefold Legends — prototipo HTML5. Ispirato all'esplorazione di Stardew Valley, al crafting di Minecraft e alla progressione di Terraria.</p>
      <h3 class="subhead">I Nove Sigilli</h3>
      <ol class="seal-list">${seals}</ol>
      <button class="menu-btn" type="button" data-action="back">Indietro</button>
    </section>
  `;
}

function createStars(count) {
  const stars = [];
  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: (i * 47) % 320,
      y: (i * 23) % 90,
      phase: i * 0.37,
      size: i % 7 === 0 ? 2 : 1,
    });
  }
  return stars;
}

function drawDuskSky(renderer, time, stars) {
  const { ctx, width, height } = renderer;
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, COLORS.skyTop);
  gradient.addColorStop(0.45, COLORS.skyMid);
  gradient.addColorStop(0.72, COLORS.skyHorizon);
  gradient.addColorStop(1, COLORS.grassDark);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (const star of stars) {
    const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(time * 1.6 + star.phase));
    const shade = Math.floor(180 + twinkle * 75);
    renderer.fillRect(star.x, star.y, star.size, star.size, `rgb(${shade},${shade},${200})`);
  }
}

function drawMeadow(renderer, time) {
  const groundY = 128;
  renderer.fillRect(0, groundY, 320, 52, COLORS.grassDark);
  renderer.fillRect(0, groundY, 320, 6, COLORS.grass);

  for (let x = 0; x < 320; x += 4) {
    const sway = Math.round(Math.sin(time * 1.2 + x * 0.08) * 2);
    const tall = 8 + (x * 13) % 7;
    renderer.fillRect(x, groundY - tall + sway, 2, tall, COLORS.grassLight);
  }

  drawTree(renderer, 24, 118);
  drawTree(renderer, 286, 120);
  drawTree(renderer, 210, 124);
}

function drawTree(renderer, x, y) {
  renderer.fillRect(x + 6, y - 4, 5, 18, COLORS.dirt);
  renderer.fillRect(x, y - 22, 18, 14, '#245838');
  renderer.fillRect(x + 3, y - 28, 12, 10, '#2f7044');
  renderer.fillRect(x + 6, y - 32, 7, 6, COLORS.grassLight);
}

function drawLantern(renderer, x, y, time) {
  const glow = 0.55 + 0.45 * Math.abs(Math.sin(time * 3));
  renderer.fillRect(x, y - 14, 3, 14, '#3a2a22');
  renderer.fillRect(x - 3, y - 20, 9, 8, COLORS.goldDim);
  renderer.fillRect(x - 1, y - 18, 5, 4, `rgba(255, 220, 120, ${glow})`);
}
