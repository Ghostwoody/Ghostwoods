
import React, { useState, useEffect } from 'react';
import { IntakeData, PickupSpec, FinalDesign, BrandHeritage, GroundingLink } from './types';
import IntakeForm from './components/IntakeForm';
import DesignEngine from './components/DesignEngine';
import Summary from './components/Summary';
import StepIndicator from './components/StepIndicator';
import SavedDesigns from './components/SavedDesigns';
import ComparisonView from './components/ComparisonView';
import Checkout from './components/Checkout';
import BrandHeritageDisplay from './components/BrandHeritage';
import WorkshopManifest from './components/WorkshopManifest';
import CatalogView from './components/CatalogView';
import PickupDemos from './components/PickupDemos';
import { fetchBrandHeritage, fetchPickupDemos } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [view, setView] = useState<'wizard' | 'history' | 'comparison' | 'manifest' | 'catalog' | 'gallery'>('wizard');
  const [intake, setIntake] = useState<IntakeData | null>(null);
  const [pickup, setPickup] = useState<PickupSpec | null>(null);
  const [currentDesign, setCurrentDesign] = useState<FinalDesign | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<FinalDesign[]>([]);
  const [compPair, setCompPair] = useState<[FinalDesign, FinalDesign] | null>(null);
  const [heritage, setHeritage] = useState<BrandHeritage | null>(null);
  const [demos, setDemos] = useState<GroundingLink[]>([]);
  const [demosLoading, setDemosLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ghostwood_designs');
    if (stored) setSavedDesigns(JSON.parse(stored));

    const loadHeritage = async () => {
      try {
        const data = await fetchBrandHeritage();
        setHeritage(data);
      } catch (e) {
        console.error("Grounding search failed", e);
      }
    };

    const loadDemos = async () => {
      setDemosLoading(true);
      try {
        const demoData = await fetchPickupDemos();
        setDemos(demoData);
      } catch (e) {
        console.error("Demo search failed", e);
      } finally {
        setDemosLoading(false);
      }
    };

    loadHeritage();
    loadDemos();
  }, []);

  const handleIntakeComplete = (data: IntakeData) => {
    setIntake(data);
    setStep(1);
  };

  const handlePickupConfirm = (spec: PickupSpec) => {
    setPickup(spec);
    if (intake) {
      const design: FinalDesign = {
        id: `GW-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: Date.now(),
        intake: intake,
        pickup: spec
      };
      setCurrentDesign(design);
    }
    setStep(2);
  };

  const saveDesign = (design: FinalDesign) => {
    const updated = [design, ...savedDesigns.filter(d => d.id !== design.id)].slice(0, 10);
    setSavedDesigns(updated);
    localStorage.setItem('ghostwood_designs', JSON.stringify(updated));
  };

  const handleReset = () => {
    setView('wizard');
    setStep(0);
    setIntake(null);
    setPickup(null);
    setCurrentDesign(null);
  };

  const handleCompare = (id1: string, id2: string) => {
    const d1 = savedDesigns.find(d => d.id === id1);
    const d2 = savedDesigns.find(d => d.id === id2);
    if (d1 && d2) {
      setCompPair([d1, d2]);
      setView('comparison');
    }
  };

  const renderStep = () => {
    if (view === 'history') {
      return (
        <SavedDesigns 
          designs={savedDesigns} 
          onCompare={handleCompare} 
          onSelectDesign={(d) => {
            setIntake(d.intake);
            setPickup(d.pickup);
            setCurrentDesign(d);
            setStep(2);
            setView('wizard');
          }}
        />
      );
    }

    if (view === 'comparison' && compPair) {
      return <ComparisonView designA={compPair[0]} designB={compPair[1]} onBack={() => setView('history')} />;
    }

    if (view === 'manifest') {
      return <WorkshopManifest persona={heritage?.persona} />;
    }

    if (view === 'catalog') {
      return <CatalogView />;
    }

    if (view === 'gallery') {
      return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-24">
          <div className="text-center py-8">
            <h2 className="text-4xl font-serif mb-2">Sonic Gallery</h2>
            <p className="text-gray-500 italic max-w-xl mx-auto">Explore the character of Ghostwood builds through live workshop demonstrations and recordings.</p>
          </div>
          <PickupDemos demos={demos} isLoading={demosLoading} />
        </div>
      );
    }

    switch (step) {
      case 0: return (
        <div className="space-y-8">
          {heritage && <BrandHeritageDisplay heritage={heritage} />}
          <PickupDemos demos={demos} isLoading={demosLoading} />
          <IntakeForm onComplete={handleIntakeComplete} persona={heritage?.persona} />
        </div>
      );
      case 1: return intake ? <DesignEngine intake={intake} onConfirm={handlePickupConfirm} onBack={() => setStep(0)} persona={heritage?.persona} brandSummary={heritage?.summary} /> : null;
      case 2:
        return currentDesign ? (
          <Summary 
            design={currentDesign} 
            onReset={handleReset} 
            onSave={saveDesign} 
            onCheckout={() => setStep(3)}
            persona={heritage?.persona}
          />
        ) : null;
      case 3:
        return currentDesign ? (
          <Checkout design={currentDesign} onBack={() => setStep(2)} />
        ) : null;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="py-8 border-b border-gray-200 mb-8 bg-white sticky top-0 z-40 shadow-sm print:hidden">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex flex-col cursor-pointer" onClick={handleReset}>
            <h1 className="text-xl font-serif tracking-[0.2em] uppercase text-[#4a3f35]">Ghostwood</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">Boutique Pickup Studio</p>
          </div>
          <div className="flex gap-4 md:gap-6 items-center">
            <button onClick={() => setView('catalog')} className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${view === 'catalog' ? 'text-[#a68c6d]' : 'text-gray-400 hover:text-[#4a3f35]'}`}>Catalog</button>
            <button onClick={() => setView('manifest')} className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${view === 'manifest' ? 'text-[#a68c6d]' : 'text-gray-400 hover:text-[#4a3f35]'}`}>Manifest</button>
            <button onClick={() => setView('gallery')} className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${view === 'gallery' ? 'text-[#a68c6d]' : 'text-gray-400 hover:text-[#4a3f35]'}`}>Gallery</button>
            <button onClick={() => { setView('history'); setStep(-1); }} className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${view === 'history' ? 'text-[#a68c6d]' : 'text-gray-400 hover:text-[#4a3f35]'}`}>History</button>
            <button onClick={handleReset} className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${view === 'wizard' ? 'text-[#a68c6d]' : 'text-gray-400 hover:text-[#4a3f35]'}`}>Builder</button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 pt-4">
        {view === 'wizard' && step < 4 && step >= 0 && <StepIndicator currentStep={step} />}
        {renderStep()}
      </main>
    </div>
  );
};

export default App;
