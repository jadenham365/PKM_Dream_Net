
import { UserStorage, Box, SLOTS_PER_BOX, TOTAL_BOXES } from '../types';

const DB_NAME = 'PokemonDreamNetworkDB';
const STORE_NAME = 'trainers';
const DB_VERSION = 1;

/**
 * Open the IndexedDB database.
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'username' });
      }
    };
  });
};

/**
 * Get a list of all trainer names and their last played date.
 */
export const getAllTrainers = async (): Promise<{ username: string; lastPlayed?: string }[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const users = request.result as UserStorage[];
        const summaries = users.map(u => ({
          username: u.username,
          lastPlayed: u.lastPlayed
        }));
        resolve(summaries);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to get trainers:", error);
    return [];
  }
};

/**
 * Load a specific trainer's full data.
 */
export const loadTrainer = async (username: string): Promise<UserStorage | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(username);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`Failed to load trainer ${username}:`, error);
    return null;
  }
};

/**
 * Save a trainer's data to the database.
 */
export const saveTrainer = async (data: UserStorage): Promise<void> => {
  try {
    const db = await openDB();
    const updatedData = { ...data, lastPlayed: new Date().toISOString() };
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(updatedData);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to save trainer:", error);
    throw error;
  }
};

/**
 * Delete a trainer from the database.
 */
export const deleteTrainer = async (username: string): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(username);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to delete trainer:", error);
    throw error;
  }
};

/**
 * Helper to initialize a blank user.
 */
export const createNewUser = (username: string): UserStorage => {
  const boxes: Box[] = Array.from({ length: TOTAL_BOXES }, (_, i) => ({
    id: i + 1,
    name: `Box ${i + 1}`,
    slots: Array(SLOTS_PER_BOX).fill({ pokemon: null })
  }));
  return { 
    username, 
    boxes,
    lastPlayed: new Date().toISOString()
  };
};
