import React, { useState, useEffect } from 'react';
import { Page, Appointment, Doctor, Department } from '../types';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import {
  db,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  FirebaseUser,
} from '../lib/firebase';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  AlertCircle,
  QrCode,
  Printer,
  Download,
  Trash2,
  Edit3,
  LogOut,
  Sparkles,
  Building2,
  Stethoscope,
  DollarSign,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Eye,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminPortalProps {
  onNavigate: (page: Page) => void;
  appointments: Appointment[];
  onAddAppointment: (newApt: Appointment) => void;
  onUpdateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  onDeleteAppointment: (id: string) => void;
  onEditAppointment: (updated: Appointment) => void;
  currentUser: FirebaseUser | null;
}

const ADMIN_EMAIL = 'hrishikeshyk772005@gmail.com';
const ADMIN_PASSWORD = '207705';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onNavigate,
  appointments,
  onAddAppointment,
  onUpdateAppointmentStatus,
  onDeleteAppointment,
  onEditAppointment,
  currentUser,
}) => {
  // Admin local authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return true;
    }
    return localStorage.getItem('weheal_admin_session') === 'true';
  });

  const [emailInput, setEmailInput] = useState<string>('hrishikeshyk772005@gmail.com');
  const [passwordInput, setPasswordInput] = useState<string>('207705');
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Sync auth state if Firebase user matches admin email
  useEffect(() => {
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('weheal_admin_session', 'true');
    }
  }, [currentUser]);

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState<'manage' | 'create' | 'reports'>('manage');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');

  // Modals
  const [selectedPass, setSelectedPass] = useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deletingAppointmentId, setDeletingAppointmentId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // New Booking Form State (Admin End)
  const [newDeptId, setNewDeptId] = useState<string>(DEPARTMENTS[0].id);
  const [newDoctorId, setNewDoctorId] = useState<string>(
    DOCTORS.find((d) => d.departmentId === DEPARTMENTS[0].id)?.id || DOCTORS[0].id
  );
  const [newDate, setNewDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [newSlot, setNewSlot] = useState<string>('10:00 AM');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientAge, setPatientAge] = useState<number | ''>(35);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [reason, setReason] = useState<string>('Admin Direct Walk-In Registration');
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  // Auto-update doctor when department changes in admin creation form
  useEffect(() => {
    const deptDocs = DOCTORS.filter((d) => d.departmentId === newDeptId);
    if (deptDocs.length > 0) {
      setNewDoctorId(deptDocs[0].id);
    }
  }, [newDeptId]);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const isEmailValid = emailInput.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const isPasswordValid = passwordInput === ADMIN_PASSWORD;

    if (isEmailValid && isPasswordValid) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('weheal_admin_session', 'true');

      // Also attempt Firebase Auth sign-in or account registration so Firebase token stays active
      try {
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          try {
            await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
          } catch (createErr) {
            console.log('Firebase auth background registration notice:', createErr);
          }
        }
      }

      setAuthLoading(false);
      showNotification('Admin Portal authenticated successfully!');
    } else {
      setAuthLoading(false);
      setAuthError('Invalid Admin credentials. Please check email & password.');
    }
  };

  const handleAdminSignOut = async () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('weheal_admin_session');
    try {
      await signOut(auth);
    } catch (err) {
      console.log('Sign out error:', err);
    }
  };

  const handleQuickFill = () => {
    setEmailInput(ADMIN_EMAIL);
    setPasswordInput(ADMIN_PASSWORD);
  };

  // Status Badge Helper
  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Confirmed</span>
          </span>
        );
      case 'In Consultation':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>In Consultation</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
      case 'No Show':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>No Show</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    // Status Filter
    if (statusFilter !== 'All' && apt.status !== statusFilter) return false;
    // Department Filter
    if (departmentFilter !== 'All' && apt.departmentId !== departmentFilter) return false;
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        apt.bookingReference.toLowerCase().includes(q) ||
        apt.patientName.toLowerCase().includes(q) ||
        apt.patientPhone.includes(q) ||
        apt.patientEmail.toLowerCase().includes(q) ||
        apt.doctorName.toLowerCase().includes(q) ||
        apt.departmentName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle Admin Direct Booking Submit
  const handleAdminCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) {
      alert('Patient name and phone number are required.');
      return;
    }

    setFormSubmitting(true);
    const selectedDept = DEPARTMENTS.find((d) => d.id === newDeptId) || DEPARTMENTS[0];
    const selectedDoc = DOCTORS.find((d) => d.id === newDoctorId) || DOCTORS[0];

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const refCode = `WH-2026-${randomDigits}`;

    const newApt: Appointment = {
      id: `apt-admin-${Date.now()}`,
      userId: currentUser?.uid || 'admin-registered',
      bookingReference: refCode,
      patientName,
      patientPhone,
      patientEmail: patientEmail || 'walkin.patient@weheal.com',
      patientAge: Number(patientAge) || 30,
      patientGender,
      isFirstVisit,
      departmentId: selectedDept.id,
      departmentName: selectedDept.name,
      doctorId: selectedDoc.id,
      doctorName: selectedDoc.name,
      doctorImage: selectedDoc.image,
      date: newDate,
      timeSlot: newSlot,
      reason: reason || 'Routine OPD Consultation',
      consultationFee: selectedDoc.consultationFee,
      roomNo: selectedDoc.roomNo,
      status: 'Confirmed',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    try {
      await onAddAppointment(newApt);
      showNotification(`OPD Pass created successfully! Ref: ${refCode}`);
      // Reset form
      setPatientName('');
      setPatientPhone('');
      setPatientEmail('');
      setReason('Admin Direct Walk-In Registration');
      setActiveTab('manage');
    } catch (err: any) {
      console.error('Error creating admin appointment:', err);
      alert('Failed to register appointment in Firestore: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Edit Save
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    try {
      await onEditAppointment(editingAppointment);
      // Also update Firestore directly
      const aptRef = doc(db, 'appointments', editingAppointment.id);
      await updateDoc(aptRef, {
        patientName: editingAppointment.patientName,
        patientPhone: editingAppointment.patientPhone,
        patientEmail: editingAppointment.patientEmail,
        patientAge: editingAppointment.patientAge,
        patientGender: editingAppointment.patientGender,
        date: editingAppointment.date,
        timeSlot: editingAppointment.timeSlot,
        status: editingAppointment.status,
        roomNo: editingAppointment.roomNo,
        consultationFee: editingAppointment.consultationFee,
        reason: editingAppointment.reason,
      });

      showNotification(`Appointment ${editingAppointment.bookingReference} updated successfully!`);
      setEditingAppointment(null);
    } catch (err: any) {
      console.error('Error saving edited appointment:', err);
      alert('Failed to update in Firestore: ' + err.message);
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingAppointmentId) return;
    try {
      await onDeleteAppointment(deletingAppointmentId);
      // Delete from Firestore
      const aptRef = doc(db, 'appointments', deletingAppointmentId);
      await deleteDoc(aptRef);
      showNotification('Appointment deleted permanently from Firestore.');
      setDeletingAppointmentId(null);
    } catch (err: any) {
      console.error('Error deleting appointment:', err);
      alert('Failed to delete from Firestore: ' + err.message);
    }
  };

  // Export CSV Records
  const handleExportCSV = () => {
    if (appointments.length === 0) {
      alert('No booking records available to export.');
      return;
    }

    const headers = [
      'Booking Ref',
      'Patient Name',
      'Phone',
      'Email',
      'Age',
      'Gender',
      'Department',
      'Doctor Name',
      'Date',
      'Time Slot',
      'Fee ($)',
      'Room No',
      'Status',
      'Created At',
    ];

    const rows = appointments.map((a) => [
      a.bookingReference,
      `"${a.patientName}"`,
      `"${a.patientPhone}"`,
      `"${a.patientEmail}"`,
      a.patientAge,
      a.patientGender,
      `"${a.departmentName}"`,
      `"${a.doctorName}"`,
      a.date,
      a.timeSlot,
      a.consultationFee,
      a.roomNo,
      a.status,
      `"${a.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WeHeal_Hospitals_OPD_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculation Metrics
  const totalBookings = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const inConsultCount = appointments.filter((a) => a.status === 'In Consultation').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;
  const totalRevenue = appointments
    .filter((a) => a.status !== 'Cancelled')
    .reduce((sum, a) => sum + (a.consultationFee || 0), 0);

  // If Admin is NOT logged in, render Admin Sign-In Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-900 text-white">
        <div className="bg-slate-800/90 w-full max-w-md rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-2 relative z-10">
            <div className="w-14 h-14 bg-teal-500/20 text-teal-400 border border-teal-400/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 inline-block">
              Hospital OPD Management Console
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Admin Portal Sign In
            </h2>
            <p className="text-xs text-slate-300">
              Restricted to authorized WeHeal Hospital staff & OPD administrators.
            </p>
          </div>

          {authError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Admin Email ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  placeholder="admin@weheal.com"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Admin Access Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold py-3.5 rounded-2xl text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{authLoading ? 'Authenticating Admin...' : 'Sign In as Admin'}</span>
            </button>
          </form>

          {/* Quick Fill Button */}
          <div className="pt-4 border-t border-slate-700/80 text-center space-y-2 relative z-10">
            <p className="text-[11px] text-slate-400">Authorized Credentials Requested:</p>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 font-mono text-[11px] text-teal-300 space-y-1">
              <div>Email: <strong>{ADMIN_EMAIL}</strong></div>
              <div>Password: <strong>{ADMIN_PASSWORD}</strong></div>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 underline cursor-pointer"
            >
              Auto-Fill Credentials & Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-5 right-5 z-50 bg-teal-500 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-2xl border border-teal-300 flex items-center gap-2 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span className="text-xs">{notificationMsg}</span>
        </div>
      )}

      {/* Top Console Bar */}
      <div className="max-w-7xl mx-auto bg-slate-800/90 rounded-3xl p-6 border border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                Hospital OPD Admin Console
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] text-emerald-400 font-semibold">Live Firestore Sync</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              OPD Appointments & Patient Management
            </h1>
            <p className="text-xs text-slate-400">
              Authorized Admin Account: <strong className="text-slate-200">{ADMIN_EMAIL}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setActiveTab('create')}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking (Admin)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-600"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleAdminSignOut}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold px-3.5 py-2.5 rounded-xl text-xs border border-rose-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Metrics Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
          <div className="text-2xl font-extrabold text-white">{totalBookings}</div>
          <span className="text-[10px] text-teal-400 font-semibold">Synced in Firestore</span>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Confirmed OPDs</span>
          <div className="text-2xl font-extrabold text-emerald-400">{confirmedCount}</div>
          <span className="text-[10px] text-slate-400">Ready for Consultation</span>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">In Consultation</span>
          <div className="text-2xl font-extrabold text-blue-400">{inConsultCount}</div>
          <span className="text-[10px] text-slate-400">Currently in Doctor Room</span>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed</span>
          <div className="text-2xl font-extrabold text-slate-300">{completedCount}</div>
          <span className="text-[10px] text-slate-400">Prescriptions Issued</span>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Total Revenue</span>
          <div className="text-2xl font-extrabold text-amber-400">${totalRevenue}</div>
          <span className="text-[10px] text-slate-400">Consultation Fees</span>
        </div>
      </div>

      {/* Main Tabs Header */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'manage'
              ? 'bg-teal-500 text-slate-950 font-extrabold shadow-md'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>All Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'create'
              ? 'bg-teal-500 text-slate-950 font-extrabold shadow-md'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Register New OPD (Admin End)</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-teal-500 text-slate-950 font-extrabold shadow-md'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Department Breakdowns</span>
        </button>
      </div>

      {/* TAB 1: MANAGE APPOINTMENTS */}
      {activeTab === 'manage' && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Controls Bar: Search & Status Filters */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search patient name, phone, email, doctor, department, or ref code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {['All', 'Confirmed', 'In Consultation', 'Completed', 'Cancelled', 'No Show'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                    statusFilter === status
                      ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table */}
          {filteredAppointments.length === 0 ? (
            <div className="bg-slate-800/60 rounded-3xl p-12 text-center border border-slate-700 space-y-3">
              <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No OPD Appointments Found</h3>
              <p className="text-xs text-slate-400">
                No patient bookings matched your selected filter or search query.
              </p>
            </div>
          ) : (
            <div className="bg-slate-800/90 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="p-4">Reference & Status</th>
                      <th className="p-4">Patient Information</th>
                      <th className="p-4">Department & Doctor</th>
                      <th className="p-4">Date & Slot</th>
                      <th className="p-4">Room & Fee</th>
                      <th className="p-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/80">
                    {filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-700/40 transition-colors">
                        {/* Reference & Status */}
                        <td className="p-4 space-y-1.5 align-top">
                          <div className="font-mono font-bold text-teal-300 text-sm">{apt.bookingReference}</div>
                          <div>{getStatusBadge(apt.status)}</div>
                        </td>

                        {/* Patient Information */}
                        <td className="p-4 space-y-1 align-top">
                          <div className="font-bold text-white text-sm">{apt.patientName}</div>
                          <div className="text-slate-400">
                            {apt.patientAge} yrs • {apt.patientGender} • {apt.patientPhone}
                          </div>
                          <div className="text-slate-400 text-[11px] truncate max-w-[180px]">{apt.patientEmail}</div>
                        </td>

                        {/* Department & Doctor */}
                        <td className="p-4 space-y-1 align-top">
                          <div className="font-bold text-teal-200">{apt.doctorName}</div>
                          <div className="text-slate-400 text-[11px]">{apt.departmentName}</div>
                          <div className="text-slate-400 text-[11px] italic italic truncate max-w-[180px]">
                            "{apt.reason}"
                          </div>
                        </td>

                        {/* Date & Slot */}
                        <td className="p-4 space-y-1 align-top">
                          <div className="font-bold text-white">{apt.date}</div>
                          <div className="text-slate-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-teal-400" />
                            <span>{apt.timeSlot}</span>
                          </div>
                        </td>

                        {/* Room & Fee */}
                        <td className="p-4 space-y-1 align-top">
                          <div className="font-bold text-emerald-400">${apt.consultationFee}</div>
                          <div className="text-slate-400 text-[11px]">Room: {apt.roomNo}</div>
                        </td>

                        {/* Admin Action Controls */}
                        <td className="p-4 align-top text-right space-y-2">
                          {/* Quick Status Update Selector */}
                          <select
                            value={apt.status}
                            onChange={(e) =>
                              onUpdateAppointmentStatus(apt.id, e.target.value as Appointment['status'])
                            }
                            className="bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-teal-300 font-bold py-1 px-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Consultation">In Consultation</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="No Show">No Show</option>
                          </select>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            {/* View OPD Pass */}
                            <button
                              onClick={() => setSelectedPass(apt)}
                              title="View & Print OPD Pass"
                              className="p-1.5 bg-slate-700 hover:bg-slate-600 text-teal-300 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Details */}
                            <button
                              onClick={() => setEditingAppointment({ ...apt })}
                              title="Edit Details"
                              className="p-1.5 bg-slate-700 hover:bg-slate-600 text-blue-300 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeletingAppointmentId(apt.id)}
                              title="Delete Permanent"
                              className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg transition-colors cursor-pointer border border-rose-500/30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REGISTER NEW BOOKING (ADMIN END) */}
      {activeTab === 'create' && (
        <div className="max-w-3xl mx-auto bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 inline-block mb-1">
              Admin OPD Registration Form
            </span>
            <h2 className="text-xl font-extrabold text-white">Direct Hospital OPD Booking</h2>
            <p className="text-xs text-slate-400">
              Register walk-in patients directly into the hospital queue. Saves immediately to Cloud Firestore.
            </p>
          </div>

          <form onSubmit={handleAdminCreateBooking} className="space-y-5">
            {/* Department & Doctor Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  1. Select Department
                </label>
                <select
                  value={newDeptId}
                  onChange={(e) => setNewDeptId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  2. Select Consulting Specialist
                </label>
                <select
                  value={newDoctorId}
                  onChange={(e) => setNewDoctorId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                >
                  {DOCTORS.filter((d) => d.departmentId === newDeptId).map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialty}) — ${doc.consultationFee}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  3. Appointment Date
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  4. Time Slot
                </label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                >
                  {[
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
                    '05:00 PM',
                  ].map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patient Info Fields */}
            <div className="space-y-4 pt-2 border-t border-slate-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Patient Demographics & Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Patient Email
                  </label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Reason for Consultation / Symptoms
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chest discomfort, Follow-up scan, Blood pressure check..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={formSubmitting}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold py-3.5 rounded-2xl text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{formSubmitting ? 'Registering Booking...' : 'Issue OPD Booking & Sync to Firestore'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: REPORTS & ANALYTICS */}
      {activeTab === 'reports' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-400" />
              <span>Department-Wise OPD Distribution</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEPARTMENTS.map((dept) => {
                const deptBookings = appointments.filter((a) => a.departmentId === dept.id);
                const deptRevenue = deptBookings
                  .filter((a) => a.status !== 'Cancelled')
                  .reduce((acc, a) => acc + (a.consultationFee || 0), 0);

                return (
                  <div key={dept.id} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-300 text-xs">{dept.name}</span>
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                        {dept.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <span className="text-slate-400">Total Patients:</span>
                      <strong className="text-white">{deptBookings.length}</strong>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Revenue Generated:</span>
                      <strong className="text-emerald-400">${deptRevenue}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT APPOINTMENT DETAILS */}
      {editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-800 w-full max-w-lg rounded-3xl border border-slate-700 p-6 space-y-5 relative text-white">
            <button
              onClick={() => setEditingAppointment(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                Admin Editor
              </span>
              <h3 className="text-lg font-bold">Edit Appointment #{editingAppointment.bookingReference}</h3>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={editingAppointment.patientName}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, patientName: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={editingAppointment.patientPhone}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, patientPhone: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={editingAppointment.date}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, date: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={editingAppointment.timeSlot}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, timeSlot: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={editingAppointment.status}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        status: e.target.value as Appointment['status'],
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Consultation">In Consultation</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="No Show">No Show</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Room No</label>
                  <input
                    type="text"
                    value={editingAppointment.roomNo}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, roomNo: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Clinical Reason</label>
                <input
                  type="text"
                  value={editingAppointment.reason}
                  onChange={(e) =>
                    setEditingAppointment({ ...editingAppointment, reason: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Save Changes to Firestore
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE CONFIRMATION */}
      {deletingAppointmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-800 w-full max-w-sm rounded-3xl border border-slate-700 p-6 space-y-4 text-center text-white">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold">Delete Appointment Record?</h3>
            <p className="text-xs text-slate-300">
              This action will permanently delete this appointment from Cloud Firestore.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingAppointmentId(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW / PRINT OFFICIAL OPD PASS */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative border border-slate-200">
            <button
              onClick={() => setSelectedPass(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Pass Header */}
            <div className="border-b border-slate-200 pb-4 text-center space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Official OPD Entry Pass
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">WeHeal Super Specialty Hospitals</h3>
              <p className="text-xs text-slate-500">Block A, Main Medical Complex • 24/7 Helpline</p>
            </div>

            {/* Reference & QR */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Token Reference Code</span>
                <div className="text-xl font-mono font-extrabold text-teal-800">{selectedPass.bookingReference}</div>
                <div className="mt-1">{getStatusBadge(selectedPass.status)}</div>
              </div>
              <div className="w-16 h-16 bg-white p-1 rounded-xl border border-slate-300 flex items-center justify-center">
                <QrCode className="w-14 h-14 text-slate-800" />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Patient Name:</span>
                <strong className="text-slate-900">{selectedPass.patientName} ({selectedPass.patientAge}y, {selectedPass.patientGender})</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Department:</span>
                <strong className="text-teal-800">{selectedPass.departmentName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Specialist Doctor:</span>
                <strong className="text-slate-900">{selectedPass.doctorName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Date & Slot:</span>
                <strong className="text-slate-900">{selectedPass.date} @ {selectedPass.timeSlot}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">OPD Room No:</span>
                <strong className="text-slate-900">{selectedPass.roomNo}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consultation Fee:</span>
                <strong className="text-emerald-700 font-extrabold">${selectedPass.consultationFee}</strong>
              </div>
            </div>

            {/* Print Action */}
            <button
              onClick={() => window.print()}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official OPD Pass</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
