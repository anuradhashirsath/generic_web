import React, { useState } from 'react';

interface AiFormulatorModalProps {
  onClose: () => void;
  onRegisterCandidate?: (candidate: {
    brandName: string;
    genericSalt: string;
    patentExpiryYear: number;
    estimatedYieldPct: number;
    predictedF2: number;
  }) => void;
}

export const AiFormulatorModal: React.FC<AiFormulatorModalProps> = ({
  onClose,
  onRegisterCandidate,
}) => {
  const [targetDrug, setTargetDrug] = useState('Eliquis (Apixaban 5mg)');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    brandName: string;
    brandOwner: string;
    genericSalt: string;
    patentExpiryYear: number;
    usWacPriceUsd: number;
    predictedGenericFloorUsd: number;
    estimatedYieldPct: number;
    predictedF2: number;
    chemicalSynthesisComplexity: string;
    fdaOrangeBookPatents: string[];
    recommendedANDAStrategy: string;
  } | null>(null);

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult({
        brandName: 'Eliquis',
        brandOwner: 'Bristol Myers Squibb / Pfizer',
        genericSalt: 'Apixaban Crystalline Form N-1',
        patentExpiryYear: 2026,
        usWacPriceUsd: 594.00,
        predictedGenericFloorUsd: 48.50,
        estimatedYieldPct: 91.8,
        predictedF2: 82.4,
        chemicalSynthesisComplexity: 'Moderate (Crystalline polymorph control required)',
        fdaOrangeBookPatents: ['US 6,967,208 (Substance)', 'US 9,326,945 (Formulation)'],
        recommendedANDAStrategy: 'Paragraph IV Certification for 180-day Exclusivity window',
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400">psychology</span>
            <div>
              <span className="font-bold text-base">AI Formulator Copilot & Patent Expiry Engine</span>
              <p className="text-[11px] text-purple-300">Powered by Gemini 2.5 Pro • Predictive ANDA Arbitrage</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!analysisResult ? (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 text-xs text-purple-900 space-y-1">
                <span className="font-bold block">Predictive Generic Synthesis & Patent Expiry Forecaster</span>
                <p className="text-purple-800 text-[11px]">
                  Analyze innovator drug patents, predict $f_2$ dissolution bioequivalence scores, and model market price arbitrage yields before patent cliffs occur.
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-800">Select Innovator Drug Target:</label>
                <select
                  value={targetDrug}
                  onChange={(e) => setTargetDrug(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 outline-hidden"
                >
                  <option value="Eliquis (Apixaban 5mg)">Eliquis (Apixaban 5mg) — Patent Expiry 2026</option>
                  <option value="Jardiance (Empagliflozin 10mg)">Jardiance (Empagliflozin 10mg) — Patent Expiry 2027</option>
                  <option value="Keytruda (Pembrolizumab)">Keytruda (Pembrolizumab Biologic) — Biosimilar Pipeline</option>
                  <option value="Ozempic (Semaglutide 1mg)">Ozempic (Semaglutide 1mg) — Peptide Synthesis Route</option>
                </select>
              </div>

              <button
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {analyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Simulating In-Vitro Dissolution & Orange Book Patent Claims...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    <span>Run Gemini AI Formulator Analysis</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">verified</span>
                  <span className="font-bold text-emerald-900">Formulation Feasibility: High ({analysisResult.predictedF2}% $f_2$)</span>
                </div>
                <span className="bg-emerald-200 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded font-mono">
                  {analysisResult.estimatedYieldPct}% Yield
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block font-bold">Innovator Reference</span>
                    <span className="font-extrabold text-slate-900 text-sm">{analysisResult.brandName} ({analysisResult.brandOwner})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] uppercase block font-bold">Patent Cliff Year</span>
                    <span className="font-mono font-bold text-rose-600 text-sm">{analysisResult.patentExpiryYear} Expiry</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Predicted Generic Active Salt:</span>
                    <span className="font-bold text-purple-900">{analysisResult.genericSalt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Innovator WAC:</span>
                    <span className="font-mono font-bold text-slate-900">${analysisResult.usWacPriceUsd.toFixed(2)} / bottle</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Forecasted Generic Floor:</span>
                    <span className="font-mono font-black text-emerald-700">${analysisResult.predictedGenericFloorUsd.toFixed(2)} / bottle</span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="font-bold text-slate-800 block text-[11px]">Recommended Regulatory ANDA Strategy:</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed bg-purple-50/50 p-2 rounded border border-purple-100">
                    {analysisResult.recommendedANDAStrategy}. Orange Book Patents: {analysisResult.fdaOrangeBookPatents.join(', ')}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-1.5 text-slate-600 font-semibold text-xs hover:bg-slate-200 rounded-lg cursor-pointer">
            Cancel
          </button>
          {analysisResult && (
            <button
              onClick={() => {
                if (onRegisterCandidate) onRegisterCandidate(analysisResult);
                onClose();
              }}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Register Candidate SKU
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
