import React, { useState, useEffect } from 'react';
import { Page, Appointment, Doctor, Department } from '../types';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import { FirebaseUser } from '../lib/firebase';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Stethoscope,
  Building2,
  AlertCircle,
  FileText,
  Download,
  QrCode,
  ArrowRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

interface BookingProps {
  onNavigate: (page: Page) => void;
  onAppointmentBooked: (newAppointment: Appointment) => void;
  currentUser?: FirebaseUser | null;
  preselectedDeptId?: string;
  preselectedDoctorId?: string;
}

export const Booking: React.FC<BookingProps> = ({
  onNavigate,
  onAppointmentBooked,
  currentUser,
  preselectedDeptId,
  preselectedDoctorId,
}) => {
  const [departmentId, setDepartmentId] = useState<string>(preselectedDeptId || '');
  const [doctorId, setDoctorId] = useState<string>(preselectedDoctorId || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  const [patientName, setPatientName] = useState<string>(currentUser?.displayName || '');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>(currentUser?.email || '');
  const [patientAge, setPatientAge] = useState<number | ''>(32);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [reason, setReason] = useState<string>('');

  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Auto set doctor if department changes
  const availableDoctors = departmentId
    ? DOCTORS.filter((doc) => doc.departmentId === departmentId)
    : DOCTORS;

  const selectedDoctorObj = DOCTORS.find((doc) => doc.id === doctorId);
  const selectedDeptObj = DEPARTMENTS.find((dept) => dept.id === departmentId);

  // Minimum date today
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (preselectedDeptId) setDepartmentId(preselectedDeptId);
    if (preselectedDoctorId) setDoctorId(preselectedDoctorId);
  }, [preselectedDeptId, preselectedDoctorId]);

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!departmentId || !doctorId || !selectedDate || !selectedSlot || !patientName || !patientPhone) {
      alert('Please fill out all required fields including doctor, date, time slot, and patient contact.');
      return;
    }

    const doc = DOCTORS.find((d) => d.id === doctorId);
    const dept = DEPARTMENTS.find((dp) => dp.id === departmentId);

    const refNum = `WH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      userId: currentUser?.uid || '',
      bookingReference: refNum,
      patientName,
      patientPhone,
      patientEmail: patientEmail || 'N/A',
      patientAge: typeof patientAge === 'number' ? patientAge : 30,
      patientGender,
      isFirstVisit,
      departmentId,
      departmentName: dept ? dept.name : 'General Medicine',
      doctorId,
      doctorName: doc ? doc.name : 'Consultant Doctor',
      doctorImage: doc ? doc.image : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      date: selectedDate,
      timeSlot: selectedSlot,
      reason: reason || 'General Consultation & Health Check',
      consultationFee: doc ? doc.consultationFee : 120,
      roomNo: doc ? doc.roomNo : 'OPD 101',
      status: 'Confirmed',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    onAppointmentBooked(newAppointment);
    setConfirmedAppointment(newAppointment);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 space-y-10">
      
      {/* Top Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-8 shadow-xl">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-widest bg-teal-500/20 px-3 py-1 rounded-full border border-teal-400/30">
              Online OPD Reservation
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Book Doctor Consultation
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Schedule your in-person OPD visit with our medical experts in under 2 minutes. Guaranteed instant booking pass with zero reservation fees.
            </p>
          </div>
        </div>
      </section>

      {/* Main Booking Container */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        {!confirmedAppointment ? (
          <form
            onSubmit={handleBookingSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-lg space-y-8"
          >
            {/* Step 1: Doctor & Department */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="w-5 h-5 text-teal-600" />
                <span>1. Select Department & Doctor</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Specialty Department *
                  </label>
                  <select
                    required
                    value={departmentId}
                    onChange={(e) => {
                      setDepartmentId(e.target.value);
                      setDoctorId('');
                    }}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
                  >
                    <option value="">-- Choose Department --</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Select Doctor / Specialist *
                  </label>
                  <select
                    required
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
                  >
                    <option value="">-- Choose Doctor --</option>
                    {availableDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - {doc.title} (${doc.consultationFee})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Doctor Preview Card */}
              {selectedDoctorObj && (
                <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-100 flex items-center gap-4">
                  <img
                    src={selectedDoctorObj.image}
                    alt={selectedDoctorObj.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-teal-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {selectedDoctorObj.name}
                    </h4>
                    <p className="text-xs text-teal-800 font-medium">
                      {selectedDoctorObj.specialty}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      OPD Room: <strong>{selectedDoctorObj.roomNo}</strong> • Consultation Fee: <strong>${selectedDoctorObj.consultationFee}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Date & Time Slot */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <CalendarIcon className="w-5 h-5 text-teal-600" />
                <span>2. Select Preferred Date & Time Slot</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Time Slot *
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          selectedSlot === slot
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Patient Information */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <User className="w-5 h-5 text-teal-600" />
                <span>3. Patient Personal Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Age
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Chief Complaint / Reason for Visit
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your symptoms or reason for visit (e.g., chest pain, routine checkup, joint stiffness)..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="firstVisit"
                  checked={isFirstVisit}
                  onChange={(e) => setIsFirstVisit(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="firstVisit" className="text-xs font-medium text-slate-700 cursor-pointer">
                  This is my first time visiting WeHeal Hospitals
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Pay fee at hospital reception during check-in.
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg shadow-teal-600/20 transition-all cursor-pointer text-sm"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm & Generate Appointment Pass</span>
              </button>
            </div>
          </form>
        ) : (
          /* CONFIRMED APPOINTMENT DIGITAL PASS */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-200 shadow-2xl space-y-6">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Appointment Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Your Digital Appointment Pass
              </h2>
              <p className="text-xs text-slate-500">
                Show this reference code or QR pass at reception on arrival.
              </p>
            </div>

            {/* Pass Printable Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-900 flex items-center justify-center font-bold">
                    WH
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">WeHeal Hospitals</span>
                    <span className="text-[10px] text-teal-300">OPD Consultation Pass</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Booking Ref</span>
                  <span className="text-sm sm:text-base font-extrabold tracking-wider text-teal-300">
                    {confirmedAppointment.bookingReference}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-bold block mb-1">Doctor & Department</span>
                  <p className="text-sm font-bold text-white">{confirmedAppointment.doctorName}</p>
                  <p className="text-teal-300">{confirmedAppointment.departmentName}</p>
                  <p className="text-slate-400 mt-1">OPD Room: <strong>{confirmedAppointment.roomNo}</strong></p>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-bold block mb-1">Date & Time</span>
                  <p className="text-sm font-bold text-white">{confirmedAppointment.date}</p>
                  <p className="text-amber-300 font-semibold">{confirmedAppointment.timeSlot}</p>
                  <p className="text-slate-400 mt-1">Status: <strong className="text-emerald-400">Confirmed</strong></p>
                </div>

                <div>
                  <span className="text-slate-400 uppercase font-bold block mb-1">Patient Details</span>
                  <p className="text-sm font-bold text-white">{confirmedAppointment.patientName}</p>
                  <p className="text-slate-300">{confirmedAppointment.patientPhone}</p>
                  <p className="text-slate-400 mt-1">Fee: <strong>${confirmedAppointment.consultationFee}</strong></p>
                </div>
              </div>

              {/* QR Mockup */}
              <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white p-1 rounded-xl flex items-center justify-center text-slate-900">
                    <QrCode className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-300 font-medium">Scan for reception check-in</p>
                    <p className="text-[10px] text-slate-500">Issued on {confirmedAppointment.createdAt}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
                  Ready for Visit
                </span>
              </div>

            </div>

            {/* Pass Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button
                onClick={() => onNavigate('my-bookings')}
                className="w-full sm:w-auto text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-2xl transition-colors cursor-pointer"
              >
                View in My Bookings
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Pass</span>
                </button>

                <button
                  onClick={() => setConfirmedAppointment(null)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  <span>Book Another</span>
                </button>
              </div>
            </div>

          </div>
        )}
      </section>

    </div>
  );
};
