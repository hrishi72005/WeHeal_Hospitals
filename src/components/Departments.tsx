import React, { useState } from 'react';
import { Page, Department } from '../types';
import { DEPARTMENTS } from '../data/hospitalData';
import { Search, Building2, Users, Clock, MapPin, ChevronRight, CheckCircle2, Calendar } from 'lucide-react';

interface DepartmentsProps {
  onNavigate: (page: Page) => void;
  onSelectDepartment: (deptId: string) => void;
  onBookDepartment: (deptId: string) => void;
}

export const Departments: React.FC<DepartmentsProps> = ({
  onNavigate,
  onSelectDepartment,
  onBookDepartment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Critical Care', 'Surgical', 'Medicine', 'Women & Child'];

  const filteredDepartments = DEPARTMENTS.filter((dept) => {
    const matchesCategory = selectedCategory === 'All' || dept.category === selectedCategory;
    const matchesSearch =
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.conditionsTreated.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 space-y-10">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
              WeHeal Clinical Centers
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Specialty Departments & Wings
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Each specialty department is led by distinguished senior faculty and equipped with dedicated ICUs, operating theaters, and diagnostic technology.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search department or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Department Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredDepartments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No departments found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search filter or select "All" categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-teal-400 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dept.image}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 text-xs font-bold text-teal-300 bg-slate-900/80 backdrop-blur-xs px-3 py-1 rounded-full border border-teal-400/30">
                      {dept.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3
                        onClick={() => onSelectDepartment(dept.id)}
                        className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors cursor-pointer"
                      >
                        {dept.name}
                      </h3>
                      <p className="text-xs font-medium text-teal-700 mt-0.5">
                        {dept.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {dept.description}
                    </p>

                    {/* Key Services bullets */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">
                        Featured Services
                      </span>
                      {dept.keyServices.slice(0, 3).map((serv, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span className="truncate">{serv}</span>
                        </div>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{dept.doctorCount} Doctors</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{dept.location.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectDepartment(dept.id)}
                    className="w-full text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 py-2.5 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Department Overview
                  </button>
                  <button
                    onClick={() => onBookDepartment(dept.id)}
                    className="w-full text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 py-2.5 rounded-xl transition-colors cursor-pointer text-center shadow-xs flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book OPD</span>
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
