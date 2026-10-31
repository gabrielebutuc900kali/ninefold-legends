import { DEFAULT_SAVE, SAVE_KEY } from '../config.js';

export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

export function hasSave() {
  return loadGame() !== null;
}

export function saveGame(data) {
  const payload = {
    ...data,
    savedAt: Date.now(),
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  return payload;
}

export function createNewSave() {
  const fresh = DEFAULT_SAVE();
  return saveGame(fresh);
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
