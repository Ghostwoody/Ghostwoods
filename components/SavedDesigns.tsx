
import React, { useState } from 'react';
import { FinalDesign } from '../types';

interface SavedDesignsProps {
  designs: FinalDesign[];
  onCompare: (id1: string, id2: string) => void;
  onSelectDesign: (design: FinalDesign) => void;
}

const SavedDesigns: React.FC<SavedDesignsProps> = ({ designs, onCompare, onSelectDesign }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : prev.length < 2 ? [...prev, id] : [prev[1], id]
    );
  };

  if (designs.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-400 italic">No designs saved in the workshop yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-serif">Workshop History</h2>
          <p className="text-sm text-gray-500">Select two designs to see how they differ.</p>
        </div>
        <button
          onClick={() => onCompare(selectedIds[0], selectedIds[1])}
          disabled={selectedIds.length !== 2}
          className="bg-[#4a3f35] text-white px-8 py-3 rounded font-medium disabled:opacity-50 transition-all hover:bg-[#3d332a]"
        >
          Compare Selection ({selectedIds.length}/2)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {designs.map(design => (
          <div 
            key={design.id}
            onClick={() => toggleSelection(design.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedIds.includes(design.id) 
                ? 'border-[#a68c6d] bg-[#fcfaf8]' 
                : 'border-white bg-white hover:border-gray-200 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                  {new Date(design.timestamp).toLocaleDateString()}
                </p>
                <h3 className="font-serif text-lg">{design.pickup.type}</h3>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedIds.includes(design.id) ? 'bg-[#a68c6d] border-[#a68c6d]' : 'border-gray-200'
              }`}>
                {selectedIds.includes(design.id) && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            
            <div className="space-y-1 text-xs text-gray-600 mb-4">
               <p><span className="font-bold">Magnet:</span> {design.pickup.magnetType}</p>
               <p><span className="font-bold">DCR:</span> {design.pickup.dcResistance}</p>
               <p><span className="font-bold">Goal:</span> {design.intake.toneGoals.slice(0, 2).join(', ')}</p>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelectDesign(design);
              }}
              className="text-xs text-[#a68c6d] font-bold uppercase tracking-wider hover:underline"
            >
              View Full Specs →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedDesigns;
