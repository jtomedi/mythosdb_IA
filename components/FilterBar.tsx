import React, { useState, useEffect } from 'react';
import { Era, CharacterType } from '../types';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedEra: Era | 'all';
  setSelectedEra: (era: Era | 'all') => void;
  selectedType: CharacterType | 'all';
  setSelectedType: (type: CharacterType | 'all') => void;
  alphaFilter: string;
  setAlphaFilter: (char: string) => void;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedEra,
  setSelectedEra,
  selectedType,
  setSelectedType,
  alphaFilter,
  setAlphaFilter,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
  };

  return (
    <div className="p-4 md:p-6 bg-[#f4e8d3]/70 backdrop-blur-sm rounded-lg shadow-lg mb-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Search Input */}
        <div>
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="search" className="block text-sm font-medium text-[#e8b923] mb-2">
              Buscar por Nombre
            </label>
            <input
              id="search"
              type="text"
              placeholder="Ej: Anubis..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="w-full bg-[#fdf6e3] border border-[#c8b08a] rounded-md py-2 px-3 text-[#1a3a4a] focus:ring-2 focus:ring-[#e8b923] focus:border-[#e8b923] transition"
            />
            <button
              type="submit"
              className="mt-2 w-full bg-[#e8b923] hover:bg-[#ffd149] text-[#1a3a4a] font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Buscar
            </button>
          </form>
        </div>
        {/* Era Filter */}
        <div>
          <label htmlFor="era" className="block text-sm font-medium text-[#e8b923] mb-2">
            Filtrar por Era
          </label>
          <select
            id="era"
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value as Era | 'all')}
            className="w-full bg-[#fdf6e3] border border-[#c8b08a] rounded-md py-2 px-3 text-[#1a3a4a] focus:ring-2 focus:ring-[#e8b923] focus:border-[#e8b923] transition"
          >
            <option value="all">Todas las Eras</option>
            {Object.values(Era).map((era) => (
              <option key={era} value={era}>
                {era}
              </option>
            ))}
          </select>
        </div>
        {/* Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-[#e8b923] mb-2">
            Filtrar por Tipo
          </label>
          <select
            id="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as CharacterType | 'all')}
            className="w-full bg-[#fdf6e3] border border-[#c8b08a] rounded-md py-2 px-3 text-[#1a3a4a] focus:ring-2 focus:ring-[#e8b923] focus:border-[#e8b923] transition"
          >
            <option value="all">Todos los Tipos</option>
            {Object.values(CharacterType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alphabetical Filter */}
      <div>
        <label className="block text-sm font-medium text-[#e8b923] mb-2">
          Filtro Alfabético
        </label>
        <div className="flex flex-wrap gap-1 justify-center">
          <button
            onClick={() => setAlphaFilter('all')}
            className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-bold transition ${
              alphaFilter === 'all'
                ? 'bg-[#e8b923] text-[#1a3a4a]'
                : 'bg-[#d1c7b8] text-[#1a3a4a] hover:bg-[#c8b08a]'
            }`}
          >
            Todo
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setAlphaFilter(letter)}
              className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-bold transition ${
                alphaFilter === letter
                  ? 'bg-[#e8b923] text-[#1a3a4a]'
                  : 'bg-[#d1c7b8] text-[#1a3a4a] hover:bg-[#c8b08a]'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};