export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key} from localStorage`, error);
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not write ${key} to localStorage`, error);
  }
}

export function clearAppStorage() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith("sun-warrior:") || key.startsWith("elevate:"))
    .forEach((key) => localStorage.removeItem(key));
}
