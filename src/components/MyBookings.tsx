import React, { useState } from 'react';
import { Page, Appointment } from '../types';
import { FirebaseUser } from '../lib/firebase';
import {
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  Building2,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Download,
  ShieldCheck,
  LogIn,
} from 'lucide-react';

interface MyBookingsProps {
  onNavigate: (page: Page) => void;
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  currentUser?: FirebaseUser | null;
  onOpenAuth?: () => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({
  onNavigate,
  appointments,
  onCancelAppointment,
  currentUser,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPass, setSelectedPass] = useState<Appointment | null>(null);
  const [filterMyAccountOnly, setFilterMyAccountOnly] = useState<boolean>(false);

  const displayedAppointments = appointments.filter((apt) => {
    if (filterMyAccountOnly && currentUser) {
      if (apt.userId && apt.userId !== currentUser.uid) return false;
      if (!apt.userId && currentUser.email && apt.patientEmail !== currentUser.email) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      apt.bookingReference.toLowerCase().includes(q) ||
      apt.patientPhone.includes(q) ||
      apt.patientName.toLowerCase().includes(q) ||
      apt.doctorName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 space-y-10">
      
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
                Patient Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                My Appointments & OPD Passes
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                View upcoming doctor visits, download passes, or cancel bookings.
              </p>
            </div>

            <button
              onClick={() => onNavigate('booking')}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book New OPD</span>
            </button>
          </div>

          {/* Patient Auth Status Bar */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            {currentUser ? (
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Signed in as <strong>{currentUser.displayName || currentUser.email || 'Verified Patient'}</strong></span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-xl">
                <LogIn className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Sign in to link and secure all your OPD passes on Firebase</span>
                <button
                  onClick={onOpenAuth}
                  className="font-bold text-teal-700 hover:underline cursor-pointer ml-auto sm:ml-2"
                >
                  Sign In
                </button>
              </div>
            )}

            {currentUser && (
              <button
                onClick={() => setFilterMyAccountOnly(!filterMyAccountOnly)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border ${
                  filterMyAccountOnly
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                {filterMyAccountOnly ? 'Showing My Account Bookings' : 'Show All Hospital OPDs'}
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative pt-2">
            <input
              type="text"
              placeholder="Search by Reference Code (e.g. WH-2026-), Patient Phone, or Doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-5" />
          </div>
        </div>
      </section>

      {/* Bookings List */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        {displayedAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No appointments found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {appointments.length === 0
                ? "You haven't scheduled any consultations yet. Book an appointment with our expert doctors today."
                : "No appointment matched your search query or account filter."}
            </p>

            <button
              onClick={() => onNavigate('booking')}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-teal-400/80 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Doctor & Patient Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={apt.doctorImage}
                    alt={apt.doctorName}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-100"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                        {apt.bookingReference}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {apt.doctorName}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      {apt.departmentName} • Room {apt.roomNo}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <span>Patient: <strong>{apt.patientName}</strong></span>
                      <span>Phone: <strong>{apt.patientPhone}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Date & Action Buttons */}
                <div className="flex flex-col md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-xs font-bold text-slate-900 block">
                      {apt.date}
                    </span>
                    <span className="text-xs font-bold text-amber-600 block">
                      {apt.timeSlot}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPass(apt)}
                      className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Pass</span>
                    </button>

                    {apt.status === 'Confirmed' && (
                      <button
                        onClick={() => {
                          if (confirm(`Cancel appointment ${apt.bookingReference} with ${apt.doctorName}?`)) {
                            onCancelAppointment(apt.id);
                          }
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                        title="Cancel Appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Selected Digital Pass Modal View */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Digital OPD Pass
              </h2>
              <button
                onClick={() => setSelectedPass(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-sm font-bold text-white block">WeHeal Hospitals</span>
                  <span className="text-[10px] text-teal-300">OPD Consultation Pass</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Booking Ref</span>
                  <span className="text-sm font-extrabold tracking-wider text-teal-300">
                    {selectedPass.bookingReference}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-bold block mb-1">Doctor</span>
                  <p className="text-sm font-bold text-white">{selectedPass.doctorName}</p>
                  <p className="text-teal-300">{selectedPass.departmentName}</p>
                  <p className="text-slate-400 mt-1">Room: {selectedPass.roomNo}</p>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-bold block mb-1">Schedule</span>
                  <p className="text-sm font-bold text-white">{selectedPass.date}</p>
                  <p className="text-amber-300 font-semibold">{selectedPass.timeSlot}</p>
                  <p className="text-slate-400 mt-1">Patient: {selectedPass.patientName}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white p-1 rounded-xl text-slate-900 flex items-center justify-center">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <span className="text-[11px] text-slate-400">Scan at reception counter</span>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-teal-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-teal-400 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Pass</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
