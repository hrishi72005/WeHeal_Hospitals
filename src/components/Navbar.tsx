import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../types';
import { FirebaseUser } from '../lib/firebase';
import { HeartPulse, Search, Calendar, UserCheck, Menu, X, ChevronRight, Stethoscope, Building2, User } from 'lucide-react';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  bookingCount: number;
  currentUser: FirebaseUser | null;
  onOpenAuth: () => void;
  onSelectDoctor?: (doctorId: string) => void;
  onSelectDepartment?: (deptId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  bookingCount,
  currentUser,
  onOpenAuth,
  onSelectDoctor,
  onSelectDepartment,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search popup on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDoctors = searchQuery.trim()
    ? DOCTORS.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredDepartments = searchQuery.trim()
    ? DEPARTMENTS.filter(
        (dept) =>
          dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults = filteredDoctors.length > 0 || filteredDepartments.length > 0;

  const handleDoctorClick = (docId: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    if (onSelectDoctor) onSelectDoctor(docId);
  };

  const handleDepartmentClick = (deptId: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    if (onSelectDepartment) onSelectDepartment(deptId);
  };

  const navItems: { page: Page; label: string }[] = [
    { page: 'home', label: 'Home' },
    { page: 'about', label: 'About Us' },
    { page: 'departments', label: 'Departments' },
    { page: 'doctors', label: 'Doctors' },
    { page: 'booking', label: 'Book Appointment' },
    { page: 'admin', label: 'Admin Portal' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:bg-teal-700 transition-colors">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                WeHeal <span className="text-teal-600">Hospitals</span>
              </span>
              <span className="text-[11px] font-medium tracking-wide uppercase text-slate-500 block">
                Healthcare Excellence
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block relative max-w-xs w-full" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors, departments, conditions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm text-slate-800 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Live Search Dropdown */}
            {searchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 p-3 max-h-96 overflow-y-auto">
                {!hasResults && (
                  <p className="text-sm text-slate-500 p-3 text-center">
                    No doctors or departments matching "{searchQuery}"
                  </p>
                )}

                {filteredDoctors.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                      Doctors
                    </span>
                    {filteredDoctors.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => handleDoctorClick(doc.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-teal-50 text-left transition-colors cursor-pointer"
                      >
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {doc.specialty}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}

                {filteredDepartments.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                      Departments
                    </span>
                    {filteredDepartments.map((dept) => (
                      <button
                        key={dept.id}
                        onClick={() => handleDepartmentClick(dept.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-teal-50 text-left transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {dept.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {dept.doctorCount} Doctors • {dept.location}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  currentPage === item.page
                    ? 'bg-teal-50 text-teal-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Account / Firebase Auth Button */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentUser
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <User className={`w-4 h-4 ${currentUser ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span className="max-w-28 truncate">
                {currentUser ? currentUser.displayName || currentUser.email?.split('@')[0] || 'Patient Account' : 'Sign In'}
              </span>
            </button>

            {/* My Bookings Button */}
            <button
              onClick={() => onNavigate('my-bookings')}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                currentPage === 'my-bookings'
                  ? 'border-teal-600 bg-teal-50 text-teal-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>My Bookings</span>
              {bookingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center ml-0.5">
                  {bookingCount}
                </span>
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={() => onNavigate('booking')}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-md shadow-teal-600/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => onNavigate('my-bookings')}
              className="relative p-2 text-slate-600 hover:text-slate-900"
              title="My Bookings"
            >
              <UserCheck className="w-5 h-5 text-teal-600" />
              {bookingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {bookingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          {/* Mobile Search */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search doctors or departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                  currentPage === item.page
                    ? 'bg-teal-50 text-teal-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('booking');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-medium py-3 rounded-xl shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
