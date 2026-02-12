import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  Sparkles,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  CreditCard,
  GraduationCap,
  ClipboardList,
  Users,
  ArrowRight,
  BookOpen,
  Download,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const admissionSteps = [
  {
    step: 1,
    title: 'Check Eligibility',
    description: 'Verify you meet the minimum academic requirements for your chosen program.',
    icon: CheckCircle2,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    step: 2,
    title: 'Collect Admission Form',
    description: 'Obtain the admission form from the college office or download from the website.',
    icon: FileText,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    step: 3,
    title: 'Submit Documents',
    description: 'Submit the completed form along with all required documents to the admission office.',
    icon: ClipboardList,
    gradient: 'from-primary to-rose-600',
  },
  {
    step: 4,
    title: 'Merit List & Interview',
    description: 'Wait for the merit list announcement. Selected candidates may be called for an interview.',
    icon: Users,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    step: 5,
    title: 'Fee Payment & Enrollment',
    description: 'Deposit the admission fee and complete the enrollment process at the accounts office.',
    icon: CreditCard,
    gradient: 'from-violet-500 to-purple-600',
  },
];

const eligibilityCriteria = [
  {
    program: 'BS Zoology (4 Years)',
    criteria: [
      'Intermediate (HSSC) with Biology group — minimum 45% marks',
      'Domicile of Sindh Province',
      'Age limit: 17-22 years at the time of admission',
      'Character certificate from last institution attended',
    ],
    seats: 60,
    duration: '4 Years (8 Semesters)',
  },
  {
    program: 'BS Botany (4 Years)',
    criteria: [
      'Intermediate (HSSC) with Biology group — minimum 45% marks',
      'Domicile of Sindh Province',
      'Age limit: 17-22 years',
      'Character certificate from last institution',
    ],
    seats: 50,
    duration: '4 Years (8 Semesters)',
  },
  {
    program: 'BS Chemistry (4 Years)',
    criteria: [
      'Intermediate (HSSC) with Pre-Engineering or Pre-Medical — minimum 45% marks',
      'Domicile of Sindh Province',
      'Age limit: 17-22 years',
      'Character certificate from last institution',
    ],
    seats: 50,
    duration: '4 Years (8 Semesters)',
  },
  {
    program: 'Intermediate (Pre-Medical)',
    criteria: [
      'Matric (SSC) with Science group — minimum 33% marks',
      'Domicile of Sindh Province',
      'Age limit: 15-19 years',
      'School leaving certificate',
    ],
    seats: 120,
    duration: '2 Years',
  },
];

const requiredDocuments = [
  'Matric / Intermediate Mark Sheet & Certificate (Original + 2 copies)',
  'Character Certificate from last institution',
  'Domicile Certificate (Sindh)',
  'CNIC / B-Form (Original + 2 copies)',
  "Father's / Guardian's CNIC (2 copies)",
  '6 Recent Passport Size Photographs',
  'Migration Certificate (if from other board)',
  'Admission Form (duly filled & signed)',
];

const feeStructure = [
  { item: 'Admission Fee', bs: 'Rs. 5,000', inter: 'Rs. 3,000' },
  { item: 'Tuition Fee (per semester)', bs: 'Rs. 8,000', inter: 'Rs. 4,000' },
  { item: 'Lab Fee', bs: 'Rs. 3,000', inter: 'Rs. 1,500' },
  { item: 'Library Fee', bs: 'Rs. 1,000', inter: 'Rs. 500' },
  { item: 'Examination Fee', bs: 'Rs. 2,000', inter: 'Rs. 1,000' },
  { item: 'Sports Fee', bs: 'Rs. 500', inter: 'Rs. 500' },
  { item: 'Magazine Fee', bs: 'Rs. 300', inter: 'Rs. 300' },
  { item: 'Total (Approx.)', bs: 'Rs. 19,800', inter: 'Rs. 10,800' },
];

const importantDates = [
  { event: 'Admission Forms Available', date: 'July 1, 2026', status: 'upcoming' },
  { event: 'Last Date for Form Submission', date: 'August 15, 2026', status: 'upcoming' },
  { event: '1st Merit List', date: 'August 25, 2026', status: 'upcoming' },
  { event: '2nd Merit List', date: 'September 1, 2026', status: 'upcoming' },
  { event: 'Classes Start', date: 'September 15, 2026', status: 'upcoming' },
  { event: 'Last Date for Fee Deposit', date: 'September 20, 2026', status: 'upcoming' },
];

