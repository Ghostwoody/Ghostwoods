
import React from 'react';
import { GroundingLink } from '../types';

interface PickupDemosProps {
  demos: GroundingLink[];
  isLoading?: boolean;
}

const PickupDemos: React.FC<PickupDemosProps> = ({ demos, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg p-12 shadow-sm mb-8 animate-pulse text-center">
        <div className="w-8 h-8 bg-red-100 rounded-full mx-auto mb-4 animate-bounce"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Searching workshop recordings (@catfishbisque)...</p>
      </div>
    );
  }

  if (demos.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg p-12 shadow-sm mb-8 text-center">
        <p className="text-gray-400 italic text-sm">No recent workshop recordings found. Check the channel directly for live updates.</p>
        <a 
          href="https://www.youtube.com/@catfishbisque" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-red-600 hover:underline"
        >
          Visit Channel @catfishbisque →
        </a>
      </div>
    );
  }

  const isFeatured = (title: string) => {
    const keywords = ['pickup', 'demo', 'test', 'comparison', 'review', 'winding', 'tone'];
    return keywords.some(k => title.toLowerCase().includes(k));
  };

  const isShort = (uri: string) => {
    return uri.toLowerCase().includes('/shorts/');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm mb-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3f35]">Workshop Recordings (@catfishbisque)</h3>
        </div>
        <div className="flex gap-4">
          <a 
            href="https://www.youtube.com/@catfishbisque/shorts" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] font-bold uppercase tracking-tighter text-gray-400 hover:text-red-600 transition-colors"
          >
            Shorts ↗
          </a>
          <a 
            href="https://www.youtube.com/@catfishbisque" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] font-bold uppercase tracking-tighter text-gray-400 hover:text-red-600 transition-colors"
          >
            Videos ↗
          </a>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demos.map((demo, idx) => {
          const featured = isFeatured(demo.title);
          const short = isShort(demo.uri);
          return (
            <a
              key={idx}
              href={demo.uri}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col p-4 bg-gray-50 rounded border transition-all group relative overflow-hidden ${
                featured ? 'border-red-100' : 'border-gray-100'
              } hover:border-red-400`}
            >
              {featured && (
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-tighter rounded-bl">
                  Featured Demo
                </div>
              )}

              {short && !featured && (
                <div className="absolute top-0 right-0 bg-gray-800 text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-tighter rounded-bl">
                  Short
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-2">
                <div className="text-red-600 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-red-600">
                  {short ? 'YouTube Short' : 'Video Demo'}
                </span>
              </div>
              
              <h4 className="text-sm font-serif text-[#4a3f35] mb-2 leading-tight group-hover:underline line-clamp-2">
                {demo.title}
              </h4>
              
              <div className="mt-auto pt-3 flex justify-between items-center text-[9px] text-gray-400 font-mono">
                <span>{short ? 'SHORTS' : 'YOUTUBE.COM'}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity font-bold text-red-600 uppercase tracking-tighter">Listen Now →</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default PickupDemos;
