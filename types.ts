
export enum PokemonType {
  Normal = 'Normal',
  Fire = 'Fire',
  Water = 'Water',
  Grass = 'Grass',
  Electric = 'Electric',
  Ice = 'Ice',
  Fighting = 'Fighting',
  Poison = 'Poison',
  Ground = 'Ground',
  Flying = 'Flying',
  Psychic = 'Psychic',
  Bug = 'Bug',
  Rock = 'Rock',
  Ghost = 'Ghost',
  Dragon = 'Dragon',
  Steel = 'Steel',
  Dark = 'Dark',
  Fairy = 'Fairy'
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Genderless = 'Genderless'
}

export interface PokemonData {
  id: string; // UUID
  speciesName: string;
  nickname?: string;
  dexNumber: number;
  types: PokemonType[];
  level: number;
  gender: Gender;
  ot: string; // Original Trainer
  idNo: string; // Trainer ID
  metLocation: string;
  metDate: string;
  metGame: string; // e.g., "Pokemon X"
  metLevel?: number;
  dreamText: string; // The custom metadata
  spriteUrl: string;
  boxName?: string;
  slotIndex?: number;
}

export interface BoxSlot {
  pokemon: PokemonData | null;
}

export interface Box {
  id: number;
  name: string;
  slots: BoxSlot[]; // Fixed size 30
}

export interface UserStorage {
  username: string;
  boxes: Box[];
  lastPlayed?: string;
}

export const TOTAL_BOXES = 30;
export const SLOTS_PER_BOX = 30;
export const GRID_COLS = 6;
export const GRID_ROWS = 5;
