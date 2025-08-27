import React, { useState, useMemo } from 'react';
import { characters as initialCharacters } from './data/characters';
import type { Character, Work, CharacterType } from './types';
import { CharacterCard } from './components/CharacterCard';
import { CharacterModal } from './components/CharacterModal';
import { FilterBar } from './components/FilterBar';
import { CharacterFormModal } from './components/CharacterFormModal';

const App: React.FC = () => {
  const [characterList, setCharacterList] = useState<Character[]>(initialCharacters);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWork, setSelectedWork] = useState<Work | 'all'>('all');
  const [selectedType, setSelectedType] = useState<CharacterType | 'all'>('all');
  const [alphaFilter, setAlphaFilter] = useState<string>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const filteredCharacters = useMemo(() => {
    return characterList
      .filter(char => 
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.greekName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (char.romanName && char.romanName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(char => 
        selectedWork === 'all' || char.works.includes(selectedWork)
      )
      .filter(char => 
        selectedType === 'all' || char.type === selectedType
      )
      .filter(char => 
        alphaFilter === 'all' || char.name.toUpperCase().startsWith(alphaFilter)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, selectedWork, selectedType, alphaFilter, characterList]);

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
      const newId = Math.max(...characterList.map(c => c.id)) + 1;
      const newCharacter: Character = { ...characterData, id: newId };
      setCharacterList([...characterList, newCharacter]);
    }
    handleCloseForm();
  };

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold text-[#d4af37] tracking-wider">
            Mythos DB
          </h1>
          <p className="text-[#6e5a4b] mt-2 text-lg">
            Una base de datos de héroes, dioses y mortales de la mitología.
          </p>
        </header>

        <main>
          <div className="mb-6 flex justify-center">
            <button 
              onClick={handleOpenFormToAdd}
              className="bg-[#d4af37] hover:bg-[#e6c35c] text-[#2a211c] font-bold py-3 px-6 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
            >
              Añadir Nuevo Personaje
            </button>
          </div>

          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedWork={selectedWork}
            setSelectedWork={setSelectedWork}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            alphaFilter={alphaFilter}
            setAlphaFilter={setAlphaFilter}
          />
          
          <div className="text-center mb-6">
            <p className="text-[#6e5a4b] font-semibold">
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
                <p className="text-xl text-[#6e5a4b]">No se encontraron personajes con los filtros actuales.</p>
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
        <p className="text-[#6e5a4b] text-sm">Creado con pasión por la mitología clásica.</p>
      </footer>
    </div>
  );
};

export default App;
