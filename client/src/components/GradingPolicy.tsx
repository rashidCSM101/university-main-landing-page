import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  GraduationCap,
  BookOpen,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Shield,
  FileText,
  Clock,
  Scale,
  Users,
  Ban,
  Eye,
  ClipboardCheck,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ── Grading Tables ── */
const newGrades = [
  { status: 'Pass', grade: 'A+', gp: '4.0', pct: '85–100', designation: 'Very Good' },
  { status: 'Pass', grade: 'A', gp: '3.6', pct: '80–84', designation: '' },
  { status: 'Pass', grade: 'B+', gp: '3.2', pct: '75–79', designation: 'Good' },
  { status: 'Pass', grade: 'B', gp: '2.8', pct: '70–74', designation: '' },
  { status: 'Pass', grade: 'C+', gp: '2.4', pct: '65–69', designation: 'Satisfactory' },
  { status: 'Pass', grade: 'C', gp: '2.0', pct: '60–64', designation: '' },
  { status: 'Improved', grade: 'D+', gp: '1.5', pct: '55–59', designation: 'Conditional Pass' },
  { status: 'Improved', grade: 'D', gp: '1.0', pct: '50–54', designation: '' },
  { status: 'Fail', grade: 'F', gp: '0.0', pct: 'Below 50', designation: 'Fail' },
];

const oldGrades = [
  { grade: 'A', gp: '4', pct: '80–100%', designation: 'Excellent' },
  { grade: 'B', gp: '3', pct: '60–79%', designation: 'Good' },
  { grade: 'C', gp: '2', pct: '50–59%', designation: 'Satisfactory / Average' },
  { grade: 'D', gp: '1', pct: '40–49%', designation: 'Conditional Pass' },
  { grade: 'F', gp: '0', pct: 'Below 40%', designation: 'Fail' },
];

const termsLaps = [
  { no: '01', prog: '01 Year / PGD', actual: '01 Year', extra: '02 Years', total: '03 Years' },
  { no: '02', prog: '1.5 Years (B.Ed. Secondary)', actual: '1.5 Years', extra: '02 Years', total: '3.5 Years' },
  { no: '03', prog: '2.5 Years (B.Ed. Secondary)', actual: '2.5 Years', extra: '03 Years', total: '5.5 Years' },
  { no: '04', prog: '02 Years (MA/MSc/MBA etc.)', actual: '02 Years', extra: '03 Years', total: '05 Years' },
  { no: '05', prog: '04 Years (BS/BBA etc.)', actual: '04 Years', extra: '03 Years', total: '07 Years' },
  { no: '06', prog: '05 Years (Pharm-D/LLB etc.)', actual: '05 Years', extra: '03 Years', total: '08 Years' },
];

