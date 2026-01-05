
import React, { useState } from 'react';
import { IntakeData, PersonaStrings } from '../types';
import { TONE_GOALS, GUITAR_TYPES, WOOD_TYPES, PICKUP_ROUTES, PEDAL_TYPES, AMP_TYPES, GUITAR_BRANDS, INSTRUMENT_CATEGORIES, PERFORMANCE_TYPES, RHODES_YEARS, RHODES_FAILURE_MODES, RHODES_PACK_SIZES } from '../constants';

interface IntakeFormProps {
  onComplete: (data: IntakeData) => void;
  persona?: PersonaStrings;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ onComplete, persona }) => {
  const [instrumentCategory, setInstrumentCategory] = useState(INSTRUMENT_CATEGORIES[0]);
  const [data, setData] = useState<IntakeData>({
    style: '',
    dynamics: 'Medium',
    toneGoals: [],
    guitarType: GUITAR_TYPES[0],
    bodyWood: WOOD_TYPES[0],
    scaleLength: '25.5"',
    currentIssues: '',
    currentRouting: PICKUP_ROUTES[0],
    pedalType: PEDAL_TYPES[0],
    ampType: AMP_TYPES[0],
    guitarBrand: GUITAR_BRANDS[0],
    guitarModel: '',
    performanceType: PERFORMANCE_TYPES[0],
    pianoYear: RHODES_YEARS[0],
    rhodesFailureInfo: RHODES_FAILURE_MODES[0],
    packSize: RHODES_PACK_SIZES[0]
  });

  const toggleGoal = (goal: string) => {
    setData(prev => ({
      ...prev,
      toneGoals: prev.toneGoals.includes(goal)
        ? prev.toneGoals.filter(g => g !== goal)
        : [...prev.toneGoals, goal]
    }));
  };

  const isBass = instrumentCategory === 'Bass Guitar';
  const isRhodes = instrumentCategory === 'Rhodes Electric Piano';

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-3xl font-serif mb-2">{persona?.heroTitle || 'Tell us about your sound.'}</h2>
        <p className="text-gray-600 italic">{persona?.heroSubtitle || 'No hype, just physics and intent.'}</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-8">
        {/* Step 0: Instrument Type */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#a68c6d] border-b border-gray-100 pb-2">Instrument Class</h3>
          <div className="flex flex-wrap gap-4">
            {INSTRUMENT_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                    setInstrumentCategory(cat);
                    const isNewBass = cat === 'Bass Guitar';
                    const isNewRhodes = cat === 'Rhodes Electric Piano';
                    const defaultScale = isNewBass ? '34"' : isNewRhodes ? 'N/A' : '25.5"';
                    setData(prev => ({
                        ...prev,
                        scaleLength: defaultScale,
                        guitarBrand: isNewRhodes ? 'Rhodes / Fender Rhodes' : 'Fender',
                        currentRouting: isNewBass ? 'Split-Coil (P-Bass)' : isNewRhodes ? 'Rhodes Standard Coil' : 'Single Coil (Standard)'
                    }));
                }}
                className={`flex-1 min-w-[140px] py-3 px-4 border rounded-md text-sm font-medium transition-all ${
                  instrumentCategory === cat 
                    ? 'bg-[#4a3f35] text-white border-[#4a3f35]' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {isRhodes && (
          <section className="p-6 bg-[#fcfaf8] border border-[#e2e2da] rounded-md space-y-4 animate-fadeIn">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#a68c6d]">Workshop Service Notice</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-bold text-[#4a3f35]">Do not throw away your dead Rhodes pickups.</span> The original bobbins are precious. Ghostwood provides a dedicated <span className="italic">Rewind & Restoration Service</span> specifically for these instruments. We salvage the original geometry while fixing the notorious internal corrosion issues.
            </p>
          </section>
        )}

        {/* Performance & Rig Context Section */}
        <section className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#a68c6d] border-b border-gray-100 pb-2">Environmental Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Performance Profile</label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                value={data.performanceType}
                onChange={e => setData({...data, performanceType: e.target.value})}
              >
                {PERFORMANCE_TYPES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Signal Path / Pedals</label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                value={data.pedalType}
                onChange={e => setData({...data, pedalType: e.target.value})}
              >
                {PEDAL_TYPES.filter(p => {
                    if (isRhodes) return p.toLowerCase().includes('rhodes') || p.toLowerCase().includes('none') || p.toLowerCase().includes('ambient');
                    if (isBass) return p.toLowerCase().includes('bass') || p.toLowerCase().includes('none') || p.toLowerCase().includes('digital');
                    return !p.toLowerCase().includes('bass') && !p.toLowerCase().includes('rhodes');
                }).map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Amplifier / Preamp</label>
            <select
              className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
              value={data.ampType}
              onChange={e => setData({...data, ampType: e.target.value})}
            >
              {AMP_TYPES.filter(a => {
                  if (isRhodes) return a.toLowerCase().includes('rhodes') || a.toLowerCase().includes('clean') || a.toLowerCase().includes('digital');
                  if (isBass) return a.toLowerCase().includes('bass') || a.toLowerCase().includes('digital') || a.toLowerCase().includes('solid');
                  return !a.toLowerCase().includes('bass') && !a.toLowerCase().includes('rhodes');
              }).map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        </section>

        {/* Rhodes Specific Intake Section */}
        {isRhodes && (
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#a68c6d] border-b border-gray-100 pb-2">Piano Diagnostics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Production Era</label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                  value={data.pianoYear}
                  onChange={e => setData({...data, pianoYear: e.target.value})}
                >
                  {RHODES_YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Failure Signs</label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                  value={data.rhodesFailureInfo}
                  onChange={e => setData({...data, rhodesFailureInfo: e.target.value})}
                >
                  {RHODES_FAILURE_MODES.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission Scope</label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                value={data.packSize}
                onChange={e => setData({...data, packSize: e.target.value})}
              >
                {RHODES_PACK_SIZES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </section>
        )}

        {/* Step 1: Musical Intent */}
        {!isRhodes && (
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#a68c6d] border-b border-gray-100 pb-2">The Player</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Playing Style / Genres</label>
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-[#4a3f35] focus:border-[#4a3f35]"
                  placeholder={isBass ? "e.g. Funk, Punk, Jazz" : "e.g. Blues, Math Rock, Doom Metal"}
                  value={data.style}
                  onChange={e => setData({...data, style: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dynamics</label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                  value={data.dynamics}
                  onChange={e => setData({...data, dynamics: e.target.value as any})}
                >
                  <option>Light</option>
                  <option>Medium</option>
                  <option>Aggressive</option>
                </select>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sound Goals / Expected Result</label>
          <div className="flex flex-wrap gap-2">
            {TONE_GOALS.map(goal => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  data.toneGoals.includes(goal)
                    ? 'bg-[#4a3f35] text-white border-[#4a3f35]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </section>

        {!isRhodes && (
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#a68c6d] border-b border-gray-100 pb-2">The Chassis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                  value={data.guitarBrand}
                  onChange={e => setData({...data, guitarBrand: e.target.value})}
                >
                  {GUITAR_BRANDS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specific Model</label>
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                  placeholder={isBass ? "e.g. American Pro II Precision" : "e.g. 1962 Reissue Strat"}
                  value={data.guitarModel}
                  onChange={e => setData({...data, guitarModel: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                  value={data.guitarType}
                  onChange={e => setData({...data, guitarType: e.target.value})}
                >
                  {GUITAR_TYPES.filter(t => {
                      if (isRhodes) return t.toLowerCase().includes('rhodes');
                      if (isBass) return t.toLowerCase().includes('bass');
                      return !t.toLowerCase().includes('bass') && !t.toLowerCase().includes('rhodes');
                  }).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Wood</label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                  value={data.bodyWood}
                  onChange={e => setData({...data, bodyWood: e.target.value})}
                >
                  {WOOD_TYPES.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scale Length</label>
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                  value={data.scaleLength}
                  onChange={e => setData({...data, scaleLength: e.target.value})}
                  placeholder={isBass ? 'e.g. 34"' : 'e.g. 25.5"'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Specification (Size/Route)</label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                value={data.currentRouting}
                onChange={e => setData({...data, currentRouting: e.target.value})}
              >
                {PICKUP_ROUTES.filter(r => {
                    const bassKeywords = ['bass', 'p-bass', 'j-bass', 'split-coil', 'mm-style', 'hofner'];
                    const rhodesKeywords = ['rhodes'];
                    const isBassRoute = bassKeywords.some(kw => r.toLowerCase().includes(kw));
                    const isRhodesRoute = rhodesKeywords.some(kw => r.toLowerCase().includes(kw));
                    
                    if (isRhodes) return isRhodesRoute;
                    if (isBass) return isBassRoute;
                    return !isBassRoute && !isRhodesRoute;
                }).map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Workshop Notes</label>
          <textarea
            className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
            rows={3}
            placeholder={isRhodes ? "List specific problematic keys or tonal imbalance..." : "What needs fixing? Lack of low-end clarity? Brittle top end?"}
            value={data.currentIssues}
            onChange={e => setData({...data, currentIssues: e.target.value})}
          />
        </section>

        <button
          onClick={() => onComplete(data)}
          disabled={(!isRhodes && !data.style) || data.toneGoals.length === 0}
          className="w-full bg-[#4a3f35] text-white py-4 rounded-md font-medium hover:bg-[#3d332a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRhodes ? 'Calculate Restoration Specs' : 'Begin Technical Analysis'}
        </button>
      </div>
    </div>
  );
};

export default IntakeForm;
