import React, { useState } from 'react';
import { Page, Doctor } from '../types';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import { Search, Star, Calendar, Clock, MapPin, Award, Filter, CheckCircle2, UserCheck, Stethoscope } from 'lucide-react';

interface DoctorsProps {
  onNavigate: (page: Page) => void;
  onSelectDoctor: (doctorId: string) => void;
  onBookDoctor: (doctorId: string, deptId: string) => void;
  initialDepartmentFilter?: string;
}

export const Doctors: React.FC<DoctorsProps> = ({
  onNavigate,
  onSelectDoctor,
  onBookDoctor,
  initialDepartmentFilter,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>(initialDepartmentFilter || 'All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<string>('All');

  const daysList = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const filteredDoctors = DOCTORS.filter((doc) => {
    const matchesDept = selectedDept === 'All' || doc.departmentId === selectedDept;
    const matchesGender = selectedGender === 'All' || doc.gender === selectedGender;
    const matchesDay = selectedDay === 'All' || doc.availableDays.includes(selectedDay);
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualification.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesGender && matchesDay && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 space-y-10">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
                WeHeal Medical Faculty
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Doctor & Specialist Directory
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Find and schedule consultations with board-certified physicians, surgeon leads, and sub-specialists across all medical wings.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-teal-50 px-4 py-2.5 rounded-2xl border border-teal-100 text-teal-800 text-xs font-bold shrink-0">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>{filteredDoctors.length} Doctors Available</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            >
              <option value="All">All Departments ({DEPARTMENTS.length})</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            {/* Availability Day Filter */}
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            >
              <option value="All">Any Working Day</option>
              {daysList.filter((d) => d !== 'All').map((day) => (
                <option key={day} value={day}>
                  Available on {day}
                </option>
              ))}
            </select>

            {/* Gender Filter */}
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male Doctors</option>
              <option value="Female">Female Doctors</option>
            </select>

          </div>
        </div>
      </section>

      {/* Doctor Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No doctors matching criteria</h3>
            <p className="text-xs text-slate-500">
              Try clearing search filters or select a different department.
            </p>
            <button
              onClick={() => {
                setSelectedDept('All');
                setSearchQuery('');
                setSelectedGender('All');
                setSelectedDay('All');
              }}
              className="mt-2 text-xs font-bold text-teal-600 underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-teal-400 hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
                        {doc.departmentName.split('&')[0]}
                      </span>
                      <h3
                        onClick={() => onSelectDoctor(doc.id)}
                        className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors cursor-pointer truncate"
                      >
                        {doc.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {doc.title}
                      </p>

                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{doc.rating}</span>
                        <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {doc.specialty}
                  </p>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Experience:</span>
                      <span className="font-semibold text-slate-800">{doc.experienceYears} Years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Degree:</span>
                      <span className="font-semibold text-teal-800 truncate max-w-[150px]">{doc.qualification}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Consultation Fee:</span>
                      <span className="font-bold text-slate-900">${doc.consultationFee}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onSelectDoctor(doc.id)}
                    className="w-full text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Doctor Profile
                  </button>
                  <button
                    onClick={() => onBookDoctor(doc.id, doc.departmentId)}
                    className="w-full text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Slot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
