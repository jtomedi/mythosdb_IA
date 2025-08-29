import React, { useState, useMemo } from 'react';
import { characters as initialCharacters } from './data/characters';
import type { Character, Era, CharacterType } from './types';
import { CharacterCard } from './components/CharacterCard';
import { CharacterModal } from './components/CharacterModal';
import { FilterBar } from './components/FilterBar';
import { CharacterFormModal } from './components/CharacterFormModal';

const App: React.FC = () => {
  const [characterList, setCharacterList] = useState<Character[]>(initialCharacters);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEra, setSelectedEra] = useState<Era | 'all'>('all');
  const [selectedType, setSelectedType] = useState<CharacterType | 'all'>('all');
  const [alphaFilter, setAlphaFilter] = useState<string>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const filteredCharacters = useMemo(() => {
    return characterList
      .filter(char => 
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.epithet.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(char => 
        selectedEra === 'all' || char.eras.includes(selectedEra)
      )
      .filter(char => 
        selectedType === 'all' || char.type === selectedType
      )
      .filter(char => 
        alphaFilter === 'all' || char.name.toUpperCase().startsWith(alphaFilter)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, selectedEra, selectedType, alphaFilter, characterList]);

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };
  
  const handleImageUpdate = (characterId: number, newImageUrl: string) => {
    const updatedList = characterList.map(char => 
      char.id === characterId ? { ...char, imageUrl: newImageUrl } : char
    );
    setCharacterList(updatedList);
    
    if (selectedCharacter && selectedCharacter.id === characterId) {
        setSelectedCharacter(prev => prev ? { ...prev, imageUrl: newImageUrl } : null);
    }
  };

  const handleOpenFormToAdd = () => {
    setEditingCharacter(null);
    setIsFormModalOpen(true);
  };
  
  const handleOpenFormToEdit = (character: Character) => {
    setEditingCharacter(character);
    setSelectedCharacter(null); // Close detail modal
    setIsFormModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormModalOpen(false);
    setEditingCharacter(null);
  };

  const handleSaveCharacter = (characterData: Omit<Character, 'id'> & { id?: number }) => {
    if (characterData.id) { // Editing existing character
      setCharacterList(characterList.map(c => c.id === characterData.id ? { ...c, ...characterData } as Character : c));
    } else { // Adding new character
      const newId = characterList.length > 0 ? Math.max(...characterList.map(c => c.id)) + 1 : 1;
      const newCharacter: Character = { ...characterData, id: newId };
      setCharacterList([...characterList, newCharacter]);
    }
    handleCloseForm();
  };

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold text-[#e8b923] tracking-wider">
            Kemet DB
          </h1>
          <p className="text-[#3c6e71] mt-2 text-lg">
            Una base de datos de dioses, faraones y leyendas del Nilo.
          </p>
        </header>

        <main>
          <div className="mb-6 flex justify-center">
            <button 
              onClick={handleOpenFormToAdd}
              className="bg-[#e8b923] hover:bg-[#ffd149] text-[#1a3a4a] font-bold py-3 px-6 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
            >
              Añadir Nuevo Personaje
            </button>
          </div>

          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedEra={selectedEra}
            setSelectedEra={setSelectedEra}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            alphaFilter={alphaFilter}
            setAlphaFilter={setAlphaFilter}
          />
          
          <div className="text-center mb-6">
            <p className="text-[#3c6e71] font-semibold">
              Mostrando {filteredCharacters.length} de {characterList.length} personajes.
            </p>
          </div>

          {filteredCharacters.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredCharacters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    onSelect={handleSelectCharacter}
                  />
                ))}
              </div>
          ) : (
            <div className="text-center py-16">
                <p className="text-xl text-[#3c6e71]">No se encontraron personajes con los filtros actuales.</p>
            </div>
          )}

        </main>
      </div>

      <CharacterModal 
        character={selectedCharacter} 
        allCharacters={characterList}
        onClose={handleCloseModal} 
        onImageUpdate={handleImageUpdate}
        onEdit={handleOpenFormToEdit}
      />

      <CharacterFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseForm}
        onSave={handleSaveCharacter}
        characterToEdit={editingCharacter}
        allCharacters={characterList}
      />
      
      <footer className="text-center mt-12 py-4 border-t border-[#d1c7b8]">
        <p className="text-[#3c6e71] text-sm">Creado con pasión por el Antiguo Egipto.</p>
      </footer>
    </div>
  );
};

export default App;