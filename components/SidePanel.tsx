import React from 'react';
import { PokemonData, Gender } from '../types';
import { TYPE_COLORS } from '../constants';
import { Gamepad2, Calendar, MapPin, Sparkles, User } from 'lucide-react';

interface SidePanelProps {
  pokemon: PokemonData | null;
}

const SidePanel: React.FC<SidePanelProps> = ({ pokemon }) => {
  if (!pokemon) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 bg-white/50 rounded-xl p-8 border-2 border-dashed border-gray-300">
        <Gamepad2 size={48} className="mb-4 opacity-50" />
        <p className="text-lg text-center font-medium">Select a Pokémon to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-[#ecfccb] bg-opacity-50 h-full flex flex-col p-6 rounded-xl shadow-sm border border-[#d9f99d] overflow-y-auto">
      {/* Header: Ball & Nickname */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center" title="Dive Ball">
          <div className="w-2 h-2 bg-white/50 rounded-full mb-1"></div>
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-800 font-pixel tracking-wide">
            {pokemon.nickname || pokemon.speciesName}
            </h2>
            {pokemon.nickname && (
                <p className="text-xs text-gray-500 font-medium -mt-1 uppercase tracking-wider">{pokemon.speciesName}</p>
            )}
        </div>
        <span className="ml-auto text-gray-500">
          {pokemon.gender === Gender.Male && <span className="text-blue-500 font-bold">♂</span>}
          {pokemon.gender === Gender.Female && <span className="text-pink-500 font-bold">♀</span>}
        </span>
      </div>

      {/* Sprite */}
      <div className="relative w-full aspect-square flex items-center justify-center mb-6 group">
        <div className="absolute inset-0 bg-white rounded-full opacity-20 blur-xl scale-75 group-hover:scale-90 transition-transform duration-700"></div>
        <img 
          src={pokemon.spriteUrl} 
          alt={pokemon.speciesName} 
          className="w-48 h-48 object-contain z-10 drop-shadow-md transition-transform hover:scale-110 duration-300 cursor-pointer"
        />
      </div>

      {/* Basic Stats Strip */}
      <div className="bg-white rounded-full shadow-sm border border-gray-100 p-1.5 flex items-center justify-between mb-4">
        <div className="px-3 py-1 text-xs font-bold text-purple-600 bg-purple-50 rounded-full border border-purple-100">
          No. {pokemon.dexNumber.toString().padStart(4, '0')}
        </div>
        <div className="text-sm font-semibold text-gray-700">{pokemon.speciesName}</div>
        <div className="flex gap-1">
          {pokemon.types.map((t) => (
            <span 
              key={t} 
              style={{ backgroundColor: TYPE_COLORS[t] }}
              className="px-2 py-0.5 text-[10px] font-bold text-white rounded uppercase tracking-wider shadow-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Trainer Info */}
      <div className="bg-teal-600 text-white rounded-lg shadow-md overflow-hidden mb-4">
        <div className="flex divide-x divide-teal-500/50">
            <div className="flex-1 px-3 py-2 text-center">
                <span className="block text-[10px] text-teal-200 uppercase tracking-widest font-bold">OT</span>
                <span className="font-mono text-sm">{pokemon.ot}</span>
            </div>
            <div className="flex-1 px-3 py-2 text-center">
                <span className="block text-[10px] text-teal-200 uppercase tracking-widest font-bold">ID No.</span>
                <span className="font-mono text-sm">{pokemon.idNo}</span>
            </div>
        </div>
      </div>

      {/* First Met Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="bg-cyan-50 px-3 py-1.5 border-b border-cyan-100">
          <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-1">
            <MapPin size={12} /> First Met
          </h3>
        </div>
        <div className="p-3 space-y-2">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center shrink-0 shadow-sm">
                  <Gamepad2 className="text-white" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{pokemon.metLocation}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>Lv. {pokemon.metLevel || pokemon.level}</span>
                    <span>•</span>
                    <span>{pokemon.metDate}</span>
                  </div>
              </div>
           </div>
           <div className="text-xs text-gray-400 pl-13">
              in Pokémon {pokemon.metGame}
           </div>
        </div>
      </div>

      {/* Dream/Memory Bubble - Only shown if text exists */}
      {pokemon.dreamText && (
        <div className="mt-auto relative">
            <div className="absolute -top-6 right-8 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            <div className="absolute -top-3 right-6 w-2 h-2 bg-white rounded-full shadow-sm"></div>
            
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 relative group hover:shadow-xl transition-shadow">
                <Sparkles className="absolute top-3 left-3 text-yellow-400 opacity-50" size={16} />
                <p className="text-gray-600 italic text-sm leading-relaxed text-center font-medium dream-scroll max-h-32 overflow-y-auto px-2">
                    "{pokemon.dreamText}"
                </p>
                <div className="mt-3 pt-3 border-t border-gray-50 text-[10px] text-center text-gray-400 uppercase tracking-widest">
                    Dream Memory
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel;