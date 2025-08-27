import React, { useState, useEffect } from 'react';
import { Work, CharacterType } from '../types';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedWork: Work | 'all';
  setSelectedWork: (work: Work | 'all') => void;
  selectedType: CharacterType | 'all';
  setSelectedType: (type: CharacterType | 'all') => void;
  alphaFilter: string;
  setAlphaFilter: (char: string) => void;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedWork,
  setSelectedWork,
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
    <div className="p-4 md:p-6 bg-[#3e322b]/70 backdrop-blur-sm rounded-lg shadow-lg mb-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Search Input */}
        <div>
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="search" className="block text-sm font-medium text-[#d4af37] mb-2">
              Buscar por Nombre
            </label>
            <input
              id="search"
              type="text"
              placeholder="Ej: Aquiles..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="w-full bg-[#2a211c] border border-[#6e5a4b] rounded-md py-2 px-3 text-[#f5f1e8] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition"
            />
            <button
              type="submit"
              className="mt-2 w-full bg-[#d4af37] hover:bg-[#e6c35c] text-[#2a211c] font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Buscar
            </button>
          </form>
        </div>
        {/* Work Filter */}
        <div>
          <label htmlFor="work" className="block text-sm font-medium text-[#d4af37] mb-2">
            Filtrar por Obra
          </label>
          <select
            id="work"
            value={selectedWork}
            onChange={(e) => setSelectedWork(e.target.value as Work | 'all')}
            className="w-full bg-[#2a211c] border border-[#6e5a4b] rounded-md py-2 px-3 text-[#f5f1e8] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition"
          >
            <option value="all">Todas las Obras</option>
            {Object.values(Work).map((work) => (
              <option key={work} value={work}>
                {work}
              </option>
            ))}
          </select>
        </div>
        {/* Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-[#d4af37] mb-2">
            Filtrar por Tipo
          </label>
          <select
            id="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as CharacterType | 'all')}
            className="w-full bg-[#2a211c] border border-[#6e5a4b] rounded-md py-2 px-3 text-[#f5f1e8] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition"
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
        <label className="block text-sm font-medium text-[#d4af37] mb-2">
          Filtro Alfabético
        </label>
        <div className="flex flex-wrap gap-1 justify-center">
          <button
            onClick={() => setAlphaFilter('all')}
            className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-bold transition ${
              alphaFilter === 'all'
                ? 'bg-[#d4af37] text-[#2a211c]'
                : 'bg-[#4b3f35] text-[#f5f1e8] hover:bg-[#6e5a4b]'
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
                  ? 'bg-[#d4af37] text-[#2a211c]'
                  : 'bg-[#4b3f35] text-[#f5f1e8] hover:bg-[#6e5a4b]'
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