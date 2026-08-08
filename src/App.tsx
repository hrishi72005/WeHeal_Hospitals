import React, { useState, useEffect } from 'react';
import { Page, Doctor, Department, Appointment } from './types';
import { DOCTORS, DEPARTMENTS } from './data/hospitalData';
import { db, collection, addDoc, onSnapshot, doc, updateDoc, auth, onAuthStateChanged, FirebaseUser } from './lib/firebase';
import { EmergencyBanner } from './components/EmergencyBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { About } from './components/About';
import { Departments } from './components/Departments';
import { Doctors } from './components/Doctors';
import { Booking } from './components/Booking';
import { MyBookings } from './components/MyBookings';
import { DoctorModal } from './components/DoctorModal';
import { DepartmentModal } from './components/DepartmentModal';
import { EmergencyModal } from './components/EmergencyModal';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  
  // Modals
  const [activeDoctorModal, setActiveDoctorModal] = useState<Doctor | null>(null);
  const [activeDepartmentModal, setActiveDepartmentModal] = useState<Department | null>(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Booking selections passed across views
  const [bookingDeptId, setBookingDeptId] = useState<string | undefined>(undefined);
  const [bookingDoctorId, setBookingDoctorId] = useState<string | undefined>(undefined);

  // Listen for Firebase Auth user state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Real-time Firestore sync with local storage fallback
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    try {
      const appointmentsRef = collection(db, 'appointments');
      unsubscribe = onSnapshot(
        appointmentsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreData: Appointment[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                bookingReference: data.bookingReference || '',
                patientName: data.patientName || '',
                patientPhone: data.patientPhone || '',
                patientEmail: data.patientEmail || 'N/A',
                patientAge: data.patientAge || 30,
                patientGender: data.patientGender || 'Male',
                isFirstVisit: data.isFirstVisit ?? true,
                departmentId: data.departmentId || '',
                departmentName: data.departmentName || '',
                doctorId: data.doctorId || '',
                doctorName: data.doctorName || '',
                doctorImage: data.doctorImage || '',
                date: data.date || '',
                timeSlot: data.timeSlot || '',
                reason: data.reason || '',
                consultationFee: data.consultationFee || 100,
                roomNo: data.roomNo || '',
                status: data.status || 'Confirmed',
                createdAt: data.createdAt || new Date().toLocaleDateString(),
              } as Appointment;
            });
            setAppointments(firestoreData);
            localStorage.setItem('weheal_appointments_v1', JSON.stringify(firestoreData));
          } else {
            // Load local storage if Firestore is empty
            const saved = localStorage.getItem('weheal_appointments_v1');
            if (saved) {
              setAppointments(JSON.parse(saved));
            } else {
              const initialBooking: Appointment = {
                id: 'apt-demo-1',
                bookingReference: 'WH-2026-8942',
                patientName: 'Johnathan Doe',
                patientPhone: '+1 (555) 234-5678',
                patientEmail: 'johnathan.doe@example.com',
                patientAge: 38,
                patientGender: 'Male',
                isFirstVisit: true,
                departmentId: 'cardiology',
                departmentName: 'Cardiology & Vascular Sciences',
                doctorId: 'doc-101',
                doctorName: 'Dr. Robert Vance',
                doctorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
                date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                timeSlot: '10:30 AM',
                reason: 'Routine Cardiac Diagnostic Follow-up',
                consultationFee: 150,
                roomNo: 'A-301',
                status: 'Confirmed',
                createdAt: new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }),
              };
              setAppointments([initialBooking]);
              // Seed initial booking to Firestore
              addDoc(collection(db, 'appointments'), initialBooking).catch((e) =>
                console.error('Initial seed error:', e)
              );
            }
          }
        },
        (error) => {
          console.warn('Firestore onSnapshot listener fallback to local storage:', error);
          const saved = localStorage.getItem('weheal_appointments_v1');
          if (saved) setAppointments(JSON.parse(saved));
        }
      );
    } catch (err) {
      console.error('Firebase init error, using local storage:', err);
      const saved = localStorage.getItem('weheal_appointments_v1');
      if (saved) setAppointments(JSON.parse(saved));
    }

    return () => unsubscribe();
  }, []);

  const handleAddAppointment = async (newApt: Appointment) => {
    // Optimistic local state update
    const updated = [newApt, ...appointments];
    setAppointments(updated);
    try {
      localStorage.setItem('weheal_appointments_v1', JSON.stringify(updated));
      // Save to Firestore
      await addDoc(collection(db, 'appointments'), newApt);
    } catch (err) {
      console.error('Failed to sync new appointment with Firestore:', err);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    const updated = appointments.map((apt) =>
      apt.id === id ? { ...apt, status: 'Cancelled' as const } : apt
    );
    setAppointments(updated);
    try {
      localStorage.setItem('weheal_appointments_v1', JSON.stringify(updated));
      // Update in Firestore
      const aptRef = doc(db, 'appointments', id);
      await updateDoc(aptRef, { status: 'Cancelled' });
    } catch (err) {
      console.error('Failed to update cancelled status in Firestore:', err);
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    const updated = appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt));
    setAppointments(updated);
    try {
      localStorage.setItem('weheal_appointments_v1', JSON.stringify(updated));
      const aptRef = doc(db, 'appointments', id);
      await updateDoc(aptRef, { status });
    } catch (err) {
      console.error('Failed to update status in Firestore:', err);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    const updated = appointments.filter((apt) => apt.id !== id);
    setAppointments(updated);
    try {
      localStorage.setItem('weheal_appointments_v1', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to delete appointment locally:', err);
    }
  };

  const handleEditAppointment = async (updatedApt: Appointment) => {
    const updated = appointments.map((apt) => (apt.id === updatedApt.id ? updatedApt : apt));
    setAppointments(updated);
    try {
      localStorage.setItem('weheal_appointments_v1', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update edited appointment locally:', err);
    }
  };

  // Helper to trigger booking page with specific doctor / department
  const handleOpenBookingWithSelection = (deptId?: string, docId?: string) => {
    setBookingDeptId(deptId);
    setBookingDoctorId(docId);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDoctorModal = (doctorId: string) => {
    const doc = DOCTORS.find((d) => d.id === doctorId);
    if (doc) setActiveDoctorModal(doc);
  };

  const handleSelectDepartmentModal = (deptId: string) => {
    const dept = DEPARTMENTS.find((d) => d.id === deptId);
    if (dept) setActiveDepartmentModal(dept);
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-teal-500 selection:text-white">
      
      {/* Emergency Header Hotline Banner */}
      <EmergencyBanner onOpenEmergencyModal={() => setEmergencyModalOpen(true)} />

      {/* Main Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        bookingCount={appointments.filter((a) => a.status === 'Confirmed').length}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSelectDoctor={handleSelectDoctorModal}
        onSelectDepartment={handleSelectDepartmentModal}
      />

      {/* Main Page Views */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onSelectDoctor={handleSelectDoctorModal}
            onSelectDepartment={handleSelectDepartmentModal}
            onOpenBookingWithSelection={handleOpenBookingWithSelection}
            onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
          />
        )}

        {currentPage === 'about' && (
          <About onNavigate={handleNavigate} />
        )}

        {currentPage === 'departments' && (
          <Departments
            onNavigate={handleNavigate}
            onSelectDepartment={handleSelectDepartmentModal}
            onBookDepartment={(deptId) => handleOpenBookingWithSelection(deptId, undefined)}
          />
        )}

        {currentPage === 'doctors' && (
          <Doctors
            onNavigate={handleNavigate}
            onSelectDoctor={handleSelectDoctorModal}
            onBookDoctor={(docId, deptId) => handleOpenBookingWithSelection(deptId, docId)}
          />
        )}

        {currentPage === 'booking' && (
          <Booking
            onNavigate={handleNavigate}
            onAppointmentBooked={handleAddAppointment}
            currentUser={currentUser}
            preselectedDeptId={bookingDeptId}
            preselectedDoctorId={bookingDoctorId}
          />
        )}

        {currentPage === 'my-bookings' && (
          <MyBookings
            onNavigate={handleNavigate}
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPortal
            onNavigate={handleNavigate}
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onDeleteAppointment={handleDeleteAppointment}
            onEditAppointment={handleEditAppointment}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectDepartment={handleSelectDepartmentModal}
      />

      {/* Doctor Profile Modal */}
      <DoctorModal
        doctor={activeDoctorModal}
        onClose={() => setActiveDoctorModal(null)}
        onBookAppointment={(doctorId, deptId) => {
          setActiveDoctorModal(null);
          handleOpenBookingWithSelection(deptId, doctorId);
        }}
      />

      {/* Department Detail Modal */}
      <DepartmentModal
        department={activeDepartmentModal}
        doctors={DOCTORS}
        onClose={() => setActiveDepartmentModal(null)}
        onBookAppointment={(doctorId, deptId) => {
          setActiveDepartmentModal(null);
          handleOpenBookingWithSelection(deptId, doctorId);
        }}
        onViewDoctorProfile={(doc) => {
          setActiveDepartmentModal(null);
          setActiveDoctorModal(doc);
        }}
      />

      {/* 24/7 Emergency Request Dialog */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      {/* Patient Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
      />

    </div>
  );
}