const Admissions = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [openProgram, setOpenProgram] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.adm-hero-content', { y: 40, duration: 0.8, ease: 'power3.out', delay: 0.2 });
      gsap.from('.adm-section', {
        y: 40, duration: 0.7, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.adm-sections-wrap', start: 'top 85%' },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="container-custom relative z-10">
          <div className="adm-hero-content">
            <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <span className="text-white/90 font-medium text-sm">Admissions 2026-27</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
              Admissions <span className="text-primary-light">Open</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Begin your academic journey at Government Degree College Larkana. Find everything about the admission process, eligibility, fees, and important dates.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container-custom -mt-14 relative z-20">
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { icon: GraduationCap, label: 'Programs', value: '15+', gradient: 'from-primary to-rose-600' },
            { icon: Users, label: 'Total Seats', value: '280+', gradient: 'from-indigo-500 to-blue-600' },
            { icon: Calendar, label: 'Session', value: '2026-27', gradient: 'from-emerald-500 to-teal-600' },
            { icon: CreditCard, label: 'Starts From', value: 'Rs.10,800', gradient: 'from-amber-500 to-orange-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="adm-sections-wrap container-custom py-16 space-y-16">
        {/* Admission Process Steps */}
        <div className="adm-section">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-4">
            <ClipboardList className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-semibold text-xs uppercase tracking-wider">Admission Process</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-8">
            How to <span className="text-primary">Apply</span>
          </h2>

          <div className="grid md:grid-cols-5 gap-4">
            {admissionSteps.map((s, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className={`h-1 bg-gradient-to-r ${s.gradient} rounded-t-2xl absolute top-0 left-0 right-0`} />
                <div className="flex items-center gap-3 mb-4 mt-1">
                  <div className={`w-10 h-10 bg-gradient-to-br ${s.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-gray-100 font-heading">0{s.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
                {i < admissionSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 z-10">
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="adm-section">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-4">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-semibold text-xs uppercase tracking-wider">Eligibility</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-8">
            Eligibility <span className="text-primary">Criteria</span>
          </h2>

          <div className="space-y-3 max-w-3xl">
            {eligibilityCriteria.map((prog, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => setOpenProgram(openProgram === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{prog.program}</h3>
                      <p className="text-xs text-gray-500">{prog.seats} Seats • {prog.duration}</p>
                    </div>
                  </div>
                  {openProgram === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {openProgram === i && (
                  <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                    <ul className="space-y-2 mt-3">
                      {prog.criteria.map((c, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents */}
        <div className="adm-section">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-4">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-semibold text-xs uppercase tracking-wider">Documents</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-8">
            Required <span className="text-primary">Documents</span>
          </h2>

          <div className="max-w-3xl grid sm:grid-cols-2 gap-3">
            {requiredDocuments.map((doc, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-sm text-gray-700">{doc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Structure */}
        <div className="adm-section">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-4">
            <CreditCard className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-semibold text-xs uppercase tracking-wider">Fee Structure</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-8">
            Fee <span className="text-primary">Structure</span>
          </h2>

          <div className="max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee Item</th>
                  <th className="text-center py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">BS Programs</th>
                  <th className="text-center py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Intermediate</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-50 ${i === feeStructure.length - 1 ? 'bg-primary/5 font-bold' : 'hover:bg-gray-50'}`}>
                    <td className="py-3 px-5 text-sm text-gray-700">{row.item}</td>
                    <td className="py-3 px-5 text-sm text-gray-900 text-center">{row.bs}</td>
                    <td className="py-3 px-5 text-sm text-gray-900 text-center">{row.inter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3 max-w-3xl">* Fee structure is approximate and subject to change. Contact the accounts office for exact figures.</p>
        </div>

        {/* Important Dates */}
        <div className="adm-section">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-4">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-semibold text-xs uppercase tracking-wider">Important Dates</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-8">
            Key <span className="text-primary">Dates</span>
          </h2>

          <div className="max-w-3xl space-y-3">
            {importantDates.map((d, i) => (
              <div key={i} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{d.event}</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{d.date}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Download & CTA */}
        <div className="adm-section bg-gradient-to-br from-gray-900 to-primary-dark rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-heading font-bold text-white mb-2">Ready to Apply?</h3>
              <p className="text-white/60 text-sm">Download the admission form or visit the college admission office.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm">
                <Download className="w-4 h-4" />
                <span>Download Form</span>
              </a>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors text-sm">
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admissions;
