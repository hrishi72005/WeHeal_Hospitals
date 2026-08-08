import React from 'react';
import { Doctor } from '../types';
import { X, Star, Calendar, MapPin, Award, Clock, Phone, Mail, GraduationCap, CheckCircle2 } from 'lucide-react';

interface DoctorModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookAppointment: (doctorId: string, deptId: string) => void;
}

export const DoctorModal: React.FC<DoctorModalProps> = ({
  doctor,
  onClose,
  onBookAppointment,
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-6 sm:p-8 flex items-start gap-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-teal-400/30 shadow-lg shrink-0"
          />

          <div className="flex-1 pr-8">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                {doctor.departmentName}
              </span>
              {doctor.isHeadOfDepartment && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Department Head
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
              {doctor.name}
            </h2>
            <p className="text-sm text-teal-200 font-medium mb-3">
              {doctor.title} • {doctor.specialty}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{doctor.rating}</span>
                <span className="text-slate-400 font-normal">({doctor.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-teal-400" />
                <span>{doctor.experienceYears} Years Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Consultation Fee</span>
              <span className="text-lg font-bold text-slate-900">${doctor.consultationFee}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">OPD Room</span>
              <span className="text-sm font-semibold text-slate-800">{doctor.roomNo}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Languages</span>
              <span className="text-sm font-medium text-slate-700">{doctor.languages.join(', ')}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Qualifications</span>
              <span className="text-sm font-semibold text-teal-700">{doctor.qualification}</span>
            </div>
          </div>

          {/* Biography */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
              Biography & Background
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Education & Credentials */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>Education & Fellowships</span>
            </h3>
            <ul className="space-y-2">
              {doctor.education.map((edu, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours / Slots */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Available Schedule & Consultation Slots</span>
            </h3>

            <div className="flex flex-wrap gap-2 mb-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
                const isAvail = doctor.availableDays.includes(day);
                return (
                  <span
                    key={day}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      isAvail
                        ? 'bg-teal-100 text-teal-800 border border-teal-200'
                        : 'bg-slate-100 text-slate-400 line-through opacity-60'
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              {doctor.availableSlots.map((slot, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>Consultation at OPD {doctor.roomNo}, WeHeal Main Campus</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookAppointment(doctor.id, doctor.departmentId);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment with {doctor.name.split(' ')[1] || doctor.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
