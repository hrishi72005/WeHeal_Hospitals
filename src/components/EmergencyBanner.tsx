import React from 'react';
import { Phone, Clock, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';

interface EmergencyBannerProps {
  onOpenEmergencyModal: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onOpenEmergencyModal }) => {
  return (
    <div className="bg-slate-900 text-slate-100 text-xs sm:text-sm py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Emergency Info */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          <button
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium px-3 py-1 rounded-full transition-colors cursor-pointer animate-pulse"
          >
            <AlertCircle className="w-4 h-4" />
            <span>24/7 Emergency Helpline: <strong className="ml-1 tracking-wide">1-800-911-HEAL</strong></span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>OPD Hours: Mon - Sat: 8:00 AM - 8:00 PM</span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>Main Campus: Medical City, East Tower</span>
          </div>
        </div>

        {/* Accreditations & Fast Actions */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>JCI Accredited & NABH Certified</span>
          </div>
          <a
            href="tel:18009114325"
            className="text-teal-400 hover:text-teal-300 underline font-medium flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Ambulance Direct</span>
          </a>
        </div>
      </div>
    </div>
  );
};
