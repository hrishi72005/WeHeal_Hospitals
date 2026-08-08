import React, { useState } from 'react';
import { X, AlertTriangle, PhoneCall, Ambulance, ShieldAlert, CheckCircle2, MapPin } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [patientLocation, setPatientLocation] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [dispatched, setDispatched] = useState(false);

  if (!isOpen) return null;

  const handleAmbulanceDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientPhone) return;
    setDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-rose-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="bg-rose-600 text-white p-6 relative">
          <button
            onClick={() => {
              setDispatched(false);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-rose-700/60 hover:bg-rose-700 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                24/7 Level-1 Emergency & Trauma
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                WeHeal Emergency Response Services
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Direct Phone Call Box */}
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-rose-800 tracking-wide block">
                Immediate Hotline Call
              </span>
              <p className="text-lg font-extrabold text-rose-900">
                1-800-911-HEAL
              </p>
            </div>
            <a
              href="tel:18009114325"
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Dispatch Ambulance Form */}
          {!dispatched ? (
            <form onSubmit={handleAmbulanceDispatch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ambulance Pickup Address / Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter current location address..."
                    value={patientLocation}
                    onChange={(e) => setPatientLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors cursor-pointer text-sm"
              >
                <Ambulance className="w-5 h-5 text-rose-500" />
                <span>Request Urgent Mobile ICU Ambulance</span>
              </button>
            </form>
          ) : (
            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900">
                Ambulance Dispatch Initiated!
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Our Mobile ICU unit has been notified for pickup at <strong>{patientLocation || 'your location'}</strong>. Emergency Dispatcher will call <strong>{patientPhone}</strong> in under 60 seconds.
              </p>
              <button
                onClick={() => {
                  setDispatched(false);
                  onClose();
                }}
                className="text-xs font-semibold text-emerald-900 underline pt-2"
              >
                Close Window
              </button>
            </div>
          )}

          {/* Guidance */}
          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">What to do while waiting:</p>
            <p>1. Stay calm and clear a pathway for emergency paramedics.</p>
            <p>2. Keep patient still and comfortable in a well-ventilated space.</p>
            <p>3. Do not offer food or water if surgery might be required.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
