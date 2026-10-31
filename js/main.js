import { Game } from './game.js';

const canvas = document.querySelector('#game-canvas');
const overlayRoot = document.querySelector('#overlay');

const game = new Game({ canvas, overlayRoot });
game.start();

window.__ninefold = game;
