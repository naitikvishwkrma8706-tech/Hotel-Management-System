import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Globe, 
  Building, 
  Smartphone,
  Search,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { validatePhoneNumber } from '../utils/helpers';

export const PhoneVerification: React.FC = () => {
  const { guests } = useHotel();
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 234-8901');
  const [verificationResult, setVerificationResult] = useState<any>(() => validatePhoneNumber('+1 (555) 234-8901'));
  const [loading, setLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = validatePhoneNumber(phoneNumber);
      setVerificationResult(res);
      setLoading(false);
    }, 400);
  };

  const sampleNumbers = [
    { label: 'USA Mobile (Arthur Pendelton)', num: '+1 (555) 234-8901' },
    { label: 'UK London (Elena Rostova)', num: '+44 20 7946 0912' },
    { label: 'India Mumbai (Vikram Malhotra)', num: '+91 98200 12345' },
    { label: 'UAE Dubai (Ambassador Tariq)', num: '+971 4 312 9000' },
    { label: 'Spain Madrid (Carlos Santana)', num: '+34 91 123 4567' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
              Guest Phone Verification Tool
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Web Port: phonenumber.py
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Validates caller identity, international formatting, telecom carrier, and geographic circle
          </p>
        </div>
      </div>

      {/* Main Verification Card */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        
        {/* Input Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Enter Guest Phone Number (with Country Code):
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <span>Validating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Number</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Click Sample Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Quick Fill with In-House Guest Numbers:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleNumbers.map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  setPhoneNumber(s.num);
                  setVerificationResult(validatePhoneNumber(s.num));
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Result Display */}
        {verificationResult && (
          <div className="mt-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${verificationResult.valid ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-100 text-rose-600'}`}>
                  {verificationResult.valid ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {verificationResult.valid ? 'Active & Validated Telecom Number' : 'Invalid Number Format'}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    {verificationResult.international_format}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                verificationResult.valid 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {verificationResult.valid ? 'STATUS: VALID' : 'STATUS: INVALID'}
              </span>
            </div>

            {/* Grid of Extracted Attributes (Matching output from phonenumber.py) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[10px] uppercase">Country</span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {verificationResult.country_name}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Radio className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[10px] uppercase">Location / Telecom Circle</span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {verificationResult.location}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Building className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[10px] uppercase">Authorized Carrier</span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {verificationResult.carrier}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[10px] uppercase">Line Type</span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                  {verificationResult.line_type} Line
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Verification standard: E.164 International Format</span>
              <span>API Gateway: Numverify / Apilayer protocol</span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
