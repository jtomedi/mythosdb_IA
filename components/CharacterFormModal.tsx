import React, { useState, useEffect } from 'react';
import type { Character } from '../types';
import { Work, CharacterType } from '../types';

interface CharacterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: Omit<Character, 'id'> & { id?: number }) => void;
  characterToEdit: Character | null;
  allCharacters: Character[];
}

const initialFormState: Omit<Character, 'id'> = {
  name: '',
  greekName: '',
  romanName: '',
  description: '',
  imageUrl: '',
  works: [],
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
        romanName: characterToEdit.romanName || '',
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

  const handleWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const workValue = value as Work;
    if (checked) {
      setFormData(prev => ({ ...prev, works: [...prev.works, workValue] }));
    } else {
      setFormData(prev => ({ ...prev, works: prev.works.filter(w => w !== workValue) }));
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
        className="bg-[#3e322b] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin relative"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <h2 className="text-3xl font-serif font-bold text-center text-[#d4af37] mb-4">
            {characterToEdit ? 'Editar Personaje' : 'Añadir Nuevo Personaje'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" required className="input-style" />
            <input type="text" name="greekName" value={formData.greekName} onChange={handleChange} placeholder="Nombre Griego" required className="input-style" />
            <input type="text" name="romanName" value={formData.romanName} onChange={handleChange} placeholder="Nombre Romano (Opcional)" className="input-style" />
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL de la Imagen" required className="input-style" />
          </div>

          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" required className="input-style w-full min-h-[100px]"></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type & Works */}
            <div>
                <label className="label-style">Tipo de Personaje</label>
                <select name="type" value={formData.type} onChange={handleChange} className="input-style w-full">
                    {Object.values(CharacterType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
            <div>
                <label className="label-style">Aparece en</label>
                <div className="bg-[#2a211c] border border-[#6e5a4b] p-3 rounded-md space-y-2">
                    {Object.values(Work).map(work => (
                        <label key={work} className="flex items-center space-x-2 text-[#f5f1e8]">
                            <input type="checkbox" value={work} checked={formData.works.includes(work)} onChange={handleWorkChange} className="form-checkbox bg-[#4b3f35] border-[#6e5a4b] text-[#d4af37] focus:ring-[#d4af37]"/>
                            <span>{work}</span>
                        </label>
                    ))}
                </div>
            </div>
          </div>

          {/* Family Relations */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-center text-[#d4af37]">Relaciones Familiares</h3>
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
          background-color: #2a211c;
          border: 1px solid #6e5a4b;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          color: #f5f1e8;
          transition: all 0.2s;
        }
        .input-style:focus {
          ring: 2px;
          ring-color: #d4af37;
          border-color: #d4af37;
          outline: none;
        }
        .label-style {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #d4af37;
          margin-bottom: 0.5rem;
        }
        .btn-primary {
          background-color: #d4af37;
          color: #2a211c;
          font-weight: bold;
          padding: 0.5rem 1.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s;
        }
        .btn-primary:hover {
          background-color: #e6c35c;
        }
        .btn-secondary {
          background-color: #4b3f35;
          color: #f5f1e8;
          font-weight: 500;
          padding: 0.5rem 1.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s;
        }
        .btn-secondary:hover {
          background-color: #6e5a4b;
        }
      `}</style>
    </div>
  );
};
