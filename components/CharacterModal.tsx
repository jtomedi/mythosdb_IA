import React, { useRef } from 'react';
import type { Character } from '../types';
import { GenealogyChart } from './GenealogyChart';

interface CharacterModalProps {
  character: Character | null;
  allCharacters: Character[];
  onClose: () => void;
  onImageUpdate: (characterId: number, newImageUrl: string) => void;
  onEdit: (character: Character) => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({ character, allCharacters, onClose, onImageUpdate, onEdit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!character) return null;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string;
        if (newImageUrl) {
          onImageUpdate(character.id, newImageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#3e322b] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-[#d1c7b8] hover:text-white transition z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="relative group">
                <img src={character.imageUrl} alt={character.name} className="w-full h-auto rounded-lg object-cover shadow-lg" />
                <div 
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
                  onClick={handleImageClick}
                >
                  <div className="text-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="mt-2 font-semibold">Cambiar Imagen</p>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-4xl font-serif font-bold text-[#d4af37]">{character.name}</h2>
                <button 
                  onClick={() => onEdit(character)}
                  className="bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/40 transition-colors p-2 rounded-full"
                  aria-label={`Editar ${character.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#f5f1e8]">
                <span><span className="font-semibold text-[#d4af37]">Griego:</span> {character.greekName}</span>
                {character.romanName && <span><span className="font-semibold text-[#d4af37]">Romano:</span> {character.romanName}</span>}
              </div>
               <span className="inline-block bg-[#4b3f35] text-[#d4af37] text-xs font-bold px-3 py-1.5 rounded-full">{character.type}</span>
              <p className="text-[#f5f1e8] leading-relaxed">{character.description}</p>
              <div>
                <h4 className="font-semibold text-[#d4af37] mb-2">Aparece en:</h4>
                <div className="flex flex-wrap gap-2">
                  {character.works.map(work => (
                    <span key={work} className="bg-[#4b3f35] text-[#d4af37] text-xs font-medium px-2.5 py-1 rounded-full">{work}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-serif font-bold text-center text-[#d4af37] mb-4 border-b-2 border-[#6e5a4b] pb-2">Mapa Genealógico</h3>
            <GenealogyChart character={character} allCharacters={allCharacters} />
          </div>

        </div>
      </div>
    </div>
  );
};
