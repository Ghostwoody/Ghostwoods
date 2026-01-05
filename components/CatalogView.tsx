
import React from 'react';
import { PICKUP_ROUTES } from '../constants';

const catalogItems = [
  {
    category: 'Guitar Foundations',
    price: '$165.00',
    unit: 'Per Pickup',
    description: 'Traditional hand-wound designs for electric guitar focusing on clarity, dynamics, and harmonic richness.',
    items: ['Strat-style Sets', 'Tele Bridge & Neck', 'Jaguar Claw-style', 'Mustang-style']
  },
  {
    category: 'Bass Foundations',
    price: '$175.00',
    unit: 'Per Pickup / Set',
    description: 'Specialized builds for electric bass. Tuned for fundamental power, definition, and low-end clarity.',
    items: ['P-Bass Split Coil (Set)', 'Jazz Bass Set (Matched Pairs)', 'Short Scale (Mustang/Hofner)', 'Classic Mudbucker Retones']
  },
  {
    category: 'Rhodes Restoration & Purchase',
    price: '$24-55',
    unit: 'Service / Outright',
    description: 'Complete lifecycle support for Fender Rhodes pickups. Choose from local rewind service, immediate exchange, or outright purchase of refurbished units.',
    items: ['Coil Rewind (Send Yours)', 'Stock Exchange (Core Required)', 'Outright Purchase (No Core)', 'Preventative White Tape Service']
  },
  {
    category: 'Specialized Footprints',
    price: '$175.00',
    unit: 'Per Pickup',
    description: 'Custom geometry requiring specialized bobbin construction and magnetic orientation.',
    items: ['P90 Soapbar / Dogear', 'Jazzmaster Lead & Rhythm', 'Mini-Humbucker (LP Deluxe)', 'Firebird-style (Blade)']
  },
  {
    category: 'Dual-Coil & Soapbars',
    price: '$185.00',
    unit: 'Per Pickup',
    description: 'Noise-canceling designs for both guitar and bass. High-output soapbars and vintage-spec humbuckers.',
    items: ['Standard Humbucker (PAF)', 'MM-Style Bass Humbucker', 'Bass Soapbar (Dual Coil)', 'Stacked Noise-Free Single Coils']
  }
];

const CatalogView: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fadeIn">
      {/* Catalog controls - hidden during print */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <h2 className="text-2xl font-serif">Workshop Catalog</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Print-ready document</p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-[#4a3f35] text-white rounded font-medium hover:bg-[#3d332a] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      {/* The actual "PDF" document */}
      <div className="bg-white border border-gray-200 shadow-2xl p-12 md:p-16 print:shadow-none print:border-none print:m-0 print:p-0 min-h-[11in]">
        <header className="text-center mb-16 border-b-2 border-gray-900 pb-8">
          <h1 className="text-5xl font-serif tracking-[0.25em] uppercase text-[#4a3f35] mb-2">Ghostwood</h1>
          <p className="text-sm uppercase tracking-[0.4em] text-gray-400">Custom Pickup Studio • Build Catalog 2024</p>
        </header>

        <div className="space-y-12">
          {catalogItems.map((cat, idx) => (
            <section key={idx} className="space-y-4">
              <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                <div>
                  <h3 className="text-xl font-serif text-[#4a3f35] inline-block mr-2">{cat.category}</h3>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">({cat.unit})</span>
                </div>
                <span className="text-lg font-serif text-[#a68c6d]">{cat.price}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl italic">
                {cat.description}
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 pt-2">
                {cat.items.map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs font-medium text-gray-800">
                    <div className="w-1 h-1 bg-[#a68c6d] rounded-full"></div>
                    {item}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-20 pt-12 border-t border-gray-200">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Custom Engineering Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] leading-relaxed text-gray-500">
            <div>
              <p className="font-bold text-[#4a3f35] uppercase mb-1">Magnetic Tuning</p>
              <p>We offer custom charging of Alnico grades (2-8) and specialized Ceramic combinations to match your specific instrument's resonance.</p>
            </div>
            <div>
              <p className="font-bold text-[#4a3f35] uppercase mb-1">Rhodes Exchange Program</p>
              <p>Full keyboard restorations (73/88) receive a workshop priority discount. Our exchange program ensures your piano is back in service within days, not weeks.</p>
            </div>
          </div>
        </section>

        <footer className="mt-24 pt-8 border-t border-gray-900 text-center space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#4a3f35]">Ghostwood Musical Instrument Pickups</p>
          <p className="text-[9px] text-gray-400">Hand-wound in limited batches. Individual consultation included with every commission.</p>
          <p className="text-[9px] text-gray-400 font-mono mt-4">WWW.GHOSTWOODPICKUPS.COM</p>
        </footer>
      </div>
    </div>
  );
};

export default CatalogView;
