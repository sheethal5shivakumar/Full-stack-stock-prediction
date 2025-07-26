'use client';

import React from 'react';

interface ModelInfoProps {
  symbol: string;
  accuracy: number;
  isTraining: boolean;
  onTrain: () => void;
  onPredict: () => void;
  lookbackDays: number;
  predictDays: number;
}

const ModelInfo: React.FC<ModelInfoProps> = ({
  symbol,
  accuracy,
  isTraining,
  onTrain,
  onPredict,
  lookbackDays,
  predictDays,
}) => {
  // Format accuracy for display
  const formattedAccuracy = accuracy ? `${accuracy.toFixed(2)}%` : 'Not trained';

  // Determine accuracy color and status
  const getAccuracyStatus = () => {
    if (!accuracy) return { color: 'text-gray-400', status: 'Untrained' };
    if (accuracy >= 85) return { color: 'sp-text-positive', status: 'Excellent' };
    if (accuracy >= 70) return { color: 'text-yellow-500', status: 'Good' };
    return { color: 'sp-text-negative', status: 'Poor' };
  };

  const accuracyStatus = getAccuracyStatus();

  return (
    <div className="sp-card p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Neural Network Model</h2>
        {accuracy > 0 && (
          <div className="sp-badge sp-badge-blue">
            {accuracyStatus.status}
          </div>
        )}
      </div>

      {!symbol ? (
        <div className="bg-[#252525] p-4 rounded-md">
          <p className="text-gray-400 text-center">Select a stock to train the model</p>
        </div>
      ) : (
        <>
          <div className="bg-[#252525] p-4 rounded-md mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Selected Stock</div>
                <div className="text-lg font-semibold">{symbol}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Model Accuracy</div>
                <div className={`text-lg font-semibold ${accuracyStatus.color}`}>
                  {formattedAccuracy}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Lookback Period</div>
                <div className="text-base">{lookbackDays} days</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Prediction Horizon</div>
                <div className="text-base">{predictDays} days</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={onTrain}
              disabled={isTraining || !symbol}
              className={`w-full py-2.5 px-4 rounded-md text-white font-medium transition-all ${
                isTraining || !symbol
                  ? 'bg-gray-600 cursor-not-allowed opacity-60'
                  : 'sp-button-primary'
              }`}
            >
              {isTraining ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Training Model...
                </span>
              ) : (
                'Train Model'
              )}
            </button>

            <button
              onClick={onPredict}
              disabled={isTraining || !symbol || accuracy === 0}
              className={`w-full py-2.5 px-4 rounded-md text-white font-medium transition-all ${
                isTraining || !symbol || accuracy === 0
                  ? 'bg-gray-600 cursor-not-allowed opacity-60'
                  : 'sp-button-success'
              }`}
            >
              Generate Predictions
            </button>
          </div>
          
          <div className="bg-[#252525] p-4 rounded-md">
            <h3 className="text-base font-medium mb-3">AI Model Performance</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Training Progress</span>
                  <span>{accuracy ? '100%' : '0%'}</span>
                </div>
                <div className="w-full bg-[#333] rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{ width: accuracy ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Prediction Accuracy</span>
                  <span>{accuracy ? `${accuracy}%` : '0%'}</span>
                </div>
                <div className="w-full bg-[#333] rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      accuracy >= 85 ? 'bg-green-500' : 
                      accuracy >= 70 ? 'bg-yellow-500' : 
                      accuracy > 0 ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                    style={{ width: `${accuracy}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#333]">
              <h4 className="text-sm font-medium mb-2">How It Works</h4>
              <ul className="text-xs text-gray-400 space-y-1.5">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-1.5">•</span>
                  <span>Analyzes {lookbackDays} days of historical price patterns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-1.5">•</span>
                  <span>Predicts stock prices for the next {predictDays} days</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-1.5">•</span>
                  <span>Uses neural network technology to identify patterns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-1.5">•</span>
                  <span>For educational purposes only, not financial advice</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModelInfo; 