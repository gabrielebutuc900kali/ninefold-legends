/** Costanti globali del motore. Nessuna dipendenza circolare. */

export const GAME_STATES = Object.freeze({
  HOME: 0,
  PLAY: 1,
  INVENTORY: 2,
  END: 3,
});

export const VIEW = Object.freeze({
  WIDTH: 320,
  HEIGHT: 180,
  TILE: 16,
});

export const SAVE_KEY = 'ninefold-legends-save-v1';

export const COLORS = Object.freeze({
  skyTop: '#1a1630',
  skyMid: '#2a2450',
  skyHorizon: '#4a3a6a',
  grassDark: '#2d5a3a',
  grass: '#3d7a4a',
  grassLight: '#6bb36a',
  dirt: '#5a3a28',
  gold: '#e8c547',
  goldDim: '#9a7a28',
  ink: '#0c0a12',
  parchment: '#f4ead5',
});

export const DEFAULT_SAVE = () => ({
  version: 1,
  player: {
    name: 'Viandante',
    x: 40,
    y: 28,
    hp: 100,
    maxHp: 100,
    facing: 'down',
  },
  inventory: [],
  bossesDefeated: [],
  playtimeMs: 0,
});
