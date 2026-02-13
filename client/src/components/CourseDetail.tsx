import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  GraduationCap,
  ChevronDown,
  FlaskConical,
  Microscope,
  Bug,
  Dna,
  Sparkles,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Subject {
  name: string;
  code: string;
  credits: number;
  type: 'Theory' | 'Practical' | 'Theory + Practical';
}

interface Semester {
  semester: number;
  subjects: Subject[];
}

interface YearData {
  year: number;
  title: string;
  semesters: Semester[];
}

// Zoology Course Data - 4 Years (8 Semesters)
const zoologyCourseData: YearData[] = [
  {
    year: 1,
    title: 'First Year',
    semesters: [
      {
        semester: 1,
        subjects: [
          { name: 'Cell Biology', code: 'ZOO-101', credits: 3, type: 'Theory + Practical' },
          { name: 'Biodiversity (Invertebrates-I)', code: 'ZOO-102', credits: 3, type: 'Theory + Practical' },
          { name: 'Biostatistics', code: 'ZOO-103', credits: 3, type: 'Theory' },
          { name: 'Biochemistry-I', code: 'ZOO-104', credits: 3, type: 'Theory + Practical' },
          { name: 'English-I (Functional English)', code: 'ENG-101', credits: 3, type: 'Theory' },
          { name: 'Pakistan Studies', code: 'PST-101', credits: 2, type: 'Theory' },
        ],
      },
      {
        semester: 2,
        subjects: [
          { name: 'Genetics', code: 'ZOO-105', credits: 3, type: 'Theory + Practical' },
          { name: 'Biodiversity (Invertebrates-II)', code: 'ZOO-106', credits: 3, type: 'Theory + Practical' },
          { name: 'Biochemistry-II', code: 'ZOO-107', credits: 3, type: 'Theory + Practical' },
          { name: 'Introduction to Ecology', code: 'ZOO-108', credits: 3, type: 'Theory' },
          { name: 'English-II (Communication Skills)', code: 'ENG-102', credits: 3, type: 'Theory' },
          { name: 'Islamic Studies / Ethics', code: 'ISL-101', credits: 2, type: 'Theory' },
        ],
      },
    ],
  },
  {
    year: 2,
    title: 'Second Year',
    semesters: [
      {
        semester: 3,
        subjects: [
          { name: 'Biodiversity (Vertebrates-I)', code: 'ZOO-201', credits: 3, type: 'Theory + Practical' },
          { name: 'Animal Physiology-I', code: 'ZOO-202', credits: 3, type: 'Theory + Practical' },
          { name: 'Developmental Biology', code: 'ZOO-203', credits: 3, type: 'Theory + Practical' },
          { name: 'Molecular Biology', code: 'ZOO-204', credits: 3, type: 'Theory' },
          { name: 'English-III (Technical Writing)', code: 'ENG-201', credits: 3, type: 'Theory' },
          { name: 'Introduction to Computer', code: 'CSC-201', credits: 3, type: 'Theory + Practical' },
        ],
      },
      {
        semester: 4,
        subjects: [
          { name: 'Biodiversity (Vertebrates-II)', code: 'ZOO-205', credits: 3, type: 'Theory + Practical' },
          { name: 'Animal Physiology-II', code: 'ZOO-206', credits: 3, type: 'Theory + Practical' },
          { name: 'Histology', code: 'ZOO-207', credits: 3, type: 'Theory + Practical' },
          { name: 'Evolution', code: 'ZOO-208', credits: 3, type: 'Theory' },
          { name: 'Environmental Biology', code: 'ZOO-209', credits: 3, type: 'Theory' },
          { name: 'Introduction to Psychology', code: 'PSY-201', credits: 2, type: 'Theory' },
        ],
      },
    ],
  },
  {
    year: 3,
    title: 'Third Year',
    semesters: [
      {
        semester: 5,
        subjects: [
          { name: 'Entomology', code: 'ZOO-301', credits: 3, type: 'Theory + Practical' },
          { name: 'Parasitology', code: 'ZOO-302', credits: 3, type: 'Theory + Practical' },
          { name: 'Animal Behaviour', code: 'ZOO-303', credits: 3, type: 'Theory' },
          { name: 'Comparative Anatomy', code: 'ZOO-304', credits: 3, type: 'Theory + Practical' },
          { name: 'Wildlife Conservation', code: 'ZOO-305', credits: 3, type: 'Theory' },
          { name: 'Research Methodology', code: 'ZOO-306', credits: 3, type: 'Theory' },
        ],
      },
      {
        semester: 6,
        subjects: [
          { name: 'Microbiology', code: 'ZOO-307', credits: 3, type: 'Theory + Practical' },
          { name: 'Immunology', code: 'ZOO-308', credits: 3, type: 'Theory + Practical' },
          { name: 'Fish Biology & Fisheries', code: 'ZOO-309', credits: 3, type: 'Theory + Practical' },
          { name: 'Biogeography', code: 'ZOO-310', credits: 3, type: 'Theory' },
          { name: 'Bioinformatics', code: 'ZOO-311', credits: 3, type: 'Theory + Practical' },
          { name: 'Seminar / Presentation', code: 'ZOO-312', credits: 1, type: 'Practical' },
        ],
      },
    ],
  },
  {
    year: 4,
    title: 'Fourth Year',
    semesters: [
      {
        semester: 7,
        subjects: [
          { name: 'Endocrinology', code: 'ZOO-401', credits: 3, type: 'Theory + Practical' },
          { name: 'Toxicology', code: 'ZOO-402', credits: 3, type: 'Theory + Practical' },
          { name: 'Marine Biology', code: 'ZOO-403', credits: 3, type: 'Theory' },
          { name: 'Biotechnology', code: 'ZOO-404', credits: 3, type: 'Theory + Practical' },
          { name: 'Zoogeography of Pakistan', code: 'ZOO-405', credits: 3, type: 'Theory' },
          { name: 'Research Project-I', code: 'ZOO-406', credits: 3, type: 'Practical' },
        ],
      },
      {
        semester: 8,
        subjects: [
          { name: 'Freshwater Biology', code: 'ZOO-407', credits: 3, type: 'Theory + Practical' },
          { name: 'Medical Zoology', code: 'ZOO-408', credits: 3, type: 'Theory' },
          { name: 'Economic Zoology', code: 'ZOO-409', credits: 3, type: 'Theory' },
          { name: 'Advanced Genetics & Genomics', code: 'ZOO-410', credits: 3, type: 'Theory + Practical' },
          { name: 'Conservation Biology', code: 'ZOO-411', credits: 3, type: 'Theory' },
          { name: 'Research Project-II', code: 'ZOO-412', credits: 3, type: 'Practical' },
        ],
      },
    ],
  },
];

