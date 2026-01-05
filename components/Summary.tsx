
import React, { useState } from 'react';
import { FinalDesign, PersonaStrings } from '../types';

interface SummaryProps {
  design: FinalDesign;
  onReset: () => void;
  onSave: (design: FinalDesign) => void;
  onCheckout: () => void;
  persona?: PersonaStrings;
}

const Summary: React.FC<SummaryProps> = ({ design, onReset, onSave, onCheckout, persona }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [revealAdvanced, setRevealAdvanced] = useState(false);

  const handleSave = () => {
    onSave(design);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const isRhodes = design.intake.guitarBrand?.toLowerCase().includes('rhodes');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div className="text-center">
        <h2 className="text-4xl font-serif mb-2">{isRhodes ? 'Restoration Sheet' : (persona?.summaryTitle || 'Build Sheet')}</h2>
        <p className="text-gray-600 italic">
          {isRhodes ? 'Specification for Rhodes Electric Piano Pickup Rewind.' : 'Technical specification for a hand-wound Ghostwood pickup.'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-[#4a3f35] p-6 text-white flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-75">Workshop ID: {design.id}</p>
            <h3 className="text-xl font-serif">{design.pickup.type}</h3>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest opacity-75">Est. Lead Time</p>
            <p className="text-lg">{isRhodes ? '28 Days' : '21 Days'}</p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <section>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#a68c6d] mb-3">Chassis & Context</h4>
              <ul className="text-sm space-y-2 text-gray-700">
                {isRhodes ? (
                  <>
                    <li><span className="font-medium">Piano Era:</span> {design.intake.pianoYear}</li>
                    <li><span className="font-medium">Failure Mode:</span> {design.intake.rhodesFailureInfo}</li>
                    <li><span className="font-medium">Restoration Scope:</span> {design.intake.packSize}</li>
                  </>
                ) : (
                  <>
                    <li><span className="font-medium">Opening:</span> {design.intake.currentRouting}</li>
                    <li><span className="font-medium">Instrument:</span> {design.intake.guitarBrand} {design.intake.guitarModel}</li>
                    <li><span className="font-medium">Scale:</span> {design.intake.scaleLength}</li>
                  </>
                )}
              </ul>
            </section>
            
            <section>
               <h4 className="text-xs font-bold uppercase tracking-widest text-[#a68c6d] mb-3">Tonal Context</h4>
               <div className="space-y-2">
                 <p className="text-sm text-gray-600 leading-relaxed">
                   <span className="font-bold text-[#4a3f35]">Style:</span> {design.intake.style || 'N/A'}
                 </p>
                 <p className="text-sm text-gray-600 leading-relaxed">
                   <span className="font-bold text-[#4a3f35]">Goals:</span> {design.intake.toneGoals.join(', ')}
                 </p>
                 <p className="text-sm text-gray-600 leading-relaxed">
                   <span className="font-bold text-[#4a3f35]">Performance:</span> {design.intake.performanceType}
                 </p>
               </div>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#a68c6d] mb-3">Build Specification</h4>
              <ul className="text-sm space-y-2 text-gray-700">
                <li><span className="font-medium">Magnet:</span> {design.pickup.magnetType}</li>
                <li><span className="font-medium">Wind Style:</span> {design.pickup.windStyle}</li>
                <li><span className="font-medium">Wire Gauge:</span> {design.pickup.wireGauge}</li>
                <li><span className="font-medium">Resistance:</span> {design.pickup.dcResistance}</li>
                <li><span className="font-medium">Potting:</span> {design.pickup.potting}</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="px-8 pb-4">
          <button 
            onClick={() => setRevealAdvanced(!revealAdvanced)}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#4a3f35] transition-colors flex items-center gap-2"
          >
            {revealAdvanced ? 'Hide Builder Secrets' : 'Reveal Builder Secrets'}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transform transition-transform ${revealAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {revealAdvanced && (
            <div className="mt-4 p-4 bg-[#fcfaf8] border border-[#e2e2da] rounded-md grid grid-cols-2 gap-4 animate-fadeIn">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#a68c6d] font-bold">Total Wind Count</p>
                <p className="text-sm font-serif text-[#4a3f35]">{design.pickup.windCount}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#a68c6d] font-bold">Magnetic Polarity</p>
                <p className="text-sm font-serif text-[#4a3f35]">{design.pickup.magnetPolarity}</p>
              </div>
              <div className="col-span-2">
                 <p className="text-[10px] uppercase tracking-widest text-[#a68c6d] font-bold">Winding Pattern</p>
                 <p className="text-xs text-gray-600">{design.pickup.windApproach}</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 pb-8 pt-4">
           <div className="bg-gray-50 p-6 rounded border border-gray-100 italic text-gray-600 text-sm leading-relaxed">
             "{design.pickup.luthierNote}"
           </div>
        </div>

        <div className="bg-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="text-center md:text-left">
             <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Hand-Build / Service Cost</p>
             <p className="text-3xl font-serif text-[#4a3f35]">Variable <span className="text-xs font-sans text-gray-400">See Pricing</span></p>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
             <button 
                onClick={handleSave} 
                className={`flex-1 md:flex-none px-8 py-4 border rounded font-medium transition-all ${
                  isSaved ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
             >
               {isSaved ? 'Project Saved' : 'Save for Comparison'}
             </button>
             <button 
                onClick={onCheckout}
                className="flex-1 md:flex-none px-8 py-4 bg-[#4a3f35] text-white rounded font-medium hover:bg-[#3d332a]"
             >
               Commission Build
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