/* ── Section definitions ── */
const sections = [
  {
    id: 'grading-policy',
    icon: GraduationCap,
    title: 'Grading Policy',
    color: 'from-primary/10 to-rose-50',
    border: 'border-primary/20',
    items: [
      'The grading / marking system in the university will be the Absolute Grading System. Nevertheless, teachers are encouraged to adopt the Relative Grading System as suggested by HEC.',
      'To implement the semester system effectively, the subject teacher must display his/her provisional result within five (05) days after the conduct of the final exam of that subject and submit the same to the Controller of Examination for the final announcement.',
    ],
  },
  {
    id: 'gpa-cgpa',
    icon: Calculator,
    title: 'GPA & CGPA Computation',
    color: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    items: [
      'Quality Point (Q.P.) is determined by multiplying the Grade Point (G.P.) earned by the student with the Credit Hours of that course. Example: If a student obtains a "B+" grade for a 3 credit-hour course then Q.P. = 3.2 × 3 = 9.60',
      'Grade Point Average (G.P.A) = Sum of Quality Points ÷ Sum of Credit Hours (for a particular semester).',
      'Cumulative Grade Point Average (C.G.P.A) = Sum of Quality Points for all courses appeared ÷ Sum of Credit Hours for all courses appeared.',
    ],
  },
  {
    id: 'cgpa-requirement',
    icon: CheckCircle2,
    title: 'CGPA Requirements for Degree Completion',
    color: 'from-emerald-50 to-green-50',
    border: 'border-emerald-200',
    items: [
      'Minimum qualifying CGPA for undergraduate programmes (BA/BS/MSc): 2.00',
      'Minimum qualifying CGPA for postgraduate programmes (MS/MPhil/PhD): 2.50',
      'If a student secures less than 2.00 CGPA at the end of the final semester, s/he may be allowed to improve in one or more courses where grade is below "C" along with the forthcoming semester, provided s/he is not debarred under CGPA Improvement Regulation.',
    ],
  },
  {
    id: 'promotion',
    icon: ArrowRight,
    title: 'Rules for Promotion',
    color: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    items: [
      'Promotion from 1st → 2nd, 3rd → 4th, or 5th → 6th semester is automatic; student must meet attendance requirements.',
      'For promotion from 2nd → 3rd semester, a student must have minimum attendance and a G.P.A. of 1.75 or above in the preceding two semesters.',
      'Failure to meet attendance requirements results in a 10% grade penalty, announced by each instructor at the beginning of the semester.',
      'Students with below 1.75 C.G.P.A. in preceding two semesters will be promoted conditionally (on probation). If they fail to qualify, admission shall be cancelled.',
      'Students whose admission is cancelled cannot enrol for at least one semester.',
    ],
  },
  {
    id: 'repeating',
    icon: BookOpen,
    title: 'Repeating Courses',
    color: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
    items: [
      'If a student fails or gets a "D" grade, s/he can reappear at the immediate next session when the examination is conducted.',
      'For students failing in the terminal semester (e.g., 8th semester of BS), the chairperson/director may arrange examination during summer vacation.',
      'A student is allowed only one chance to improve grades in a course of a previous semester.',
      'If a student absents himself/herself in a test, no separate test will be held during the semester.',
    ],
  },
  {
    id: 'credit-transfer',
    icon: FileText,
    title: 'Transfer of Credit Hours',
    color: 'from-sky-50 to-cyan-50',
    border: 'border-sky-200',
    items: [
      'Credits are transferred on a course-to-course basis between equivalent courses at recognized institutions.',
      'No credit hour will be transferred if the grade is less than "C" for undergraduate and "B" for graduate programmes.',
      'Credit hours may only be transferred between duly recognized HEIs and internationally recognized universities as recommended by HEC.',
      'Final decision is taken by the Departmental Committee.',
    ],
  },
  {
    id: 'degree-award',
    icon: Shield,
    title: 'Requirements for Award of Degree',
    color: 'from-teal-50 to-emerald-50',
    border: 'border-teal-200',
    items: [
      'Undergraduate: Must earn a minimum of 60 credit hours out of 124–140 total from the institution awarding the degree.',
      'MS/MPhil: Must earn a minimum of 15 credit hours from the HEI awarding the degree.',
    ],
  },
  {
    id: 'grievances',
    icon: Scale,
    title: 'Student Grievances Against Course Instructor',
    color: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
    items: [
      'A five-member Committee (02 senior faculty, Head of Department, Dean, and Controller of Examinations) redresses grievances about any course instructor or grades.',
      'Student must submit grievance application in writing within 07 working days of receipt of grade.',
      'Committee must hear both sides and give final decision within 05 working days or before new semester registration.',
      'A departmental committee will randomly check answer papers for uniformity of scoring and course content coverage.',
    ],
  },
  {
    id: 'pass-fail',
    icon: ClipboardCheck,
    title: 'Courses on Pass/Fail Basis',
    color: 'from-lime-50 to-green-50',
    border: 'border-lime-200',
    items: [
      'Elective courses can be taken on a pass/fail basis.',
      'Grades of pass/fail courses are not considered in GPA or CGPA calculation.',
      'Maximum 9 credit hours can be taken on pass/fail basis at undergraduate level.',
    ],
  },
  {
    id: 'cancellation',
    icon: Ban,
    title: 'Cancellation of Enrolment',
    color: 'from-red-50 to-rose-50',
    border: 'border-red-200',
    items: [
      'If a student fails to attend any lecture during the first four weeks after commencement, admission is cancelled automatically.',
      'If a student promoted conditionally fails to qualify courses by end of semester, admission is cancelled.',
    ],
  },
  {
    id: 'special-students',
    icon: Users,
    title: 'Permission of Writer for Special Students',
    color: 'from-indigo-50 to-blue-50',
    border: 'border-indigo-200',
    items: [
      'Visually impaired students may attempt exams on Braille/Computer or any facilitation means.',
      'Physically handicapped/visually impaired students may apply for a writer with a medical certificate, two weeks before exams.',
      'Extra time of 45 minutes (maximum) is allowed.',
      'The writer\'s qualification must be at least one step lower than that of the student.',
    ],
  },
  {
    id: 'rechecking',
    icon: Eye,
    title: 'Rechecking of Examination Script',
    color: 'from-gray-50 to-slate-50',
    border: 'border-gray-200',
    items: [
      'Answer books shall not be re-assessed. Rechecking covers only computational errors, totalling, and ensuring all answers are marked.',
      'A candidate or anyone on their behalf has no right to see or examine the answer books.',
      'Marks may decrease if errors are found; record shall be corrected accordingly and a revised transcript issued.',
    ],
  },
];