const yearIcons = [Dna, Microscope, Bug, FlaskConical];
const yearColors = [
  { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', ring: 'ring-blue-500/20' },
  { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', ring: 'ring-emerald-500/20' },
  { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', ring: 'ring-amber-500/20' },
  { gradient: 'from-primary to-rose-600', bg: 'bg-red-50', text: 'text-primary', border: 'border-red-200', ring: 'ring-primary/20' },
];

const typeColors: Record<string, string> = {
  'Theory': 'bg-blue-100 text-blue-700',
  'Practical': 'bg-green-100 text-green-700',
  'Theory + Practical': 'bg-purple-100 text-purple-700',
};

const CourseDetail = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [openYear, setOpenYear] = useState<number>(1);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.course-hero-content', {
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from('.year-accordion', {
        y: 30,
        scale: 0.98,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.4,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const toggleYear = (year: number) => {
    setOpenYear(openYear === year ? 0 : year);
  };

  const getTotalCredits = (semesters: Semester[]) => {
    return semesters.reduce(
      (total, sem) => total + sem.subjects.reduce((s, sub) => s + sub.credits, 0),
      0
    );
  };

  const getTotalSubjects = (semesters: Semester[]) => {
    return semesters.reduce((total, sem) => total + sem.subjects.length, 0);
  };

  return (
    <>
      <Helmet>
        <title>BS Zoology Program | GDC Larkana</title>
        <meta name="description" content="Explore the BS Zoology program at Government Degree College Larkana. Complete curriculum, learning objectives, and career prospects." />
        <link rel="canonical" href="https://gdclarkana.edu.pk/course/zoology" />
      </Helmet>
      <div ref={pageRef} className="min-h-screen bg-gray-50">
        {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}></div>

        <div className="container-custom relative z-10">
          <div className="course-hero-content">
            {/* Back Button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <span className="text-white/90 font-medium text-sm">BS Zoology Program</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
              Zoology <span className="text-primary-light">Course Outline</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mb-10">
              Complete 4-year BS Zoology degree program at Government Degree College Larkana.
              Explore semester-wise courses, credit hours, and subjects.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Clock, label: 'Duration', value: '4 Years' },
                { icon: BookOpen, label: 'Total Semesters', value: '8' },
                { icon: GraduationCap, label: 'Total Credit Hours', value: '140+' },
                { icon: FlaskConical, label: 'Practicals Included', value: 'Yes' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary-light" />
                  </div>
                  <div>
                    <div className="text-xs text-white/50">{stat.label}</div>
                    <div className="text-white font-semibold">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container-custom py-16">
        <div className="max-w-5xl mx-auto">
          {/* Year Accordions */}
          {zoologyCourseData.map((yearData, yearIndex) => {
            const isOpen = openYear === yearData.year;
            const colors = yearColors[yearIndex];
            const YearIcon = yearIcons[yearIndex];

            return (
              <div key={yearData.year} className="year-accordion mb-6">
                {/* Year Header */}
                <button
                  onClick={() => toggleYear(yearData.year)}
                  className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all duration-300 ${
                    isOpen
                      ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg`
                      : 'bg-white hover:shadow-md border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      isOpen ? 'bg-white/20' : `${colors.bg}`
                    }`}>
                      <YearIcon className={`w-7 h-7 ${isOpen ? 'text-white' : colors.text}`} />
                    </div>
                    <div className="text-left">
                      <h3 className={`text-xl font-bold ${isOpen ? 'text-white' : 'text-gray-900'}`}>
                        {yearData.title}
                      </h3>
                      <p className={`text-sm ${isOpen ? 'text-white/80' : 'text-gray-500'}`}>
                        {getTotalSubjects(yearData.semesters)} Subjects &middot; {getTotalCredits(yearData.semesters)} Credit Hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      isOpen ? 'bg-white/20 text-white' : `${colors.bg} ${colors.text}`
                    }`}>
                      2 Semesters
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-white' : 'text-gray-400'
                    }`} />
                  </div>
                </button>

                {/* Semester Content */}
                {isOpen && (
                  <div className="mt-4 space-y-6 animate-in">
                    {yearData.semesters.map((sem) => (
                      <div key={sem.semester} className={`bg-white rounded-2xl border ${colors.border} overflow-hidden`}>
                        {/* Semester Header */}
                        <div className={`${colors.bg} px-6 py-4 flex items-center justify-between`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 bg-gradient-to-br ${colors.gradient} rounded-lg flex items-center justify-center`}>
                              <span className="text-white text-sm font-bold">{sem.semester}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">Semester {sem.semester}</h4>
                              <p className="text-xs text-gray-500">
                                {sem.subjects.length} subjects &middot;{' '}
                                {sem.subjects.reduce((t, s) => t + s.credits, 0)} credit hours
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Subjects Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Course Code</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject Name</th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Credits</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sem.subjects.map((subject, subIndex) => (
                                <tr
                                  key={subIndex}
                                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                                >
                                  <td className="px-6 py-4">
                                    <span className="text-sm text-gray-400 font-medium">{String(subIndex + 1).padStart(2, '0')}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`text-sm font-mono font-semibold ${colors.text}`}>
                                      {subject.code}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-800">{subject.name}</span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg text-sm font-bold text-gray-700">
                                      {subject.credits}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${typeColors[subject.type]}`}>
                                      {subject.type}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className={`${colors.bg}`}>
                                <td colSpan={3} className="px-6 py-3 text-sm font-bold text-gray-700">Total Credit Hours</td>
                                <td className="px-6 py-3 text-center">
                                  <span className={`inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br ${colors.gradient} rounded-lg text-sm font-bold text-white`}>
                                    {sem.subjects.reduce((t, s) => t + s.credits, 0)}
                                  </span>
                                </td>
                                <td></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Info */}
          <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  BS Zoology - Government Degree College Larkana
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  This is a 4-year (8 semesters) undergraduate program. Students must complete all
                  required courses along with research projects in the final year. The program
                  includes both theoretical and practical components to provide comprehensive
                  knowledge in Zoological Sciences.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {['Cell Biology', 'Genetics', 'Ecology', 'Parasitology', 'Marine Biology', 'Biotechnology'].map((tag) => (
                    <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CourseDetail;
