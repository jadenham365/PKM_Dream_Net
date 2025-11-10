import { PokemonType } from './types';

export const TYPE_COLORS: Record<PokemonType, string> = {
  [PokemonType.Normal]: '#A8A77A',
  [PokemonType.Fire]: '#EE8130',
  [PokemonType.Water]: '#6390F0',
  [PokemonType.Grass]: '#7AC74C',
  [PokemonType.Electric]: '#F7D02C',
  [PokemonType.Ice]: '#96D9D6',
  [PokemonType.Fighting]: '#C22E28',
  [PokemonType.Poison]: '#A33EA1',
  [PokemonType.Ground]: '#E2BF65',
  [PokemonType.Flying]: '#A98FF3',
  [PokemonType.Psychic]: '#F95587',
  [PokemonType.Bug]: '#A6B91A',
  [PokemonType.Rock]: '#B6A136',
  [PokemonType.Ghost]: '#735797',
  [PokemonType.Dragon]: '#6F35FC',
  [PokemonType.Steel]: '#B7B7CE',
  [PokemonType.Dark]: '#705746',
  [PokemonType.Fairy]: '#D685AD',
};

// A small subset for demo purposes
export const MOCK_SPECIES = [
  { name: 'Bulbasaur', dex: 1, types: [PokemonType.Grass, PokemonType.Poison] },
  { name: 'Charmander', dex: 4, types: [PokemonType.Fire] },
  { name: 'Squirtle', dex: 7, types: [PokemonType.Water] },
  { name: 'Pikachu', dex: 25, types: [PokemonType.Electric] },
  { name: 'Jigglypuff', dex: 39, types: [PokemonType.Normal, PokemonType.Fairy] },
  { name: 'Gengar', dex: 94, types: [PokemonType.Ghost, PokemonType.Poison] },
  { name: 'Eevee', dex: 133, types: [PokemonType.Normal] },
  { name: 'Snorlax', dex: 143, types: [PokemonType.Normal] },
  { name: 'Mewtwo', dex: 150, types: [PokemonType.Psychic] },
  { name: 'Gardevoir', dex: 282, types: [PokemonType.Psychic, PokemonType.Fairy] },
  { name: 'Lucario', dex: 448, types: [PokemonType.Fighting, PokemonType.Steel] },
  { name: 'Garchomp', dex: 445, types: [PokemonType.Dragon, PokemonType.Ground] },
];

export const GAMES_LIST = [
  'Red', 'Blue', 'Yellow',
  'Gold', 'Silver', 'Crystal',
  'Ruby', 'Sapphire', 'Emerald', 'FireRed', 'LeafGreen',
  'Diamond', 'Pearl', 'Platinum', 'HeartGold', 'SoulSilver',
  'Black', 'White', 'Black 2', 'White 2',
  'X', 'Y', 'Omega Ruby', 'Alpha Sapphire',
  'Sun', 'Moon', 'Ultra Sun', 'Ultra Moon',
  'Sword', 'Shield', 'Scarlet', 'Violet'
];
