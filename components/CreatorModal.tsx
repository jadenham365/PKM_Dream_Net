import React, { useState, useRef } from 'react';
import { PokemonData, PokemonType, Gender } from '../types';
import { MOCK_SPECIES, GAMES_LIST } from '../constants';
import Button from './Button';
import { Sparkles, Upload, Save, X } from 'lucide-react';

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pokemon: PokemonData) => void;
  targetBoxName: string;
}

const CreatorModal: React.FC<CreatorModalProps> = ({ isOpen, onClose, onSave, targetBoxName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'create' | 'import'>('create');

  const [formData, setFormData] = useState<Partial<PokemonData>>({
    speciesName: 'Pikachu',
    dexNumber: 25,
    types: [PokemonType.Electric],
    level: 5,
    gender: Gender.Male,
    ot: 'Ash',
    idNo: '12345',
    metLocation: 'Pallet Town',
    metDate: new Date().toISOString().split('T')[0],
    metGame: 'Yellow',
    dreamText: '',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
  });

  if (!isOpen) return null;

  const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const species = MOCK_SPECIES.find(s => s.name === e.target.value);
    if (species) {
      setFormData(prev => ({
        ...prev,
        speciesName: species.name,
        dexNumber: species.dex,
        types: species.types,
        spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species.dex}.png`
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const isLegacy = fileName.match(/\.pk[0-9]+$/); // .pk1, .pk2, etc.
    
    if (isLegacy) {
      // Simulate parsing a legacy file
      // Randomize some stats to simulate reading binary data
      const randomSpecies = MOCK_SPECIES[Math.floor(Math.random() * MOCK_SPECIES.length)];
      setFormData({
        ...formData,
        speciesName: randomSpecies.name,
        dexNumber: randomSpecies.dex,
        types: randomSpecies.types,
        spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomSpecies.dex}.png`,
        level: Math.floor(Math.random() * 99) + 1,
        ot: 'LegacyUser',
        idNo: Math.floor(Math.random() * 99999).toString().padStart(5, '0'),
        metGame: 'Red', // Assume gen 1 for simplicity of demo
        dreamText: '' // Legacy files don't have dreams yet!
      });
      setMode('create'); // Switch to create mode to review/add dream
    } else if (fileName.endsWith('.pkdream')) {
        // Parse JSON
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                setFormData(json);
                setMode('create');
            } catch (err) {
                alert("Invalid .pkdream file");
            }
        };
        reader.readAsText(file);
    } else {
        alert("Unsupported file type. Please use .pk* or .pkdream");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate
    if (!formData.speciesName) {
        alert("Please ensure Species Name is filled.");
        return;
    }

    const finalPokemon: PokemonData = {
        id: crypto.randomUUID(),
        speciesName: formData.speciesName!,
        nickname: formData.nickname,
        dexNumber: formData.dexNumber || 25,
        types: formData.types || [PokemonType.Normal],
        level: Number(formData.level) || 1,
        gender: formData.gender as Gender,
        ot: formData.ot || 'Trainer',
        idNo: formData.idNo || '00000',
        metLocation: formData.metLocation || 'Unknown',
        metDate: formData.metDate || new Date().toISOString().split('T')[0],
        metGame: formData.metGame || 'Red',
        metLevel: formData.metLevel || Number(formData.level) || 1,
        dreamText: formData.dreamText || '',
        spriteUrl: formData.spriteUrl!
    };
    onSave(finalPokemon);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="text-yellow-400" />
                {mode === 'import' ? 'Import Pokémon' : 'New Pokémon Entry'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X />
            </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
            <button 
                onClick={() => setMode('create')}
                className={`flex-1 py-3 text-sm font-medium ${mode === 'create' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Manual Entry / Editor
            </button>
            <button 
                onClick={() => setMode('import')}
                className={`flex-1 py-3 text-sm font-medium ${mode === 'import' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Import File (.pk* / .pkdream)
            </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            {mode === 'import' ? (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".pkdream,.pk1,.pk2,.pk3,.pk4,.pk5,.pk6,.pk7,.pk8,.pk9" onChange={handleFileUpload} />
                    <Upload size={48} className="text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-700">Click to upload .pk* or .pkdream file</p>
                    <p className="text-sm text-gray-500 mt-2">Legacy files (.pk*) will be converted automatically.</p>
                </div>
            ) : (
                <form id="create-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Stats */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Species</label>
                            <select 
                                name="speciesName" 
                                value={formData.speciesName} 
                                onChange={handleSpeciesChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {MOCK_SPECIES.map(s => (
                                    <option key={s.name} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nickname</label>
                                <input 
                                    type="text" 
                                    name="nickname" 
                                    value={formData.nickname || ''} 
                                    onChange={handleInputChange}
                                    placeholder={formData.speciesName}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Level</label>
                                <input 
                                    type="number" 
                                    name="level" 
                                    min="1" max="100"
                                    value={formData.level} 
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleInputChange as any} className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value={Gender.Male}>Male</option>
                                    <option value={Gender.Female}>Female</option>
                                    <option value={Gender.Genderless}>Genderless</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Game of Origin</label>
                                <select name="metGame" value={formData.metGame} onChange={handleInputChange as any} className="w-full p-2 border border-gray-300 rounded-md">
                                    {GAMES_LIST.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">OT Name</label>
                                <input type="text" name="ot" value={formData.ot} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">OT ID</label>
                                <input type="text" name="idNo" value={formData.idNo} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visuals & Dream */}
                    <div className="space-y-4 flex flex-col">
                         <div className="flex justify-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                            <img src={formData.spriteUrl} alt="Preview" className="w-32 h-32 object-contain rendering-pixelated" />
                         </div>

                         <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase">Dream Memory (Optional)</label>
                            </div>
                            <textarea 
                                name="dreamText"
                                value={formData.dreamText}
                                onChange={handleInputChange}
                                placeholder="I remember the smell of rain in Viridian Forest..."
                                className="w-full flex-1 min-h-[100px] p-3 border border-purple-200 rounded-lg bg-purple-50 focus:bg-white focus:ring-2 focus:ring-purple-400 transition-colors text-sm italic resize-none"
                            />
                         </div>
                    </div>
                </form>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-xs text-gray-500">
                Adding to: <span className="font-bold text-gray-700">{targetBoxName}</span>
            </div>
            <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                {mode === 'create' && (
                     <Button variant="primary" onClick={handleSubmit} className="flex items-center gap-2">
                        <Save size={16} /> Save to Box
                     </Button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorModal;