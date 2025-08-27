import React from 'react';
import type { Character } from '../types';

interface GenealogyChartProps {
  character: Character;
  allCharacters: Character[];
}

interface MiniCardProps {
  char?: Character;
  label: string;
}

const MiniCard: React.FC<MiniCardProps> = ({ char, label }) => {
  if (!char) {
    return (
      <div className="flex flex-col items-center space-y-1">
        <div className="w-16 h-16 bg-[#4b3f35] border-2 border-[#6e5a4b] rounded-full flex items-center justify-center">
          <span className="text-[#d1c7b8] text-2xl">?</span>
        </div>
        <p className="text-xs text-[#d1c7b8]">{label}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center space-y-1 text-center">
      <img src={char.imageUrl} alt={char.name} className="w-16 h-16 rounded-full border-2 border-[#6e5a4b] object-cover" />
      <p className="font-semibold text-sm text-[#f5f1e8]">{char.name}</p>
      <p className="text-xs text-[#d1c7b8]">{label}</p>
    </div>
  );
};

export const GenealogyChart: React.FC<GenealogyChartProps> = ({ character, allCharacters }) => {
  const findChar = (id?: number) => allCharacters.find(c => c.id === id);

  const father = findChar(character.family.fatherId);
  const mother = findChar(character.family.motherId);
  const spouses = character.family.spousesIds?.map(findChar).filter(Boolean) as Character[] || [];
  const children = character.family.childrenIds?.map(findChar).filter(Boolean) as Character[] || [];

  const hasParents = father || mother;
  const hasChildren = children.length > 0;

  return (
    <div className="w-full py-4 bg-[#2a211c]/50 rounded-lg">
      <div className="flex flex-col items-center space-y-4">
        {/* Parents */}
        {hasParents && (
          <div className="flex items-center justify-center space-x-8">
            <MiniCard char={father} label="Padre" />
            <MiniCard char={mother} label="Madre" />
          </div>
        )}

        {/* Connector to main character */}
        {hasParents && (
           <div className="w-px h-8 bg-[#6e5a4b]" />
        )}

        {/* Main Character and Spouses */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex flex-col items-center text-center">
             <img src={character.imageUrl} alt={character.name} className="w-24 h-24 rounded-full border-4 border-[#d4af37] object-cover shadow-lg" />
             <p className="font-bold text-lg mt-2 text-[#f5f1e8]">{character.name}</p>
             <p className="text-sm text-[#f5f1e8]">(Personaje Central)</p>
          </div>
          {spouses.length > 0 && <div className="text-2xl text-[#d1c7b8]">&</div>}
          {spouses.map(spouse => <MiniCard key={spouse.id} char={spouse} label="Cónyuge" />)}
        </div>

        {/* Connector to children */}
        {hasChildren && (
          <div className="w-px h-8 bg-[#6e5a4b]" />
        )}

        {/* Children */}
        {hasChildren && (
          <>
            <p className="text-sm font-semibold text-[#d4af37] tracking-wider">DESCENDENCIA</p>
            <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-4">
              {children.map(child => <MiniCard key={child.id} char={child} label="Hijo/a" />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};