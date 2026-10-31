/** Game loop a requestAnimationFrame con delta in secondi, clampato. */

export class Loop {
  constructor(tick) {
    this.tick = tick;
    this.running = false;
    this._last = 0;
    this._raf = 0;
    this._step = (now) => this.#step(now);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._last = performance.now();
    this._raf = requestAnimationFrame(this._step);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this._raf);
  }

  #step(now) {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this._last) / 1000);
    this._last = now;
    this.tick(dt);
    this._raf = requestAnimationFrame(this._step);
  }
}
