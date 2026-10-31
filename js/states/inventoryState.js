import { GAME_STATES } from '../config.js';
import { BOSSES } from '../data/bosses.js';

const COLS = 9;
const ROWS = 4;

export class InventoryState {
  constructor(game) {
    this.game = game;
  }

  enter() {
    this.renderUi();
  }

  exit() {}

  update() {
    const { input } = this.game;
    if (input.justPressed('KeyI') || input.justPressed('Escape')) {
      this.game.setState(GAME_STATES.PLAY);
    }
  }

  render(renderer) {
    this.game.states[GAME_STATES.PLAY].render(renderer);
  }

  renderUi() {
    const save = this.game.saveData;
    const slots = Array.from({ length: COLS * ROWS }, (_, index) => {
      const item = save.inventory[index];
      if (!item) return `<li class="slot" aria-label="Vuoto"></li>`;
      return `<li class="slot slot--filled" title="${item.name}">${item.glyph ?? '·'}</li>`;
    }).join('');

    const seals = BOSSES.map((boss) => {
      const done = save.bossesDefeated.includes(boss.id);
      return `<li class="seal ${done ? 'is-done' : ''}" title="${boss.name}">${boss.tier}</li>`;
    }).join('');

    this.game.overlay.show(`
      <section class="panel panel--inventory">
        <header class="inv-head">
          <h2 class="panel-title">Inventario</h2>
          <p class="inv-meta">${save.player.name} · HP ${save.player.hp}/${save.player.maxHp}</p>
        </header>
        <ul class="slot-grid" aria-label="Zaino">${slots}</ul>
        <h3 class="subhead">Sigilli</h3>
        <ol class="seal-row">${seals}</ol>
        <p class="hint">I per chiudere · Esc per tornare al mondo</p>
      </section>
    `);
  }
}
