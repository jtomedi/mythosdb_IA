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
        className="bg-[#fdf6e3] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-[#3c6e71] hover:text-[#1a3a4a] transition z-10"
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
              <div className="flex items-center gap-2">
                <h2 className="text-4xl font-serif font-bold text-[#e8b923]">{character.name}</h2>
                 <button 
                  onClick={() => onEdit(character)}
                  className="bg-[#e8b923]/20 text-[#e8b923] hover:bg-[#e8b923]/40 transition-colors p-2 rounded-full"
                  aria-label={`Editar ${character.name}`}
                  title={`Editar ${character.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>
                <a
                  href={`https://es.wikipedia.org/wiki/${character.name.replace(/ /g, '_')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#e8b923]/20 text-[#e8b923] hover:bg-[#e8b923]/40 transition-colors p-2 rounded-full"
                  aria-label={`Buscar ${character.name} en Wikipedia`}
                  title="Buscar en Wikipedia"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                     <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              </div>
              <div className="text-[#1a3a4a]">
                <span><span className="font-semibold text-[#e8b923]">Epíteto:</span> {character.epithet}</span>
              </div>
               <span className="inline-block bg-[#d1c7b8] text-[#1a3a4a] text-xs font-bold px-3 py-1.5 rounded-full">{character.type}</span>
              <p className="text-[#1a3a4a] leading-relaxed">{character.description}</p>
              <div>
                <h4 className="font-semibold text-[#e8b923] mb-2">Periodos:</h4>
                <div className="flex flex-wrap gap-2">
                  {character.eras.map(era => (
                    <span key={era} className="bg-[#d1c7b8] text-[#1a3a4a] text-xs font-medium px-2.5 py-1 rounded-full">{era}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-serif font-bold text-center text-[#e8b923] mb-4 border-b-2 border-[#c8b08a] pb-2">Mapa Genealógico</h3>
            <GenealogyChart character={character} allCharacters={allCharacters} />
          </div>

        </div>
      </div>
    </div>
  );
};
