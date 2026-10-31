import { COLORS, GAME_STATES, VIEW } from '../config.js';
import { saveGame } from '../engine/save.js';

const SPEED = 48;

export class PlayState {
  constructor(game) {
    this.game = game;
    this.player = null;
    this.camera = { x: 0, y: 0 };
    this.anim = 0;
    this.walkFrame = 0;
  }

  enter(payload = {}) {
    const save = payload.save ?? this.game.saveData;
    this.player = {
      x: save.player.x * VIEW.TILE,
      y: save.player.y * VIEW.TILE,
      facing: save.player.facing ?? 'down',
      moving: false,
    };
    this.game.overlay.hide();
  }

  exit() {
    this.#persist();
  }

  update(dt) {
    const { input } = this.game;
    if (input.justPressed('Escape')) {
      this.game.setState(GAME_STATES.HOME);
      return;
    }
    if (input.justPressed('KeyI')) {
      this.game.setState(GAME_STATES.INVENTORY);
      return;
    }

    const axis = input.axis();
    this.player.moving = axis.x !== 0 || axis.y !== 0;
    if (this.player.moving) {
      this.player.x += axis.x * SPEED * dt;
      this.player.y += axis.y * SPEED * dt;
      if (Math.abs(axis.x) > Math.abs(axis.y)) {
        this.player.facing = axis.x > 0 ? 'right' : 'left';
      } else {
        this.player.facing = axis.y > 0 ? 'down' : 'up';
      }
      this.anim += dt * 8;
      this.walkFrame = Math.floor(this.anim) % 2;
    } else {
      this.walkFrame = 0;
    }

    this.player.x = clamp(this.player.x, 8, 64 * VIEW.TILE - 8);
    this.player.y = clamp(this.player.y, 8, 64 * VIEW.TILE - 8);
    this.camera.x = this.player.x - VIEW.WIDTH / 2;
    this.camera.y = this.player.y - VIEW.HEIGHT / 2;
  }

  render(renderer) {
    renderer.clear(COLORS.grassDark);
    this.#drawWorld(renderer);
    this.#drawPlayer(renderer);
    this.#drawHud(renderer);
  }

  #drawWorld(renderer) {
    const tile = VIEW.TILE;
    const startX = Math.floor(this.camera.x / tile);
    const startY = Math.floor(this.camera.y / tile);
    const cols = Math.ceil(VIEW.WIDTH / tile) + 1;
    const rows = Math.ceil(VIEW.HEIGHT / tile) + 1;

    for (let ty = startY; ty < startY + rows; ty += 1) {
      for (let tx = startX; tx < startX + cols; tx += 1) {
        const sx = Math.round(tx * tile - this.camera.x);
        const sy = Math.round(ty * tile - this.camera.y);
        const variant = ((tx * 17 + ty * 31) >>> 0) % 5;
        const color = variant === 0 ? COLORS.grass : variant === 1 ? '#356b42' : COLORS.grassDark;
        renderer.fillRect(sx, sy, tile, tile, color);
        if (variant === 2) {
          renderer.fillRect(sx + 6, sy + 7, 2, 2, COLORS.grassLight);
        }
      }
    }
  }

  #drawPlayer(renderer) {
    const x = Math.round(this.player.x - this.camera.x) - 6;
    const y = Math.round(this.player.y - this.camera.y) - 10;
    const bob = this.player.moving && this.walkFrame === 1 ? 1 : 0;
    renderer.fillRect(x + 3, y + 12 + bob, 7, 3, '#1a1210');
    renderer.fillRect(x + 2, y + 4 + bob, 9, 9, '#3b6ea8');
    renderer.fillRect(x + 3, y + bob, 7, 6, '#e8c4a0');
    renderer.fillRect(x + 3, y - 1 + bob, 7, 3, '#2a1810');
    if (this.player.facing === 'left') {
      renderer.fillRect(x + 4, y + 2 + bob, 2, 2, '#1a1210');
    } else if (this.player.facing === 'right') {
      renderer.fillRect(x + 7, y + 2 + bob, 2, 2, '#1a1210');
    } else {
      renderer.fillRect(x + 4, y + 2 + bob, 2, 2, '#1a1210');
      renderer.fillRect(x + 7, y + 2 + bob, 2, 2, '#1a1210');
    }
  }

  #drawHud(renderer) {
    renderer.fillRect(6, 6, 72, 10, '#140f1c');
    renderer.fillRect(8, 8, 68, 6, '#3a2030');
    const hp = this.game.saveData.player.hp / this.game.saveData.player.maxHp;
    renderer.fillRect(8, 8, Math.round(68 * hp), 6, '#c44c4c');
    renderer.fillRect(6, 20, 2, 2, COLORS.gold);
  }

  #persist() {
    if (!this.player || !this.game.saveData) return;
    this.game.saveData.player.x = this.player.x / VIEW.TILE;
    this.game.saveData.player.y = this.player.y / VIEW.TILE;
    this.game.saveData.player.facing = this.player.facing;
    saveGame(this.game.saveData);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
