import { GAME_STATES } from './config.js';
import { Input } from './engine/input.js';
import { Loop } from './engine/loop.js';
import { Overlay } from './engine/overlay.js';
import { Renderer } from './engine/renderer.js';
import { loadGame, saveGame } from './engine/save.js';
import { EndState } from './states/endState.js';
import { HomeState } from './states/homeState.js';
import { InventoryState } from './states/inventoryState.js';
import { PlayState } from './states/playState.js';

/**
 * Motore a stati:
 *  0 HOME       — menu, comandi, crediti
 *  1 PLAY       — mondo top-down
 *  2 INVENTORY  — zaino e sigilli
 *  3 END        — game over / vittoria
 */
export class Game {
  constructor({ canvas, overlayRoot }) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.input = new Input();
    this.overlay = new Overlay(overlayRoot);
    this.loop = new Loop((dt) => this.#tick(dt));
    this.saveData = loadGame();
    this.stateId = GAME_STATES.HOME;
    this.states = {
      [GAME_STATES.HOME]: new HomeState(this),
      [GAME_STATES.PLAY]: new PlayState(this),
      [GAME_STATES.INVENTORY]: new InventoryState(this),
      [GAME_STATES.END]: new EndState(this),
    };
  }

  get state() {
    return this.states[this.stateId];
  }

  start() {
    this.input.attach();
    this.state.enter();
    this.loop.start();
  }

  setState(nextId, payload) {
    this.state.exit?.();
    this.stateId = nextId;
    this.canvas.classList.toggle(
      'is-dimmed',
      nextId === GAME_STATES.INVENTORY || nextId === GAME_STATES.END,
    );
    this.state.enter?.(payload);
  }

  startPlay(save, _meta = {}) {
    this.saveData = save;
    saveGame(save);
    this.setState(GAME_STATES.PLAY, { save });
  }

  #tick(dt) {
    if (this.saveData && this.stateId === GAME_STATES.PLAY) {
      this.saveData.playtimeMs += dt * 1000;
    }
    this.state.update(dt);
    this.state.render(this.renderer);
    this.input.endFrame();
  }
}

export { GAME_STATES };
