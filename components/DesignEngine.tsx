
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { IntakeData, PickupSpec, PersonaStrings } from '../types';
import { generatePickupDesign, recalculateSpec } from '../services/geminiService';
import { MAGNET_TYPES, WIND_STYLES, WIRE_GAUGES } from '../constants';

interface DesignEngineProps {
  intake: IntakeData;
  onConfirm: (spec: PickupSpec) => void;
  onBack: () => void;
  persona?: PersonaStrings;
  brandSummary?: string;
}

const DesignEngine: React.FC<DesignEngineProps> = ({ intake, onConfirm, onBack, persona, brandSummary }) => {
  const [spec, setSpec] = useState<PickupSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDesign = async () => {
      try {
        setLoading(true);
        const design = await generatePickupDesign(intake, brandSummary);
        setSpec(design);
      } catch (err) {
        setError('The workshop is currently busy. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadDesign();
  }, [intake, brandSummary]);

  const handleUpdate = async (updates: Partial<PickupSpec>) => {
    if (!spec) return;
    const newSpec = { ...spec, ...updates };
    setSpec(newSpec);
    setUpdating(true);
    try {
      const recalculated = await recalculateSpec(newSpec, intake);
      setSpec(recalculated);
    } catch (e) {
      console.error('Recalculation failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-12 h-12 border-4 border-[#4a3f35] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center max-w-md">
          <p className="font-serif text-xl italic text-[#4a3f35]">{persona?.loadingMessage || 'Engineering magnetic parameters...'}</p>
        </div>
      </div>
    );
  }

  if (error || !spec) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={onBack} className="text-[#4a3f35] underline">Back to details</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Manual Builder Sidebar */}
          <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#4a3f35] mb-4">Workshop Controls</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Magnet Alloy</label>
                <select 
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                  value={spec.magnetType}
                  onChange={(e) => handleUpdate({ magnetType: e.target.value })}
                >
                  {MAGNET_TYPES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Wind Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {WIND_STYLES.map(s => {
                    const cleanStyle = s.split(' ')[0];
                    return (
                      <button
                        key={s}
                        onClick={() => handleUpdate({ windStyle: cleanStyle as any })}
                        className={`p-2 text-[10px] font-bold border rounded transition-all ${
                          spec.windStyle === cleanStyle ? 'bg-[#4a3f35] text-white border-[#4a3f35]' : 'bg-white text-gray-400 border-gray-200'
                        }`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Wire Gauge</label>
                <select 
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                  value={spec.wireGauge}
                  onChange={(e) => handleUpdate({ wireGauge: e.target.value })}
                >
                  {WIRE_GAUGES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Potting Level</label>
                <select 
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                  value={spec.potting}
                  onChange={(e) => handleUpdate({ potting: e.target.value as any })}
                >
                  <option>None</option>
                  <option>Light</option>
                  <option>Heavy</option>
                </select>
              </div>
            </div>

            {updating && (
              <div className="pt-4 flex items-center gap-2 text-[#a68c6d] animate-pulse">
                <div className="w-2 h-2 bg-[#a68c6d] rounded-full"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Recalculating Tone...</span>
              </div>
            )}
          </div>

          {/* Visualization & Notes */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-3xl font-serif text-[#4a3f35]">{spec.type}</h2>
                <p className="text-xs text-[#a68c6d] font-bold uppercase tracking-widest mt-1">Est. Resistance: {spec.dcResistance}</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-[#4a3f35] text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">
                  {spec.windApproach}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-48">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Frequency Profile</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spec.frequencyResponse}>
                    <XAxis dataKey="freq" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis hide domain={[0, 10]} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {spec.frequencyResponse.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4a3f35' : '#a68c6d'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                 <div className="p-4 bg-white border-l-4 border-[#a68c6d] shadow-sm">
                    <p className="text-sm italic text-gray-700 leading-relaxed">"{spec.luthierNote}"</p>
                 </div>
                 {spec.realityCheck && (
                    <div className="p-3 bg-amber-50 rounded text-[10px] text-amber-900 leading-tight">
                       <span className="font-bold uppercase block mb-1">Reality Check:</span>
                       {spec.realityCheck}
                    </div>
                 )}
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <button
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Intake
              </button>
              <button
                onClick={() => onConfirm(spec)}
                className="flex-1 bg-[#4a3f35] text-white py-3 rounded font-medium hover:bg-[#3d332a] transition-colors"
              >
                Finalize Specification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignEngine;
