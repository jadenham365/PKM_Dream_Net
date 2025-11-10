
import React, { useRef } from 'react';
import { UserStorage } from '../types';
import Button from './Button';
import { Download, Upload, Trash2, X, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserStorage;
  onImport: (data: UserStorage) => void;
  onDelete: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, onImport, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(user, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PDN_Save_${user.username}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Basic validation
        if (!json.username || !json.boxes) {
          throw new Error("Invalid save file format");
        }
        if (window.confirm(`Import save data for "${json.username}"? This will overwrite current data if the name matches.`)) {
            onImport(json);
            onClose();
        }
      } catch (err) {
        alert("Failed to import save file. Please ensure it is a valid PDN JSON backup.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Settings & Data
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          <div className="space-y-2">
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Backup & Restore</h3>
             <div className="grid grid-cols-1 gap-3">
                <Button onClick={handleExport} variant="secondary" className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2"><Download size={18} /> Export Save File</span>
                    <span className="text-xs text-gray-400">.json</span>
                </Button>
                
                <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="flex items-center justify-between w-full">
                     <span className="flex items-center gap-2"><Upload size={18} /> Import Save File</span>
                     <span className="text-xs text-gray-400">.json</span>
                </Button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".json" 
                    onChange={handleFileUpload} 
                />
             </div>
             <p className="text-xs text-gray-500 mt-1">
                Export your data regularly to keep it safe. You can use this file to move your data to another device.
             </p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-2">Danger Zone</h3>
            <Button onClick={onDelete} variant="danger" className="w-full flex items-center justify-center gap-2">
                <Trash2 size={18} /> Delete Save Data
            </Button>
             <p className="text-xs text-gray-400 mt-2 text-center">
                This will permanently delete <strong>{user.username}</strong> from this browser.
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
