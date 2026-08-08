import React, { useState } from 'react';
import { Page, Department, Doctor } from '../types';
import { HealthInsights } from './HealthInsights';
import {
  DEPARTMENTS,
  DOCTORS,
  FACILITIES,
  TESTIMONIALS,
  HEALTH_TIPS,
  HOSPITAL_STATS,
} from '../data/hospitalData';
import {
  HeartPulse,
  Calendar,
  ChevronRight,
  Star,
  Users,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Activity,
  Award,
  Stethoscope,
  Building2,
  CheckCircle2,
  PhoneCall,
  Search,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: Page) => void;
  onSelectDoctor: (doctorId: string) => void;
  onSelectDepartment: (deptId: string) => void;
  onOpenBookingWithSelection: (deptId?: string, docId?: string) => void;
  onOpenEmergencyModal: () => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  onSelectDoctor,
  onSelectDepartment,
  onOpenBookingWithSelection,
  onOpenEmergencyModal,
}) => {
  const [heroDept, setHeroDept] = useState('');
  const [heroDoctor, setHeroDoctor] = useState('');

  const filteredHeroDoctors = heroDept
    ? DOCTORS.filter((doc) => doc.departmentId === heroDept)
    : DOCTORS;

  const handleHeroWidgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBookingWithSelection(heroDept || undefined, heroDoctor || undefined);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 text-white overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
        
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 text-teal-300 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Next-Gen Quaternary Healthcare Network</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Precision Medicine. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-emerald-300">
                  Compassionate Care.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Experience world-class healthcare powered by 150+ expert specialists, da Vinci robotic surgery, and round-the-clock level-1 emergency response. Your health is our highest mission.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('booking')}
                  className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Consultation</span>
                </button>

                <button
                  onClick={() => onNavigate('departments')}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-2xl backdrop-blur-xs transition-colors cursor-pointer text-sm sm:text-base border border-white/15"
                >
                  <Building2 className="w-5 h-5 text-teal-300" />
                  <span>Explore Specialty Wings</span>
                </button>
              </div>

              {/* Badges */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>JCI & NABH Accredited</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24/7 Zero-Wait Emergency</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cashless Insurance Support</span>
                </div>
              </div>

            </div>

            {/* Right Hero Appointment Quick Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 border border-slate-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">
                      Quick Appointment
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Find doctor & pick preferred time slot
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                </div>

                <form onSubmit={handleHeroWidgetSubmit} className="space-y-4">
                  {/* Select Department */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      1. Select Specialty Department
                    </label>
                    <select
                      value={heroDept}
                      onChange={(e) => {
                        setHeroDept(e.target.value);
                        setHeroDoctor('');
                      }}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
                    >
                      <option value="">All Specialty Departments</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Doctor */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      2. Select Doctor / Specialist
                    </label>
                    <select
                      value={heroDoctor}
                      onChange={(e) => setHeroDoctor(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
                    >
                      <option value="">Any Available Specialist</option>
                      {filteredHeroDoctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} ({doc.departmentName.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 bg-teal-50/80 rounded-xl border border-teal-100 text-xs text-teal-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Instant booking confirmation with zero booking fee</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold py-3.5 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer text-sm"
                  >
                    <span>Proceed to Slot Selection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS HIGHLIGHT BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 lg:-mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          
          <div className="p-2 border-r border-slate-100 last:border-0">
            <span className="text-2xl sm:text-4xl font-extrabold text-slate-900 block">
              {HOSPITAL_STATS.yearsOfExcellence}+
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1 block">
              Years of Clinical Mastery
            </span>
          </div>

          <div className="p-2 lg:border-r border-slate-100">
            <span className="text-2xl sm:text-4xl font-extrabold text-teal-600 block">
              {HOSPITAL_STATS.expertDoctors}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1 block">
              Board-Certified Doctors
            </span>
          </div>

          <div className="p-2 border-r border-slate-100">
            <span className="text-2xl sm:text-4xl font-extrabold text-slate-900 block">
              {HOSPITAL_STATS.bedsCapacity}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1 block">
              Smart ICU & Inpatient Beds
            </span>
          </div>

          <div className="p-2">
            <span className="text-2xl sm:text-4xl font-extrabold text-emerald-600 block">
              {HOSPITAL_STATS.patientSatisfaction}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1 block">
              Patient Satisfaction Rate
            </span>
          </div>

        </div>
      </section>

      {/* 3. FEATURED SPECIALTY DEPARTMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
              Centers of Excellence
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Specialty Clinical Wings
            </h2>
          </div>
          <button
            onClick={() => onNavigate('departments')}
            className="flex items-center gap-1 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer group"
          >
            <span>View All {DEPARTMENTS.length} Departments</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEPARTMENTS.slice(0, 4).map((dept) => (
            <div
              key={dept.id}
              onClick={() => onSelectDepartment(dept.id)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-teal-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 text-xs font-bold text-teal-300 bg-slate-900/70 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                    {dept.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors mb-2">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {dept.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
                    <span className="font-semibold text-slate-800">
                      {dept.doctorCount} Specialists
                    </span>
                    <span className="text-emerald-600 font-medium">
                      Wait ~{dept.avgWaitTimeMinutes}m
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:bg-teal-50 transition-colors">
                <span>Explore Department</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DOCTORS SPOTLIGHT */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
                World-Class Faculty
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Meet Our Senior Doctors
              </h2>
            </div>
            <button
              onClick={() => onNavigate('doctors')}
              className="flex items-center gap-1 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer group"
            >
              <span>Browse Full Doctor Directory</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOCTORS.filter((d) => d.isHeadOfDepartment || d.rating >= 4.9).slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-50 rounded-3xl p-5 border border-slate-200 hover:border-teal-400 hover:bg-white hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative mb-4">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-52 rounded-2xl object-cover border border-slate-200"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
                    {doc.departmentName.split('&')[0]}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    {doc.title}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {doc.specialty}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-200/80">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Fee: <strong className="text-slate-900">${doc.consultationFee}</strong></span>
                    <span>Experience: <strong className="text-slate-900">{doc.experienceYears}y</strong></span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectDoctor(doc.id)}
                      className="w-full text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => onOpenBookingWithSelection(doc.departmentId, doc.id)}
                      className="w-full text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ROBOTIC TECHNOLOGY & FACILITIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
            Cutting-Edge Care Infrastructure
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Advanced Medical Facilities & Robotic Innovation
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Combining human surgical mastery with sub-millimeter robotic precision to deliver safer procedures and faster patient recoveries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FACILITIES.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow flex flex-col lg:flex-row"
            >
              <div className="lg:w-2/5 relative h-52 lg:h-auto">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:w-3/5 p-6 space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {fac.title}
                  </h3>
                  <span className="text-xs font-semibold text-teal-600 block mb-2">
                    {fac.subtitle}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {fac.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700 pt-3 border-t border-slate-100">
                  {fac.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
              Patient Stories
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              Grateful Voices & Healing Journeys
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    "{t.content}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700 flex items-center gap-3">
                  {t.patientImage && (
                    <img
                      src={t.patientImage}
                      alt={t.patientName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-600"
                    />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.patientName}</h4>
                    <span className="text-xs text-teal-400 font-medium">
                      {t.procedure} ({t.doctorName})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. HEALTH TIPS & BLOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
              Doctor Insights
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Health & Wellness Articles
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HEALTH_TIPS.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                <img
                  src={tip.image}
                  alt={tip.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-teal-600">{tip.category}</span>
                    <span>{tip.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {tip.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>By <strong>{tip.authorName}</strong></span>
                <span>{tip.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HEALTH INSIGHTS GROUNDED SEARCH SECTION */}
      <HealthInsights />

      {/* 8. EMERGENCY FOOTER CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white inline-block">
              Immediate Medical Emergency?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              24/7 Trauma Hotline & Mobile ICU Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-rose-100">
              Our Level-1 trauma response team is on standby 365 days a year.
            </p>
          </div>

          <button
            onClick={onOpenEmergencyModal}
            className="bg-white text-rose-700 hover:bg-rose-50 font-extrabold px-8 py-4 rounded-2xl shadow-lg transition-all cursor-pointer text-sm shrink-0 flex items-center gap-2"
          >
            <PhoneCall className="w-5 h-5 text-rose-600 animate-pulse" />
            <span>Call 1-800-911-HEAL Now</span>
          </button>
        </div>
      </section>

    </div>
  );
};
