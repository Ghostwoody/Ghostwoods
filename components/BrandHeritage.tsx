
import React from 'react';
import { BrandHeritage } from '../types';

interface BrandHeritageProps {
  heritage: BrandHeritage;
}

const BrandHeritageDisplay: React.FC<BrandHeritageProps> = ({ heritage }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm mb-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 bg-[#a68c6d] rounded-full animate-pulse"></div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3f35]">Workshop Presence Found</h3>
      </div>
      
      <p className="text-sm text-gray-600 italic leading-relaxed mb-6 border-l-2 border-[#a68c6d] pl-4">
        {heritage.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {heritage.links.map((link, idx) => (
          <a
            key={idx}
            href={link.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100 hover:border-[#a68c6d] transition-colors group"
          >
            <div className="text-[#a68c6d] group-hover:text-[#4a3f35]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-[#4a3f35] truncate">{link.title}</p>
              <p className="text-[9px] text-gray-400 truncate">{new URL(link.uri).hostname}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default BrandHeritageDisplay;