const statusColors: Record<string, string> = {
  Pass: 'bg-emerald-100 text-emerald-700',
  Improved: 'bg-amber-100 text-amber-700',
  Fail: 'bg-red-100 text-red-700',
};

const GradingPolicy = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.gp-hero-content', { y: 40, duration: 0.8, ease: 'power3.out', delay: 0.2 });
      gsap.from('.gp-section', {
        y: 30, duration: 0.6, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: '.gp-wrapper', start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Grading Policy | GDC Larkana</title>
        <meta name="description" content="Grading Policy of Government Degree College Larkana — fractionalized grading system, GPA/CGPA computation, promotion rules, credit transfer, and term lapse policies as per HEC guidelines." />
        <link rel="canonical" href="https://gdclarkana.edu.pk/grading-policy" />
      </Helmet>

      <div ref={pageRef} className="min-h-screen bg-gray-50">
        {/* ═══ HERO ═══ */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          <div className="container-custom relative z-10">
            <div className="gp-hero-content">
              <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>

              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
                <GraduationCap className="w-4 h-4 text-accent-gold" />
                <span className="text-white/90 font-medium text-sm">Academic Affairs</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
                Grading <span className="text-primary-light">Policy</span>
              </h1>
              <p className="text-lg text-white/70 max-w-2xl">
                Comprehensive grading framework, GPA/CGPA computation, promotion rules, and academic regulations as per HEC guidelines.
              </p>
              <p className="text-sm text-white/40 mt-4">Effective from Academic Year 2021 (2K21-Batch) &amp; Onwards</p>
            </div>
          </div>
        </div>

        {/* ═══ CONTENT ═══ */}
        <div className="gp-wrapper container-custom py-16">
          <div className="max-w-5xl mx-auto space-y-12">

            {/* ── Quick Navigation ── */}
            <div className="gp-section bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Quick Navigation
              </h2>
              <div className="flex flex-wrap gap-2">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-primary hover:text-white rounded-full px-4 py-2 transition-colors">
                    {s.title}
                  </a>
                ))}
                <a href="#new-grading-table" className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-primary hover:text-white rounded-full px-4 py-2 transition-colors">
                  2K21 Grading Table
                </a>
                <a href="#old-grading-table" className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-primary hover:text-white rounded-full px-4 py-2 transition-colors">
                  2K20 &amp; Old Batches
                </a>
                <a href="#terms-laps" className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-primary hover:text-white rounded-full px-4 py-2 transition-colors">
                  Terms Laps Policy
                </a>
              </div>
            </div>

            {/* ── Grading Policy & GPA Section ── */}
            {sections.slice(0, 2).map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.id} id={s.id} className={`gp-section bg-gradient-to-br ${s.color} rounded-2xl p-6 md:p-8 shadow-sm border ${s.border}`}>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></span>
                    {s.title}
                  </h2>
                  <ul className="space-y-3">
                    {s.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">{String.fromCharCode(97 + i)}</span>
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* ── NEW Fractionalized Grading Table (2K21+) ── */}
            <div id="new-grading-table" className="gp-section bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-rose-600 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-white" /></span>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900">Fractionalized Grading Scheme</h2>
                  <p className="text-sm text-gray-500">Applicable from 2K21-Batch &amp; Onwards</p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-center font-semibold">Grade</th>
                      <th className="px-4 py-3 text-center font-semibold">Grade Points</th>
                      <th className="px-4 py-3 text-center font-semibold">Percentage</th>
                      <th className="px-4 py-3 text-left font-semibold">Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newGrades.map((g, i) => (
                      <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-primary/5 transition-colors`}>
                        <td className="px-4 py-3">
                          {g.status && <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[g.status] || ''}`}>{g.status}</span>}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-gray-900 text-base">{g.grade}</td>
                        <td className="px-4 py-3 text-center font-semibold text-primary">{g.gp}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{g.pct}</td>
                        <td className="px-4 py-3 text-gray-600">{g.designation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Remaining Policy Sections ── */}
            {sections.slice(2).map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.id} id={s.id} className={`gp-section bg-gradient-to-br ${s.color} rounded-2xl p-6 md:p-8 shadow-sm border ${s.border}`}>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></span>
                    {s.title}
                  </h2>
                  <ul className="space-y-3">
                    {s.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">{String.fromCharCode(97 + i)}</span>
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* ── Terms Laps Policy Table ── */}
            <div id="terms-laps" className="gp-section bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"><Clock className="w-5 h-5 text-white" /></span>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900">Terms Laps Policy</h2>
                  <p className="text-sm text-gray-500">Effective from 2K22-Batch &amp; Onwards</p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                      <th className="px-4 py-3 text-center font-semibold">S#</th>
                      <th className="px-4 py-3 text-left font-semibold">Degree Programme</th>
                      <th className="px-4 py-3 text-center font-semibold">Actual Period</th>
                      <th className="px-4 py-3 text-center font-semibold">Additional</th>
                      <th className="px-4 py-3 text-center font-semibold">Total (Max)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {termsLaps.map((r, i) => (
                      <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-amber-50/50 transition-colors`}>
                        <td className="px-4 py-3 text-center font-bold text-gray-500">{r.no}</td>
                        <td className="px-4 py-3 text-gray-800 font-medium">{r.prog}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{r.actual}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{r.extra}</td>
                        <td className="px-4 py-3 text-center font-bold text-primary">{r.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 space-y-2 bg-amber-50 rounded-xl p-5 border border-amber-100">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800">Students must complete their degree within the specified period (Total column) otherwise their terms will be lapsed.</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800">This policy is also applicable for readmission cases effective from their admission in Part-1 (Resolved in 42nd meeting of the Academic Council).</p>
                </div>
              </div>
            </div>

            {/* ── OLD Grading Table (2K20 & Older) ── */}
            <div id="old-grading-table" className="gp-section bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center"><BookOpen className="w-5 h-5 text-white" /></span>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900">Grading Policy — 2K20 &amp; Old Batches</h2>
                  <p className="text-sm text-gray-500">For students admitted before 2021</p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-700 to-gray-600 text-white">
                      <th className="px-4 py-3 text-center font-semibold">Grade</th>
                      <th className="px-4 py-3 text-center font-semibold">Grade Points</th>
                      <th className="px-4 py-3 text-center font-semibold">Percentage</th>
                      <th className="px-4 py-3 text-left font-semibold">Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oldGrades.map((g, i) => (
                      <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/50 transition-colors`}>
                        <td className="px-4 py-3 text-center font-bold text-gray-900 text-base">{g.grade}</td>
                        <td className="px-4 py-3 text-center font-semibold text-gray-700">{g.gp}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{g.pct}</td>
                        <td className="px-4 py-3 text-gray-600">{g.designation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── CTA ── */}
            <div className="gp-section text-center pt-4">
              <Link to="/" className="btn-primary group inline-flex">
                <span>Back to Home</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GradingPolicy;
