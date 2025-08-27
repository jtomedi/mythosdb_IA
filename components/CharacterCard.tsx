import React from 'react';
import type { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onSelect }) => {
  return (
    <div
      className="bg-[#3e322b] rounded-lg overflow-hidden shadow-lg hover:shadow-[#d4af37]/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
      onClick={() => onSelect(character)}
    >
      <div className="relative h-64">
        <img
          src={character.imageUrl}
          alt={`Imagen de ${character.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-serif font-bold text-white">{character.name}</h3>
          <p className="text-sm text-[#d4af37]">{character.greekName}</p>
        </div>
      </div>
    </div>
  );
};