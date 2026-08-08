import React from 'react';
import { Department, Doctor } from '../types';
import { X, Calendar, MapPin, Phone, Users, CheckCircle2, ChevronRight, Star, Clock } from 'lucide-react';

interface DepartmentModalProps {
  department: Department | null;
  doctors: Doctor[];
  onClose: () => void;
  onBookAppointment: (doctorId?: string, departmentId?: string) => void;
  onViewDoctorProfile: (doctor: Doctor) => void;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  department,
  doctors,
  onClose,
  onBookAppointment,
  onViewDoctorProfile,
}) => {
  if (!department) return null;

  const departmentDoctors = doctors.filter((doc) => doc.departmentId === department.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Image */}
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <img
            src={department.heroImage}
            alt={department.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-500/30 text-teal-300 border border-teal-400/30 mb-2 inline-block">
              {department.category}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              {department.name}
            </h2>
            <p className="text-sm text-teal-100 font-medium mt-1">
              {department.tagline}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Location</span>
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                {department.location}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Department Helpline</span>
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                {department.phone}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Expert Doctors</span>
              <span className="text-sm font-semibold text-teal-700 flex items-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                {departmentDoctors.length} Specialists
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Avg OPD Wait</span>
              <span className="text-sm font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                {department.avgWaitTimeMinutes} mins
              </span>
            </div>
          </div>

          {/* Detailed Overview */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
              About the Department
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {department.longDescription}
            </p>
          </div>

          {/* Key Services & Conditions Treated */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-teal-50/50 p-5 rounded-2xl border border-teal-100/80">
              <h4 className="text-sm font-bold text-teal-900 uppercase tracking-wider mb-3">
                Key Clinical Procedures & Services
              </h4>
              <ul className="space-y-2">
                {department.keyServices.map((service, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Conditions Treated
              </h4>
              <div className="flex flex-wrap gap-2">
                {department.conditionsTreated.map((cond, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200 text-xs font-medium"
                  >
                    {cond}
                  </span>
                ))}
              </div>

              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mt-5 mb-2">
                Advanced Equipment
              </h4>
              <ul className="space-y-1 text-xs text-slate-600">
                {department.techEquipments.map((tech, idx) => (
                  <li key={idx}>• {tech}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Department Doctors Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Specialists in {department.name} ({departmentDoctors.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departmentDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-500/50 hover:shadow-md transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-100"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {doc.specialty}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-medium mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{doc.rating} ({doc.reviewCount})</span>
                        <span className="text-slate-400 font-normal">• ${doc.consultationFee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => onViewDoctorProfile(doc)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onBookAppointment(doc.id, department.id);
                      }}
                      className="text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Direct department inquiries: {department.phone}
          </span>
          <button
            onClick={() => {
              onClose();
              onBookAppointment(undefined, department.id);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment in {department.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
