import React, { useState, useEffect } from 'react';
import type { Character } from '../types';
import { Era, CharacterType } from '../types';

interface CharacterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: Omit<Character, 'id'> & { id?: number }) => void;
  characterToEdit: Character | null;
  allCharacters: Character[];
}

const initialFormState: Omit<Character, 'id'> = {
  name: '',
  epithet: '',
  description: '',
  imageUrl: '',
  eras: [],
  type: CharacterType.Mortal,
  family: {
    fatherId: undefined,
    motherId: undefined,
    spousesIds: [],
    childrenIds: [],
  },
};

export const CharacterFormModal: React.FC<CharacterFormModalProps> = ({ isOpen, onClose, onSave, characterToEdit, allCharacters }) => {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (characterToEdit) {
      setFormData({
        ...initialFormState,
        ...characterToEdit,
        family: {
            fatherId: characterToEdit.family.fatherId,
            motherId: characterToEdit.family.motherId,
            spousesIds: characterToEdit.family.spousesIds || [],
            childrenIds: characterToEdit.family.childrenIds || [],
        }
      });
    } else {
      setFormData(initialFormState);
    }
  }, [characterToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('family.')) {
        const key = name.split('.')[1] as keyof Character['family'];
        setFormData(prev => ({ ...prev, family: { ...prev.family, [key]: value ? parseInt(value) : undefined }}));
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name } = e.target;
    const options = e.target.options;
    const value: number[] = [];
    for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
            value.push(parseInt(options[i].value));
        }
    }
    const key = name.split('.')[1] as keyof Character['family'];
    setFormData(prev => ({...prev, family: { ...prev.family, [key]: value }}));
  };

  const handleEraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const eraValue = value as Era;
    if (checked) {
      setFormData(prev => ({ ...prev, eras: [...prev.eras, eraValue] }));
    } else {
      setFormData(prev => ({ ...prev, eras: prev.eras.filter(w => w !== eraValue) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: characterToEdit?.id });
    onClose();
  };

  const otherCharacters = allCharacters.filter(c => c.id !== characterToEdit?.id);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-[#f4e8d3] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin relative"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <h2 className="text-3xl font-serif font-bold text-center text-[#e8b923] mb-4">
            {characterToEdit ? 'Editar Personaje' : 'Añadir Nuevo Personaje'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" required className="input-style" />
            <input type="text" name="epithet" value={formData.epithet} onChange={handleChange} placeholder="Epíteto" required className="input-style" />
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL de la Imagen" required className="input-style col-span-1 md:col-span-2" />
          </div>

          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" required className="input-style w-full min-h-[100px]"></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type & Eras */}
            <div>
                <label className="label-style">Tipo de Personaje</label>
                <select name="type" value={formData.type} onChange={handleChange} className="input-style w-full">
                    {Object.values(CharacterType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
            <div>
                <label className="label-style">Periodos</label>
                <div className="bg-[#fdf6e3] border border-[#c8b08a] p-3 rounded-md space-y-2">
                    {Object.values(Era).map(era => (
                        <label key={era} className="flex items-center space-x-2 text-[#1a3a4a]">
                            <input type="checkbox" value={era} checked={formData.eras.includes(era)} onChange={handleEraChange} className="form-checkbox bg-[#d1c7b8] border-[#c8b08a] text-[#e8b923] focus:ring-[#e8b923]"/>
                            <span>{era}</span>
                        </label>
                    ))}
                </div>
            </div>
          </div>

          {/* Family Relations */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-center text-[#e8b923]">Relaciones Familiares</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select name="family.fatherId" value={formData.family.fatherId || ''} onChange={handleChange} className="input-style w-full">
                    <option value="">Seleccionar Padre</option>
                    {otherCharacters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select name="family.motherId" value={formData.family.motherId || ''} onChange={handleChange} className="input-style w-full">
                    <option value="">Seleccionar Madre</option>
                    {otherCharacters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div>
                <label className="label-style">Cónyuges</label>
                <select name="family.spousesIds" value={formData.family.spousesIds?.map(String) || []} onChange={handleMultiSelectChange} multiple className="input-style w-full h-32">
                    {otherCharacters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div>
                <label className="label-style">Hijos/as</label>
                 <select name="family.childrenIds" value={formData.family.childrenIds?.map(String) || []} onChange={handleMultiSelectChange} multiple className="input-style w-full h-32">
                    {otherCharacters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
      <style>{`
        .input-style {
          background-color: #fdf6e3;
          border: 1px solid #c8b08a;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          color: #1a3a4a;
          transition: all 0.2s;
        }
        .input-style:focus {
          ring: 2px;
          ring-color: #e8b923;
          border-color: #e8b923;
          outline: none;
        }
        .label-style {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #e8b923;
          margin-bottom: 0.5rem;
        }
        .btn-primary {
          background-color: #e8b923;
          color: #1a3a4a;
          font-weight: bold;
          padding: 0.5rem 1.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s;
        }
        .btn-primary:hover {
          background-color: #ffd149;
        }
        .btn-secondary {
          background-color: #d1c7b8;
          color: #1a3a4a;
          font-weight: 500;
          padding: 0.5rem 1.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s;
        }
        .btn-secondary:hover {
          background-color: #c8b08a;
        }
      `}</style>
    </div>
  );
};