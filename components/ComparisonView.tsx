
import React, { useEffect, useState } from 'react';
import { FinalDesign, ComparisonAnalysis } from '../types';
import { getComparisonAnalysis } from '../services/geminiService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface ComparisonViewProps {
  designA: FinalDesign;
  designB: FinalDesign;
  onBack: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ designA, designB, onBack }) => {
  const [analysis, setAnalysis] = useState<ComparisonAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const result = await getComparisonAnalysis(designA, designB);
        setAnalysis(result);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAnalysis();
  }, [designA, designB]);

  const ComparisonRow = ({ label, valA, valB }: { label: string, valA: string, valB: string }) => (
    <div className="grid grid-cols-3 py-4 border-b border-gray-100 items-center">
      <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{label}</div>
      <div className="text-sm font-medium pr-4">{valA}</div>
      <div className="text-sm font-medium pl-4 border-l border-gray-200">{valB}</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-serif">Pickup Comparison</h2>
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#4a3f35] flex items-center gap-1">Back</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-50 p-6 items-center">
          <div></div>
          <div className="text-center font-serif text-[#4a3f35] px-2">Design A</div>
          <div className="text-center font-serif text-[#4a3f35] px-2">Design B</div>
        </div>
        <div className="p-6">
          <ComparisonRow label="Type" valA={designA.pickup.type} valB={designB.pickup.type} />
          <ComparisonRow label="Magnet" valA={designA.pickup.magnetType} valB={designB.pickup.magnetType} />
          <ComparisonRow label="Wind Style" valA={designA.pickup.windStyle} valB={designB.pickup.windStyle} />
          <ComparisonRow label="Resistance" valA={designA.pickup.dcResistance} valB={designB.pickup.dcResistance} />
        </div>
        {loading ? <div className="p-12 text-center bg-gray-50 italic text-gray-400">Comparing designs...</div> : analysis && (
          <div className="bg-[#fcfaf8] p-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-12">
            <section><h4 className="text-xs font-bold uppercase tracking-widest text-[#a68c6d] mb-2">Tonal Variance</h4><p className="text-sm text-gray-700">{analysis.tonalDifference}</p></section>
            <section><h4 className="text-xs font-bold uppercase tracking-widest text-[#4a3f35] mb-2">Recommendation</h4><p className="text-sm italic text-gray-600">{analysis.recommendation}</p></section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonView;
