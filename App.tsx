
import React, { useState, useEffect, useRef } from 'react';
import { UserStorage, PokemonData, TOTAL_BOXES, SLOTS_PER_BOX } from './types';
import BoxGrid from './components/BoxGrid';
import SidePanel from './components/SidePanel';
import CreatorModal from './components/CreatorModal';
import WelcomeDialog from './components/WelcomeDialog';
import SettingsModal from './components/SettingsModal';
import Button from './components/Button';
import { getAllTrainers, loadTrainer, saveTrainer, deleteTrainer, createNewUser } from './utils/fileSystem';
import { ArrowLeft, ArrowRight, Plus, Download, LogOut, HardDrive, Settings, User, Upload, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  // Phases: 'trainer-select' -> 'app'
  const [phase, setPhase] = useState<'trainer-select' | 'app'>('trainer-select');
  
  // Data State
  const [user, setUser] = useState<UserStorage | null>(null);
  const [availableTrainers, setAvailableTrainers] = useState<{username: string, lastPlayed?: string}[]>([]);
  
  // UI State
  const [usernameInput, setUsernameInput] = useState('');
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // --- Initialization ---
  useEffect(() => {
    refreshTrainerList();
  }, []);

  const refreshTrainerList = async () => {
    const trainers = await getAllTrainers();
    setAvailableTrainers(trainers);
  };

  // --- Handlers ---

  const handleTrainerSelect = async (username: string) => {
    if (!username.trim()) return;
    
    let userData = await loadTrainer(username);
    if (!userData) {
        // New User
        userData = createNewUser(username);
        await saveTrainer(userData);
    }
    
    setUser(userData);
    setPhase('app');
    setShowWelcome(true);
    refreshTrainerList(); // Update list for next time
  };

  const handleLogout = () => {
    // Final save before exit
    if (user) saveTrainer(user);
    
    setUser(null);
    setPhase('trainer-select');
    setShowWelcome(false);
    setUsernameInput('');
    refreshTrainerList();
  };

  const handleAutoSave = async (updatedUser: UserStorage) => {
    setUser(updatedUser);
    setIsSaving(true);
    
    // Debounce save
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(async () => {
        await saveTrainer(updatedUser);
        setIsSaving(false);
    }, 1000);
  };

  const handleDeleteSave = async () => {
    if (!user) return;
    if (window.confirm(`Are you sure you want to delete the save file for "${user.username}"? This cannot be undone.`)) {
        await deleteTrainer(user.username);
        setIsSettingsOpen(false);
        handleLogout();
    }
  };

  const handleImportSave = async (importedUser: UserStorage) => {
    await saveTrainer(importedUser);
    // If we are in the app, reload the data
    if (user && user.username === importedUser.username) {
        setUser(importedUser);
    } else {
        // If we are in menu, just refresh list
        refreshTrainerList();
    }
    alert(`Successfully imported save data for ${importedUser.username}`);
  };

  const handleGlobalImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const json = JSON.parse(event.target?.result as string);
            if (!json.username || !json.boxes) throw new Error("Invalid format");
            await handleImportSave(json);
            if (importInputRef.current) importInputRef.current.value = '';
        } catch (e) {
            alert("Invalid save file.");
        }
    };
    reader.readAsText(file);
  };

  // --- Game Logic ---

  const handleBoxNav = (direction: 'prev' | 'next') => {
    setCurrentBoxIndex(prev => {
      if (direction === 'prev') return prev > 0 ? prev - 1 : TOTAL_BOXES - 1;
      return prev < TOTAL_BOXES - 1 ? prev + 1 : 0;
    });
    setSelectedSlotIndex(null);
  };

  const getSelectedPokemon = (): PokemonData | null => {
    if (!user || selectedSlotIndex === null) return null;
    return user.boxes[currentBoxIndex].slots[selectedSlotIndex].pokemon;
  };

  const handleSavePokemon = (newPokemon: PokemonData) => {
    if (!user) return;

    let targetSlotIndex = selectedSlotIndex;

    // Find first empty slot if none selected or current selected is occupied (and we are adding new)
    // Note: This logic might need refinement based on if we are editing vs creating.
    // For now, assuming we are creating/importing:
    if (targetSlotIndex === null || user.boxes[currentBoxIndex].slots[targetSlotIndex].pokemon !== null) {
       // Try to find empty slot in current box
       targetSlotIndex = user.boxes[currentBoxIndex].slots.findIndex(s => s.pokemon === null);
    }

    if (targetSlotIndex === -1) {
      alert("Current Box is full!");
      return;
    }

    const updatedBoxes = [...user.boxes];
    updatedBoxes[currentBoxIndex] = {
      ...updatedBoxes[currentBoxIndex],
      slots: updatedBoxes[currentBoxIndex].slots.map((slot, idx) => 
        idx === targetSlotIndex ? { pokemon: newPokemon } : slot
      )
    };

    handleAutoSave({ ...user, boxes: updatedBoxes });
    setSelectedSlotIndex(targetSlotIndex);
  };

  const handleDownloadPokemon = () => {
    const pokemon = getSelectedPokemon();
    if (!pokemon) return;

    const blob = new Blob([JSON.stringify(pokemon, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pokemon.speciesName}-${pokemon.id.slice(0,4)}.pkdream`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  // --- RENDER: Trainer Selection ---
  if (phase === 'trainer-select') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-white">
        <div className="max-w-lg w-full space-y-8">
           <div className="text-center space-y-2">
             <div className="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/50 mb-6">
                <HardDrive size={40} className="text-white" />
             </div>
             <h1 className="text-3xl font-bold font-pixel tracking-widest">Pokémon Dream Network</h1>
             <p className="text-gray-400 text-sm">Select a Save File</p>
           </div>

           <div className="space-y-4">
              {availableTrainers.length > 0 && (
                 <div className="grid gap-3 animate-in slide-in-from-bottom-4 duration-500">
                    {availableTrainers.map(t => (
                        <button 
                            key={t.username}
                            onClick={() => handleTrainerSelect(t.username)}
                            className="flex items-center justify-between p-4 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 rounded-xl transition-all group text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-white/20">
                                    <User className="text-white" />
                                </div>
                                <div>
                                    <span className="block text-lg font-bold">{t.username}</span>
                                    <span className="text-xs text-gray-400 group-hover:text-indigo-200">
                                        Last Played: {t.lastPlayed ? new Date(t.lastPlayed).toLocaleDateString() : 'Never'}
                                    </span>
                                </div>
                            </div>
                            <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                 </div>
              )}

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">New Game</h3>
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleTrainerSelect(usernameInput); }} 
                    className="flex gap-2 mb-4"
                  >
                     <input 
                        type="text" 
                        placeholder="Trainer Name..." 
                        className="flex-1 bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={usernameInput}
                        onChange={e => setUsernameInput(e.target.value)}
                     />
                     <Button type="submit" disabled={!usernameInput.trim()}>
                        Create
                     </Button>
                  </form>
                  
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
                    <div className="relative flex justify-center text-xs"><span className="px-2 bg-slate-800/50 text-gray-500">OR</span></div>
                  </div>

                  <button 
                    onClick={() => importInputRef.current?.click()}
                    className="w-full py-3 mt-2 text-sm text-gray-400 hover:text-white border border-dashed border-gray-600 hover:border-gray-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload size={16} /> Import Save File (.json)
                  </button>
                  <input type="file" ref={importInputRef} className="hidden" accept=".json" onChange={handleGlobalImport} />
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- RENDER: Main App ---
  if (!user) return null;

  const currentBox = user.boxes[currentBoxIndex];

  return (
    <div className="min-h-screen bg-[#dcfce7] p-4 md:p-8 flex flex-col text-gray-800 font-sans relative">
      
      {showWelcome && (
        <WelcomeDialog 
            username={user.username} 
            onDismiss={() => setShowWelcome(false)} 
        />
      )}
      
      <SettingsModal 
         isOpen={isSettingsOpen} 
         onClose={() => setIsSettingsOpen(false)}
         user={user}
         onDelete={handleDeleteSave}
         onImport={handleImportSave}
      />

      {/* Top Bar */}
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm">
                <HardDrive className="text-gray-600" />
            </div>
            <div>
                <h1 className="text-xl font-bold font-pixel tracking-widest text-gray-800">PDN Storage</h1>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>User: <span className="font-bold font-mono text-indigo-600">{user.username}</span></span>
                    {isSaving ? (
                        <span className="flex items-center gap-1 text-indigo-500 animate-pulse"><Upload size={10} /> Saving...</span>
                    ) : (
                        <span className="flex items-center gap-1 text-teal-600"><CheckCircle2 size={10} /> Saved</span>
                    )}
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setIsSettingsOpen(true)} size="sm" className="text-xs">
                <Settings size={14} className="mr-2" /> Settings
            </Button>

            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            <Button variant="ghost" onClick={handleLogout} className="text-xs text-red-500 hover:bg-red-50">
                <LogOut size={14} className="mr-2" /> Quit
            </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] min-h-[600px]">
        
        {/* Left Column: Box Navigation & Grid */}
        <div className="flex-1 flex flex-col gap-4">
            
            {/* Box Controls */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 shadow-sm flex items-center justify-between border border-white">
                <button 
                    onClick={() => handleBoxNav('prev')}
                    className="p-2 hover:bg-white rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                
                <div className="text-center">
                    <h2 className="text-2xl font-bold font-pixel tracking-widest text-gray-800">{currentBox.name}</h2>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {currentBox.slots.filter(s => s.pokemon).length} / {SLOTS_PER_BOX} Pokémon
                    </span>
                </div>

                <button 
                    onClick={() => handleBoxNav('next')}
                    className="p-2 hover:bg-white rounded-full transition-colors"
                >
                    <ArrowRight size={24} className="text-gray-600" />
                </button>
            </div>

            {/* The Grid */}
            <div className="flex-1 relative">
                 <BoxGrid 
                    box={currentBox} 
                    selectedSlotIndex={selectedSlotIndex} 
                    onSelectSlot={setSelectedSlotIndex}
                    onEmptySlotClick={(idx) => {
                        setSelectedSlotIndex(idx);
                    }}
                 />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Button 
                    onClick={() => setIsCreatorOpen(true)} 
                    className="flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 font-pixel text-lg tracking-wide"
                >
                    <Plus size={20} /> Add / Import
                </Button>
                 <Button 
                    onClick={handleDownloadPokemon} 
                    disabled={!getSelectedPokemon()}
                    variant="secondary"
                    className="flex items-center justify-center gap-2 py-4 font-pixel text-lg tracking-wide"
                >
                    <Download size={20} /> Save to Drive
                </Button>
            </div>
        </div>

        {/* Right Column: Side Panel (Details) */}
        <div className="w-full lg:w-[400px] shrink-0">
             <SidePanel pokemon={getSelectedPokemon()} />
        </div>

      </div>

      {/* Modals */}
      <CreatorModal 
        isOpen={isCreatorOpen} 
        onClose={() => setIsCreatorOpen(false)} 
        onSave={handleSavePokemon}
        targetBoxName={currentBox.name}
      />
    </div>
  );
};

export default App;
