
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = ['Discovery', 'Engineering', 'Master Plan', 'Fulfillment'];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto px-4">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
            index <= currentStep ? 'bg-[#4a3f35] text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {index + 1}
          </div>
          <span className={`mt-2 text-xs font-medium ${
            index <= currentStep ? 'text-[#4a3f35]' : 'text-gray-400'
          }`}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
