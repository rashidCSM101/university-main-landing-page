import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  BookOpen,
  ChevronDown,
  MapPin,
  User,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface LectureSlot {
  time: string;
  subject: string;
  code: string;
  instructor: string;
  room: string;
  type: 'theory' | 'practical' | 'break' | 'free';
}

interface DaySchedule {
  day: string;
  slots: LectureSlot[];
}

const timetableData: Record<string, DaySchedule[]> = {
  '1st Year': [
    {
      day: 'Monday',
      slots: [
        { time: '8:00 - 9:00', subject: 'Cell Biology', code: 'ZOO-101', instructor: 'Dr. Nazia Parveen', room: 'Room 201', type: 'theory' },
        { time: '9:00 - 10:00', subject: 'Biodiversity-I', code: 'ZOO-102', instructor: 'Prof. Dr. Abdul Sattar', room: 'Room 201', type: 'theory' },
        { time: '10:00 - 10:30', subject: 'Break', code: '', instructor: '', room: '', type: 'break' },
        { time: '10:30 - 12:30', subject: 'Cell Biology Lab', code: 'ZOO-101L', instructor: 'Dr. Nazia Parveen', room: 'Zoology Lab 1', type: 'practical' },
        { time: '12:30 - 1:30', subject: 'English-I', code: 'ENG-101', instructor: 'Dr. Farzana Baloch', room: 'Room 105', type: 'theory' },
      ],
    },
    {
      day: 'Tuesday',
      slots: [
        { time: '8:00 - 9:00', subject: 'Mathematics-I', code: 'MATH-101', instructor: 'Prof. Dr. Zahid Abro', room: 'Room 301', type: 'theory' },
        { time: '9:00 - 10:00', subject: 'Chemistry-I', code: 'CHEM-101', instructor: 'Dr. Saima Memon', room: 'Room 202', type: 'theory' },
        { time: '10:00 - 10:30', subject: 'Break', code: '', instructor: '', room: '', type: 'break' },
        { time: '10:30 - 11:30', subject: 'Pakistan Studies', code: 'PST-101', instructor: 'Mr. Ahmed Shah', room: 'Room 103', type: 'theory' },
        { time: '11:30 - 1:30', subject: 'Biodiversity-I Lab', code: 'ZOO-102L', instructor: 'Prof. Dr. Abdul Sattar', room: 'Zoology Lab 2', type: 'practical' },
      ],
    },
    {
      day: 'Wednesday',
      slots: [
        { time: '8:00 - 9:00', subject: 'Cell Biology', code: 'ZOO-101', instructor: 'Dr. Nazia Parveen', room: 'Room 201', type: 'theory' },
        { time: '9:00 - 10:00', subject: 'English-I', code: 'ENG-101', instructor: 'Dr. Farzana Baloch', room: 'Room 105', type: 'theory' },
        { time: '10:00 - 10:30', subject: 'Break', code: '', instructor: '', room: '', type: 'break' },
        { time: '10:30 - 11:30', subject: 'Biodiversity-I', code: 'ZOO-102', instructor: 'Prof. Dr. Abdul Sattar', room: 'Room 201', type: 'theory' },
        { time: '11:30 - 12:30', subject: 'Mathematics-I', code: 'MATH-101', instructor: 'Prof. Dr. Zahid Abro', room: 'Room 301', type: 'theory' },
      ],
    },
    {
      day: 'Thursday',
      slots: [
        { time: '8:00 - 9:00', subject: 'Chemistry-I', code: 'CHEM-101', instructor: 'Dr. Saima Memon', room: 'Room 202', type: 'theory' },
        { time: '9:00 - 10:00', subject: 'Pakistan Studies', code: 'PST-101', instructor: 'Mr. Ahmed Shah', room: 'Room 103', type: 'theory' },
        { time: '10:00 - 10:30', subject: 'Break', code: '', instructor: '', room: '', type: 'break' },
        { time: '10:30 - 12:30', subject: 'Chemistry-I Lab', code: 'CHEM-101L', instructor: 'Dr. Saima Memon', room: 'Chemistry Lab', type: 'practical' },
        { time: '12:30 - 1:30', subject: 'Cell Biology', code: 'ZOO-101', instructor: 'Dr. Nazia Parveen', room: 'Room 201', type: 'theory' },
      ],
    },
    {
      day: 'Friday',
      slots: [
        { time: '8:00 - 9:00', subject: 'Biodiversity-I', code: 'ZOO-102', instructor: 'Prof. Dr. Abdul Sattar', room: 'Room 201', type: 'theory' },
        { time: '9:00 - 10:00', subject: 'Mathematics-I', code: 'MATH-101', instructor: 'Prof. Dr. Zahid Abro', room: 'Room 301', type: 'theory' },
        { time: '10:00 - 10:30', subject: 'Break', code: '', instructor: '', room: '', type: 'break' },
        { time: '10:30 - 11:30', subject: 'English-I', code: 'ENG-101', instructor: 'Dr. Farzana Baloch', room: 'Room 105', type: 'theory' },
        { time: '11:30 - 12:30', subject: 'Free Period', code: '', instructor: '', room: '', type: 'free' },
      ],
    },
  ],
  '2nd Year': [
    {
      day: 'Monday',
      slots: [
        { time: '8:00 - 9:00', subject: 'Animal Physiology', code: 'ZOO-201', instructor: 'Dr. Rukhsana Kazi', room: 'Room 203', type: 'theory' },
        { time: '9:00 - 10:00', subject: 'Biochemistry', code: 'ZOO-202', instructor: 'Dr. Nazia Parveen', room: 'Room 203', type: 'theory' },
        { time: '10:00 - 10:30', subject: 'Break', code: '', instructor: '', room: '', type: 'break' },
        { time: '10:30 - 12:30', subject: 'Animal Physiology Lab', code: 'ZOO-201L', instructor: 'Dr. Rukhsana Kazi', room: 'Zoology Lab 1', type: 'practical' },
        { time: '12:30 - 1:30', subject: 'Islamiat', code: 'ISL-201', instructor: 'Mufti Ismail', room: 'Room 102', type: 'theory' },
      ],
    },
    {
      day: 'Tuesday',
      slots: [
        { time: '8:00 - 9:00', subject: 'Biostatistics', code: 'ZOO-203', instructor: 'Prof. Dr. Zahid Abro', room: 'Room 301', type: 'theory' },
        { time: '9:00 - 10:00', subject: 'Ecology', code: 'ZOO-204', instructor: 'Dr. M. Akram Bhutto', room: 'Room 203', type: 'theory' },
        { time: '10:00 - 10:30', subject: 'Break', code: '', instructor: '', room: '', type: 'break' },
        { time: '10:30 - 11:30', subject: 'Biochemistry', code: 'ZOO-202', instructor: 'Dr. Nazia Parveen', room: 'Room 203', type: 'theory' },
        { time: '11:30 - 1:30', subject: 'Ecology Lab', code: 'ZOO-204L', instructor: 'Dr. M. Akram Bhutto', room: 'Zoology Lab 2', type: 'practical' },
      ],
    },
    {
      day: 'Wednesday',
      slots: [
        { time: '8:00 - 9:00', subject: 'Animal Physiology', code: 'ZOO-201', instructor: 'Dr. Rukhsana Kazi', room: 'Room 203', type: 'theory' },
        { time: '9:00 - 10:00', subject: 'Biostatistics', code: 'ZOO-203', instructor: 'Prof. Dr. Zahid Abro', room: 'Room 301', type: 'theory' },
        { time: '10:00 - 10:30', subject: 'Break', code: '', instructor: '', room: '', type: 'break' },
        { time: '10:30 - 12:30', subject: 'Biochemistry Lab', code: 'ZOO-202L', instructor: 'Dr. Nazia Parveen', room: 'Zoology Lab 1', type: 'practical' },
        { time: '12:30 - 1:30', subject: 'Ecology', code: 'ZOO-204', instructor: 'Dr. M. Akram Bhutto', room: 'Room 203', type: 'theory' },
      ],
    },
    {
      day: 'Thursday',
      slots: [
        { time: '8:00 - 9:00', subject: 'Islamiat', code: 'ISL-201', instructor: 'Mufti Ismail', room: 'Room 102', type: 'theory' },
        { time: '9:00 - 10:00', subject: 'Animal Physiology', code: 'ZOO-201', instructor: 'Dr. Rukhsana Kazi', room: 'Room 203', type: 'theory' },
        { time: '10:00 - 10:30', subject: 'Break', code: '', instructor: '', room: '', type: 'break' },
        { time: '10:30 - 11:30', subject: 'Ecology', code: 'ZOO-204', instructor: 'Dr. M. Akram Bhutto', room: 'Room 203', type: 'theory' },
        { time: '11:30 - 12:30', subject: 'Biostatistics', code: 'ZOO-203', instructor: 'Prof. Dr. Zahid Abro', room: 'Room 301', type: 'theory' },
      ],
    },
    {
      day: 'Friday',
      slots: [
        { time: '8:00 - 9:00', subject: 'Biochemistry', code: 'ZOO-202', instructor: 'Dr. Nazia Parveen', room: 'Room 203', type: 'theory' },
        { time: '9:00 - 10:00', subject: 'Ecology', code: 'ZOO-204', instructor: 'Dr. M. Akram Bhutto', room: 'Room 203', type: 'theory' },
        { time: '10:00 - 10:30', subject: 'Break', code: '', instructor: '', room: '', type: 'break' },
        { time: '10:30 - 11:30', subject: 'Biostatistics', code: 'ZOO-203', instructor: 'Prof. Dr. Zahid Abro', room: 'Room 301', type: 'theory' },
        { time: '11:30 - 12:30', subject: 'Free Period', code: '', instructor: '', room: '', type: 'free' },
      ],
    },
  ],
};

