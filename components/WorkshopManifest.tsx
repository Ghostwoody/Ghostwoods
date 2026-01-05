
import React from 'react';
import { MAGNET_TYPES, WIRE_GAUGES } from '../constants';
import { PersonaStrings } from '../types';

interface WorkshopManifestProps {
  persona?: PersonaStrings;
}

const pricingTiers = [
  { category: 'Electric Guitar Foundations', types: ['Single Coil (Standard)', 'Jaguar', 'Tele Bridge'], price: 165, unit: 'Single Pickup' },
  { category: 'Bass Guitar Foundations', types: ['P-Bass Split Coil', 'Jazz Bass Set', 'Mustang Bass'], price: 175, unit: 'Single Pickup / Set as Noted' },
  { category: 'Specialized Footprints', types: ['P90 Soapbar', 'Jazzmaster', 'Mini-Humbucker'], price: 175, unit: 'Single Pickup' },
  { category: 'Dual-Coil Architecture', types: ['Standard Humbucker', 'FilterTron', 'Bass Soapbar Dual-Coil'], price: 185, unit: 'Single Pickup' },
  { category: 'Rhodes Services (Rewind/Exchange)', types: ['Coil Restoration', 'Tape Refresh'], price: 'See Volume', unit: 'Per Coil' },
  { category: 'Rhodes Direct Purchase', types: ['Ghostwood Refurbished Coils'], price: 55, unit: 'Single Coil Outright' },
];

const rhodesVolumePricing = [
  { pack: 'Single Unit Rewind', price: '$45.00' },
  { pack: 'Workshop 6-Pack Rewind', price: '$240.00 ($40/ea)' },
  { pack: 'Performance 12-Pack Rewind', price: '$420.00 ($35/ea)' },
  { pack: 'Session 24-Pack Rewind', price: '$720.00 ($30/ea)' },
  { pack: 'Full 73-Key Rewind', price: '$1,825.00 ($25/ea)' },
  { pack: 'Full 88-Key Rewind', price: '$2,112.00 ($24/ea)' },
];

const WorkshopManifest: React.FC<WorkshopManifestProps> = ({ persona }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fadeIn pb-24">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif">{persona?.manifestTitle || 'Workshop Manifest'}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto italic">
          {persona?.manifestSubtitle || 'A transparent guide to the materials, physics, and labor that define a Ghostwood build.'}
        </p>
      </div>

      <section className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#a68c6d] border-b border-gray-100 pb-2">Core Philosophy: Precise Custom Engineering</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Ghostwood’s approach is a departure from industry standard. The data you provide through this studio translates directly into winding geometry and magnetic strength. <span className="text-[#4a3f35] font-semibold">No other builder works this closely or efficiently to distill your specific needs into a custom-wound reality.</span> While the industry relies on artist names and vintage hype, we rely on the direct line between your signal path and our workshop bench. The answers you provide here aren't just "suggestions"—they define exactly what we build to solve your tonal challenges.
        </p>
      </section>

      <div className="bg-[#fcfaf8] border border-[#a68c6d] p-8 rounded-lg">
        <h3 className="text-lg font-serif text-[#4a3f35] mb-2">Rhodes Electric Piano Services</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Rhodes pickups are notorious for "green death"—corrosion often triggered by the breakdown of original tape and adhesive materials over decades. 
          <span className="font-bold"> Ghostwood offers three paths for Rhodes restoration:</span> 
          (1) <span className="italic">Rewind Service</span> for your original coils, (2) <span className="italic">Exchange Service</span> to minimize downtime by trading your dead coils for refurbished stock, and (3) <span className="italic">Outright Purchase</span> for complete replacement units.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {rhodesVolumePricing.map(tier => (
            <div key={tier.pack} className="p-3 bg-white border border-gray-100 rounded">
              <p className="text-[10px] font-bold text-gray-400 uppercase">{tier.pack}</p>
              <p className="text-sm font-serif text-[#a68c6d]">{tier.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Part Combinations Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#a68c6d] border-b border-gray-200 pb-2">The Magnetic Palette</h3>
          <div className="space-y-4">
            {MAGNET_TYPES.map(m => (
              <div key={m}>
                <h4 className="text-sm font-bold text-[#4a3f35]">{m}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {m.includes('Alnico 2') && "Soft, warm, and highly musical. Ideal for low-output vintage designs with 'bloom'."}
                  {m.includes('Alnico 3') && "Lowest magnetic pull. Exceptional clarity and string separation. Great for Strat neck positions."}
                  {m.includes('Alnico 4') && "The 'honest' magnet. Flat frequency response, letting the guitar's natural voice speak."}
                  {m.includes('Alnico 5') && "The industry standard. Bold, punchy lows and clear, biting highs. Versatile and energetic."}
                  {m.includes('Alnico 8') && "High output with Alnico character. Aggressive and thick, without the harshness of ceramic."}
                  {m.includes('Ceramic') && "Maximum power and compression. Immediate transient response for high-gain applications."}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#a68c6d] border-b border-gray-200 pb-2">Wire & Tension</h3>
          <div className="space-y-4">
            {WIRE_GAUGES.map(w => (
              <div key={w}>
                <h4 className="text-sm font-bold text-[#4a3f35]">{w}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {w === '42 AWG' && "Standard thickness. Provides traditional clarity and 'air'. Used in most vintage SC and PAF builds."}
                  {w === '43 AWG' && "Thinner wire allows for more turns on a standard bobbin. Higher DCR and compressed mids."}
                  {w === '44 AWG' && "Extremely thin. Reserved for high-output shred or 'doom' pickups where maximum winding is required."}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Pricing Table */}
      <section className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-[#4a3f35] p-6 text-white">
          <h3 className="text-lg font-serif">Pricing Architecture</h3>
          <p className="text-xs opacity-75">All prices in USD. Includes custom consultation and hand-winding.</p>
        </div>
        <div className="divide-y divide-gray-100">
          {pricingTiers.map(tier => (
            <div key={tier.category} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-[#4a3f35]">{tier.category}</h4>
                <p className="text-xs text-gray-400">{typeof tier.types === 'string' ? tier.types : tier.types.join(' • ')}</p>
                <p className="text-[10px] text-[#a68c6d] uppercase font-bold mt-1 tracking-wider">{tier.unit}</p>
              </div>
              <div className="text-2xl font-serif text-[#a68c6d]">
                {typeof tier.price === 'number' ? `$${tier.price}.00` : tier.price}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WorkshopManifest;
