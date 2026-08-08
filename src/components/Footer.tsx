import React from 'react';
import { Page } from '../types';
import { HeartPulse, Phone, Mail, MapPin, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { DEPARTMENTS } from '../data/hospitalData';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onSelectDepartment?: (deptId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectDepartment }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-slate-900 font-bold">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">
                  WeHeal <span className="text-teal-400">Hospitals</span>
                </span>
                <span className="text-xs text-slate-400">Precision Medicine • Compassionate Care</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              WeHeal Hospitals is a premier quaternary healthcare network providing patient-centric treatment, cutting-edge robotic surgical technology, and 24/7 level-1 emergency response.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 border border-slate-700/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>JCI International Accredited</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 border border-slate-700/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>NABH Excellence Certified</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  About Us & Leadership
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('departments')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Specialty Departments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Doctor Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('booking')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Book Appointment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-bookings')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Manage Appointments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-teal-400 font-bold hover:underline transition-colors cursor-pointer"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Specialty Departments */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Departments
            </h4>
            <ul className="space-y-2 text-sm">
              {DEPARTMENTS.slice(0, 6).map((dept) => (
                <li key={dept.id}>
                  <button
                    onClick={() => {
                      if (onSelectDepartment) onSelectDepartment(dept.id);
                      else onNavigate('departments');
                    }}
                    className="hover:text-teal-400 transition-colors cursor-pointer flex items-center gap-1 group text-slate-300"
                  >
                    <span>{dept.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Emergency & Support
            </h4>
            <div className="space-y-2 text-sm">
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50">
                <span className="text-xs text-rose-300 uppercase font-semibold tracking-wider block mb-1">
                  24/7 Trauma Hotline
                </span>
                <a
                  href="tel:18009114325"
                  className="text-base font-bold text-rose-200 hover:text-white flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-rose-400" />
                  <span>1-800-911-HEAL</span>
                </a>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-400 pt-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>100 Medical City Blvd, Health District, East Campus, NY 10001</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>contact@weheal.org</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Visiting Hours: 10:00 AM - 7:00 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} WeHeal Hospitals Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Patient Rights & Charter</span>
            <span className="hover:text-slate-400 cursor-pointer">Hospital Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