const years = Object.keys(timetableData);
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const slotColors: Record<string, { bg: string; text: string; border: string }> = {
  theory: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  practical: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  break: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
  free: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

const Timetable = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showYearDrop, setShowYearDrop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.tt-hero-content', { y: 40, duration: 0.8, ease: 'power3.out', delay: 0.2 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const currentSchedule = timetableData[selectedYear]?.find(d => d.day === selectedDay);

  return (
    <>
      <Helmet>
        <title>Timetable | GDC Larkana - Lecture Schedule</title>
        <meta name="description" content="View the weekly lecture timetable for BS Zoology program at Government Degree College Larkana. Plan your classes." />
        <link rel="canonical" href="https://gdclarkana.edu.pk/timetable" />
      </Helmet>
      <div ref={pageRef} className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="container-custom relative z-10">
            <div className="tt-hero-content">
            <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <span className="text-white/90 font-medium text-sm">Class Schedule</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
              Lecture <span className="text-primary-light">Timetable</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              View the weekly lecture schedule for BS Zoology program. Plan your classes and stay organized.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="container-custom -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Year selector */}
            <div className="relative">
              <button onClick={() => setShowYearDrop(!showYearDrop)}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 font-semibold text-gray-800 hover:border-primary/30 transition-all">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>BS Zoology — {selectedYear}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showYearDrop ? 'rotate-180' : ''}`} />
              </button>
              {showYearDrop && (
                <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[200px] z-30">
                  {years.map(y => (
                    <button key={y} onClick={() => { setSelectedYear(y); setShowYearDrop(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedYear === y ? 'bg-primary/5 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Day tabs */}
            <div className="flex bg-gray-50 rounded-xl p-1 gap-1">
              {days.map(day => (
                <button key={day} onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDay === day ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-white'}`}>
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timetable */}
      <div className="container-custom py-10 pb-20">
        <div className="max-w-4xl">
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">
            {selectedDay}'s Schedule — <span className="text-primary">{selectedYear}</span>
          </h2>

          <div className="space-y-3">
            {currentSchedule?.slots.map((slot, i) => {
              const style = slotColors[slot.type];
              return (
                <div key={i} className={`flex items-stretch gap-4 ${slot.type === 'break' ? 'opacity-60' : ''}`}>
                  {/* Time */}
                  <div className="w-32 flex-shrink-0 flex items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono text-xs">{slot.time}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`flex-1 ${style.bg} border ${style.border} rounded-xl p-4 transition-all hover:shadow-sm`}>
                    {slot.type === 'break' ? (
                      <p className="text-sm text-gray-500 font-medium text-center">☕ Tea Break</p>
                    ) : slot.type === 'free' ? (
                      <p className="text-sm text-amber-600 font-medium text-center">Free Period</p>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-bold text-sm ${style.text}`}>{slot.subject}</h4>
                            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${slot.type === 'practical' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                              {slot.type === 'practical' ? 'Lab' : 'Theory'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-mono">{slot.code}</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{slot.instructor}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{slot.room}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-10 flex flex-wrap gap-4">
            {[
              { label: 'Theory', color: 'bg-blue-100 border-blue-200' },
              { label: 'Practical / Lab', color: 'bg-emerald-100 border-emerald-200' },
              { label: 'Break', color: 'bg-gray-100 border-gray-200' },
              { label: 'Free Period', color: 'bg-amber-100 border-amber-200' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                <div className={`w-4 h-4 rounded border ${item.color}`} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Timetable;
