import React from 'react';
import { Page } from '../types';
import { ShieldCheck, HeartPulse, Award, Users, CheckCircle2, Building2, Sparkles, Globe, Clock } from 'lucide-react';
import { HOSPITAL_STATS } from '../data/hospitalData';

interface AboutProps {
  onNavigate: (page: Page) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const milestones = [
    {
      year: '1991',
      title: 'Foundation of WeHeal Medical Center',
      description: 'Established as a 100-bed cardiology-focused specialty hospital with a mission to bring accessible cardiac care.'
    },
    {
      year: '2004',
      title: 'Expansion to Quaternary Specialty Campus',
      description: 'Inaugurated Block B & C towers, adding Neurosciences, Orthopedics, Oncology, and Level-3 NICU wings.'
    },
    {
      year: '2015',
      title: 'First Robotic Surgery & JCI Accreditation',
      description: 'Received prestigious Joint Commission International (JCI) accreditation and launched da Vinci robotic surgical suites.'
    },
    {
      year: '2024',
      title: 'Smart e-ICU & Molecular Cancer Tower',
      description: 'Commissioned 1,200 beds smart infrastructure with TrueBeam STx radiosurgery and AI-assisted diagnostic lab arrays.'
    }
  ];

  const leadershipBoard = [
    {
      name: 'Dr. Evelyn Montgomery, MD, PhD',
      role: 'Chief Executive Officer',
      credentials: 'Harvard Medical School • 30+ Years Medical Governance',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Dr. Robert Vance, MD, FACC',
      role: 'Chief Medical Officer',
      credentials: 'Johns Hopkins • pioneer in Transcatheter Cardiac Interventions',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Dr. Elena Rostova, MD, DM',
      role: 'Head of Clinical Governance & Safety',
      credentials: 'UCSF Medical Center • Stroke Protocol Developer',
      image: 'https://images.unsplash.com/photo-1594824813566-78a933758f46?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 space-y-16">
      
      {/* 1. HERO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-widest bg-teal-500/20 px-3 py-1 rounded-full border border-teal-400/30">
              About WeHeal Hospitals
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Pioneering Healing, <br />
              Empowering Health for 35+ Years
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Founded on the bedrock principles of medical excellence, ethical transparency, and patient empathy, WeHeal Hospitals is a globally recognized quaternary care institution serving over 200,000 patients annually.
            </p>
          </div>
        </div>
      </section>

      {/* 2. VISION, MISSION, VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To be the premier benchmark of patient-centered healthcare, seamlessly merging advanced biomedical artificial intelligence with human compassion.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To provide uncompromised, world-class medical outcomes across every specialty while nurturing an inclusive environment of trust, safety, and comfort.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Core Values</h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Patient Safety & Zero Error</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Sub-millimeter Surgical Precision</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Clinical Integrity & Empathy</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. TIMELINE OF EXCELLENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
            Our Journey
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900">
            35 Years of Breakthrough Milestones
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative space-y-3"
            >
              <span className="text-2xl font-extrabold text-teal-600 block">
                {m.year}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {m.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EXECUTIVE LEADERSHIP BOARD */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
              Medical Leadership
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900">
              Executive Board & Clinical Governors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipBoard.map((leader, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-4"
              >
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto border-2 border-teal-500 shadow-md"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{leader.name}</h3>
                  <p className="text-xs font-bold text-teal-700 mt-0.5">{leader.role}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {leader.credentials}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ACCREDITATIONS & RECOGNITION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
              Global Standards
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Gold Seal Quality Accreditation
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
              WeHeal Hospitals undergoes rigorous triennial evaluations by Joint Commission International (JCI) and National Accreditation Board for Hospitals (NABH).
            </p>
          </div>

          <button
            onClick={() => onNavigate('booking')}
            className="bg-white text-teal-900 hover:bg-teal-50 font-bold px-6 py-3.5 rounded-2xl shadow-md transition-colors text-sm shrink-0"
          >
            Book Appointment
          </button>
        </div>
      </section>

    </div>
  );
};
