/** Tastiera frame-based: held, justPressed, justReleased. */

export class Input {
  constructor() {
    this.held = new Set();
    this.pressed = new Set();
    this.released = new Set();
    this._onDown = (event) => this.#down(event);
    this._onUp = (event) => this.#up(event);
  }

  attach() {
    window.addEventListener('keydown', this._onDown);
    window.addEventListener('keyup', this._onUp);
  }

  detach() {
    window.removeEventListener('keydown', this._onDown);
    window.removeEventListener('keyup', this._onUp);
  }

  isDown(code) {
    return this.held.has(code);
  }

  justPressed(code) {
    return this.pressed.has(code);
  }

  endFrame() {
    this.pressed.clear();
    this.released.clear();
  }

  axis() {
    let x = 0;
    let y = 0;
    if (this.isDown('KeyA') || this.isDown('ArrowLeft')) x -= 1;
    if (this.isDown('KeyD') || this.isDown('ArrowRight')) x += 1;
    if (this.isDown('KeyW') || this.isDown('ArrowUp')) y -= 1;
    if (this.isDown('KeyS') || this.isDown('ArrowDown')) y += 1;
    if (x !== 0 && y !== 0) {
      const inv = 1 / Math.hypot(x, y);
      x *= inv;
      y *= inv;
    }
    return { x, y };
  }

  #down(event) {
    if (event.repeat) return;
    if (event.code === 'Tab' || event.code === 'Space') {
      event.preventDefault();
    }
    this.held.add(event.code);
    this.pressed.add(event.code);
  }

  #up(event) {
    this.held.delete(event.code);
    this.released.add(event.code);
  }
}
