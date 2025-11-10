import React from 'react';
import { Box, PokemonData } from '../types';
import { Plus } from 'lucide-react';

interface BoxGridProps {
  box: Box;
  selectedSlotIndex: number | null;
  onSelectSlot: (index: number) => void;
  onEmptySlotClick: (index: number) => void;
}

const BoxGrid: React.FC<BoxGridProps> = ({ box, selectedSlotIndex, onSelectSlot, onEmptySlotClick }) => {
  return (
    <div className="bg-[#fca5a5] bg-opacity-20 p-4 rounded-2xl border-4 border-[#fca5a5]/30 backdrop-blur-sm">
      <div className="grid grid-cols-6 grid-rows-5 gap-3">
        {box.slots.map((slot, index) => {
          const isSelected = selectedSlotIndex === index;
          
          return (
            <div
              key={index}
              onClick={() => slot.pokemon ? onSelectSlot(index) : onEmptySlotClick(index)}
              className={`
                aspect-square rounded-lg relative transition-all duration-200 cursor-pointer
                flex items-center justify-center
                ${isSelected 
                  ? 'bg-white ring-4 ring-blue-400 z-10 scale-110 shadow-xl' 
                  : 'bg-white/40 hover:bg-white/70 hover:scale-105 shadow-sm hover:shadow-md'
                }
              `}
            >
              {slot.pokemon ? (
                <div className="w-full h-full p-1 flex items-center justify-center">
                   <img 
                    src={slot.pokemon.spriteUrl} 
                    alt={slot.pokemon.speciesName}
                    className={`object-contain w-full h-full rendering-pixelated ${isSelected ? 'animate-bounce' : ''}`} 
                    style={{ imageRendering: 'pixelated' }}
                   />
                   {/* Level Badge */}
                   <div className="absolute bottom-0.5 right-0.5 bg-black/50 text-white text-[8px] px-1 rounded backdrop-blur-md font-mono">
                     Lv.{slot.pokemon.level}
                   </div>
                </div>
              ) : (
                 <div className={`text-gray-400 opacity-0 hover:opacity-50 transition-opacity`}>
                    <Plus size={16} />
                 </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoxGrid;