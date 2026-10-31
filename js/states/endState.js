import { GAME_STATES } from '../config.js';

export class EndState {
  constructor(game) {
    this.game = game;
    this.kind = 'defeat';
  }

  enter(payload = {}) {
    this.kind = payload.kind ?? 'defeat';
    this.renderUi();
  }

  exit() {}

  update() {}

  render(renderer) {
    this.game.states[GAME_STATES.PLAY].render(renderer);
  }

  renderUi() {
    const victory = this.kind === 'victory';
    this.game.overlay.show(`
      <section class="panel panel--sheet">
        <h2 class="panel-title">${victory ? 'Vittoria' : 'Game Over'}</h2>
        <p class="lede">${
          victory
            ? 'I nove sigilli sono spezzati. La tua leggenda resta nel Nesso.'
            : 'Il mondo resta. Riposa, riforgia, e torna a combattere.'
        }</p>
        <nav class="menu-stack">
          <button class="menu-btn" type="button" data-action="home">Home</button>
          <button class="menu-btn menu-btn--ghost" type="button" data-action="retry">Riprova</button>
        </nav>
      </section>
    `);
    this.game.overlay.onAll('[data-action]', 'click', (event) => {
      const action = event.currentTarget.getAttribute('data-action');
      if (action === 'home') this.game.setState(GAME_STATES.HOME);
      if (action === 'retry') this.game.setState(GAME_STATES.PLAY, { save: this.game.saveData });
    });
  }
}
