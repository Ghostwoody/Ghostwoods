
import React, { useState } from 'react';
import { FinalDesign } from '../types';

interface CheckoutProps {
  design: FinalDesign;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ design, onBack }) => {
  const [method, setMethod] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  const paymentMethods = [
    { id: 'paypal', name: 'PayPal', icon: 'P', color: '#003087', description: 'Safe & secure worldwide' },
    { id: 'cashapp', name: 'CashApp', icon: '$', color: '#00d632', description: 'Fast mobile payment' },
    { id: 'venmo', name: 'Venmo', icon: 'V', color: '#3d95ce', description: 'Direct from your balance' },
    { id: 'card', name: 'Credit Card', icon: 'C', color: '#4a3f35', description: 'Visa, MC, Amex' },
    { id: 'apple', name: 'Apple Pay', icon: '', color: '#000000', description: 'Fast, secure checkout' },
  ];

  if (complete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-fadeIn space-y-6">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-serif">Commission Logged.</h2>
        <p className="text-gray-600 leading-relaxed">
          Project <span className="font-bold text-[#4a3f35]">{design.id}</span> is now active in the Ghostwood workshop. 
          Check your email for your formal receipt and build-queue tracking.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-[#4a3f35] text-white rounded font-medium mt-8 hover:bg-[#3d332a] transition-all"
        >
          Return to Workshop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn pb-20">
      {/* Left Column: Payment Selection */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-serif text-[#4a3f35]">Finalize Commission</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Select Fulfillment Path</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setMethod(pm.id)}
                  className={`flex items-center p-4 border rounded-lg transition-all text-left ${
                    method === pm.id 
                      ? 'border-[#4a3f35] bg-[#fcfaf8] ring-1 ring-[#4a3f35]' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded flex items-center justify-center text-white font-bold mr-4 shrink-0"
                    style={{ backgroundColor: pm.color }}
                  >
                    {pm.icon}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm text-[#4a3f35] truncate">{pm.name}</h4>
                    <p className="text-[10px] text-gray-500 truncate">{pm.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {method && (
              <div className="mt-8 p-6 bg-[#fcfaf8] rounded border border-[#e2e2da] animate-fadeIn space-y-4">
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#a68c6d] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-gray-600">
                    Your payment through <span className="font-bold">{paymentMethods.find(p => p.id === method)?.name}</span> will initiate the procurement of materials for project <span className="font-mono">{design.id}</span>.
                  </p>
                </div>
                <button 
                  onClick={() => setComplete(true)}
                  className="w-full bg-[#4a3f35] text-white py-4 rounded font-medium hover:bg-[#3d332a] transition-all shadow-md"
                >
                  Confirm Commission & Pay $185.00
                </button>
              </div>
            )}

            <div className="flex justify-center">
              <button onClick={onBack} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 uppercase font-bold tracking-widest transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Modify Build Sheet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-32">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#a68c6d] border-b border-gray-100 pb-3 mb-4">Build Summary</h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase text-gray-400 font-bold">Pickup Type</p>
              <p className="text-sm font-serif text-[#4a3f35]">{design.pickup.type}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold">Magnet</p>
                <p className="text-xs text-gray-600">{design.pickup.magnetType}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold">Wind</p>
                <p className="text-xs text-gray-600">{design.pickup.windStyle}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-400 font-bold">Application</p>
              <p className="text-xs text-gray-600 italic">"{design.intake.style} focus"</p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">Subtotal</span>
              <span className="text-lg font-serif text-[#4a3f35]">$185.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">Shipping</span>
              <span className="text-xs font-medium text-green-600">Free (USA)</span>
            </div>
            <div className="pt-2 flex justify-between items-center border-t-2 border-[#fcfaf8]">
              <span className="text-sm font-bold text-[#4a3f35]">Total Due</span>
              <span className="text-xl font-serif text-[#a68c6d]">$185.00</span>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 text-center px-4 leading-relaxed">
          Ghostwood pickups are hand-wound to order. By confirming, you acknowledge the current 3-week lead time for custom commissions.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
