import { COLORS, VIEW } from '../config.js';

/**
 * Canvas a risoluzione interna fissa, scalato a interi
 * per pixel art nitida (niente blur da interpolazione).
 */
export class Renderer {
  constructor(canvas, width = VIEW.WIDTH, height = VIEW.HEIGHT) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.width = width;
    this.height = height;
    this.scale = 1;
    this._parent = canvas.parentElement;
    this._onResize = () => this.fit();
    window.addEventListener('resize', this._onResize);
    this.fit();
  }

  fit() {
    const bounds = this._parent.getBoundingClientRect();
    const pad = 24;
    const maxW = Math.max(this.width, bounds.width - pad);
    const maxH = Math.max(this.height, bounds.height - pad);
    this.scale = Math.max(1, Math.floor(Math.min(maxW / this.width, maxH / this.height)));
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = `${this.width * this.scale}px`;
    this.canvas.style.height = `${this.height * this.scale}px`;
    this.ctx.imageSmoothingEnabled = false;
  }

  clear(color = COLORS.ink) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  fillRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  pixel(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }

  /**
   * Sprite sheet pixel-perfect. Per ora usiamo drawImage nativo
   * con smoothing spento: i tile 16×16 resteranno croccanti.
   */
  blit(image, sx, sy, sw, sh, dx, dy, dw = sw, dh = sh) {
    this.ctx.drawImage(image, sx, sy, sw, sh, Math.round(dx), Math.round(dy), dw, dh);
  }

  destroy() {
    window.removeEventListener('resize', this._onResize);
  }
}
