import React, { useState, useMemo } from 'react';
import { characters as initialCharacters } from './data/characters';
import type { Character, Era, CharacterType } from './types';
import { CharacterType as CharacterTypeEnum } from './types';
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
  const [dataSource, setDataSource] = useState<'all' | 'main' | 'generated'>('all');
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
      .filter(char => {
        if (dataSource === 'main') return char.id <= 80;
        if (dataSource === 'generated') return char.id > 80;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, selectedEra, selectedType, alphaFilter, dataSource, characterList]);

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
    const isEditing = characterData.id !== undefined;
    const savedCharacterId = isEditing ? characterData.id : (characterList.length > 0 ? Math.max(...characterList.map(c => c.id)) + 1 : 1);
    
    const originalCharacter = isEditing ? characterList.find(c => c.id === savedCharacterId) : null;
    
    const newSavedCharacter: Character = {
      ...(originalCharacter || { eras: [], type: CharacterTypeEnum.Mortal, description: '', epithet: '', name: '', imageUrl: '' }), // Provide defaults for new char
      ...characterData,
      id: savedCharacterId,
      family: {
        fatherId: characterData.family?.fatherId,
        motherId: characterData.family?.motherId,
        spousesIds: characterData.family?.spousesIds || [],
        childrenIds: characterData.family?.childrenIds || [],
      },
    };

    const oldFamily = originalCharacter?.family || {};
    const newFamily = newSavedCharacter.family;

    // --- Calculate relationship changes ---
    const oldFather = oldFamily.fatherId;
    const newFather = newFamily.fatherId;
    const oldMother = oldFamily.motherId;
    const newMother = newFamily.motherId;
    
    const oldSpouses = oldFamily.spousesIds || [];
    const newSpouses = newFamily.spousesIds || [];
    const removedSpouses = oldSpouses.filter(id => !newSpouses.includes(id));
    const addedSpouses = newSpouses.filter(id => !oldSpouses.includes(id));

    const oldChildren = oldFamily.childrenIds || [];
    const removedChildren = oldChildren.filter(id => !(newFamily.childrenIds || []).includes(id));

    // --- Create a new list with all relationship updates ---
    let listWithUpdates = characterList.map(char => {
        let newChar = { ...char };
        let familyChanged = false;
        let newFamilyRelations = { ...newChar.family };

        // 1. Update character's children list based on parent changes of the saved character
        if (newChar.id === oldFather && oldFather !== newFather) {
            newFamilyRelations.childrenIds = (newFamilyRelations.childrenIds || []).filter(id => id !== savedCharacterId);
            familyChanged = true;
        }
        if (newChar.id === newFather && newFather !== oldFather) {
            const children = newFamilyRelations.childrenIds || [];
            if (!children.includes(savedCharacterId)) {
              newFamilyRelations.childrenIds = [...children, savedCharacterId];
              familyChanged = true;
            }
        }
        if (newChar.id === oldMother && oldMother !== newMother) {
            newFamilyRelations.childrenIds = (newFamilyRelations.childrenIds || []).filter(id => id !== savedCharacterId);
            familyChanged = true;
        }
        if (newChar.id === newMother && newMother !== oldMother) {
            const children = newFamilyRelations.childrenIds || [];
            if (!children.includes(savedCharacterId)) {
                newFamilyRelations.childrenIds = [...children, savedCharacterId];
                familyChanged = true;
            }
        }

        // 2. Update this character's spouse list
        if (removedSpouses.includes(newChar.id)) {
            newFamilyRelations.spousesIds = (newFamilyRelations.spousesIds || []).filter(id => id !== savedCharacterId);
            familyChanged = true;
        }
        if (addedSpouses.includes(newChar.id)) {
            const spouses = newFamilyRelations.spousesIds || [];
            if (!spouses.includes(savedCharacterId)) {
                newFamilyRelations.spousesIds = [...spouses, savedCharacterId];
                familyChanged = true;
            }
        }

        // 3. Update this character's parent if they were a removed child
        if (removedChildren.includes(newChar.id)) {
            if (newFamilyRelations.fatherId === savedCharacterId) {
                newFamilyRelations.fatherId = undefined;
                familyChanged = true;
            }
            if (newFamilyRelations.motherId === savedCharacterId) {
                newFamilyRelations.motherId = undefined;
                familyChanged = true;
            }
        }
        
        if (familyChanged) {
          return { ...newChar, family: newFamilyRelations };
        }
        return newChar;
    });

    if (isEditing) {
      // If editing, update the character itself in the list
      listWithUpdates = listWithUpdates.map(c => c.id === savedCharacterId ? newSavedCharacter : c);
    } else {
      // If adding, push the new character
      listWithUpdates.push(newSavedCharacter);
    }
    
    setCharacterList(listWithUpdates);
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
            dataSource={dataSource}
            setDataSource={setDataSource}
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
