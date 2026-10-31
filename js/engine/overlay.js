/** Overlay HTML sopra il canvas: menu, inventario, dialoghi. */

export class Overlay {
  constructor(root) {
    this.root = root;
  }

  setVisible(visible) {
    this.root.classList.toggle('is-hidden', !visible);
    this.root.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }

  show(html) {
    this.root.innerHTML = html;
    this.setVisible(true);
  }

  hide() {
    this.root.innerHTML = '';
    this.setVisible(false);
  }

  on(selector, event, handler) {
    const node = this.root.querySelector(selector);
    if (node) node.addEventListener(event, handler);
    return node;
  }

  onAll(selector, event, handler) {
    this.root.querySelectorAll(selector).forEach((node) => {
      node.addEventListener(event, handler);
    });
  }
}
