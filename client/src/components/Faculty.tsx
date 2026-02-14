import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  Sparkles,
  Mail,
  Phone,
  BookOpen,
  Award,
  GraduationCap,
  Search,
  ChevronDown,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FacultyMember {
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  experience: string;
  email: string;
  phone: string;
  department: string;
  image: string;
}

const facultyData: FacultyMember[] = [
  {
    name: 'Prof. Dr. Abdul Sattar Soomro',
    designation: 'Professor & Chairman',
    qualification: 'Ph.D. Zoology (University of Sindh)',
    specialization: 'Entomology & Parasitology',
    experience: '25+ Years',
    email: 'a.sattar@gdclarkana.edu.pk',
    phone: '+92 300 3456789',
    department: 'Zoology',
    image: '',
  },
  {
    name: 'Dr. Nazia Parveen',
    designation: 'Associate Professor',
    qualification: 'Ph.D. Zoology (QAU Islamabad)',
    specialization: 'Cell Biology & Genetics',
    experience: '18+ Years',
    email: 'n.parveen@gdclarkana.edu.pk',
    phone: '+92 301 2345678',
    department: 'Zoology',
    image: '',
  },
  {
    name: 'Dr. Muhammad Akram Bhutto',
    designation: 'Associate Professor',
    qualification: 'Ph.D. Zoology (Shah Abdul Latif University)',
    specialization: 'Wildlife Conservation & Ecology',
    experience: '15+ Years',
    email: 'm.akram@gdclarkana.edu.pk',
    phone: '+92 302 9876543',
    department: 'Zoology',
    image: '',
  },
  {
    name: 'Dr. Rukhsana Kazi',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. Zoology (University of Karachi)',
    specialization: 'Animal Physiology & Anatomy',
    experience: '12+ Years',
    email: 'r.kazi@gdclarkana.edu.pk',
    phone: '+92 303 1122334',
    department: 'Zoology',
    image: '',
  },
  {
    name: 'Mr. Ghulam Mustafa Laghari',
    designation: 'Lecturer',
    qualification: 'M.Phil Zoology (University of Sindh)',
    specialization: 'Marine Biology',
    experience: '8+ Years',
    email: 'g.mustafa@gdclarkana.edu.pk',
    phone: '+92 304 5566778',
    department: 'Zoology',
    image: '',
  },
  {
    name: 'Ms. Sadia Shah',
    designation: 'Lecturer',
    qualification: 'M.Phil Zoology (MUET Jamshoro)',
    specialization: 'Molecular Biology & Biotechnology',
    experience: '6+ Years',
    email: 's.shah@gdclarkana.edu.pk',
    phone: '+92 305 9988776',
    department: 'Zoology',
    image: '',
  },
  {
    name: 'Prof. Dr. Aijaz Ali Khooharo',
    designation: 'Professor',
    qualification: 'Ph.D. Botany (University of Sindh)',
    specialization: 'Plant Taxonomy & Ecology',
    experience: '22+ Years',
    email: 'a.khooharo@gdclarkana.edu.pk',
    phone: '+92 306 1234567',
    department: 'Botany',
    image: '',
  },
  {
    name: 'Dr. Saima Memon',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. Chemistry (QAU Islamabad)',
    specialization: 'Organic Chemistry',
    experience: '10+ Years',
    email: 's.memon@gdclarkana.edu.pk',
    phone: '+92 307 7654321',
    department: 'Chemistry',
    image: '',
  },
  {
    name: 'Dr. Irfan Ali Chandio',
    designation: 'Associate Professor',
    qualification: 'Ph.D. Physics (University of Sindh)',
    specialization: 'Material Science & Nanotechnology',
    experience: '16+ Years',
    email: 'i.chandio@gdclarkana.edu.pk',
    phone: '+92 308 1112233',
    department: 'Physics',
    image: '',
  },
  {
    name: 'Prof. Dr. Zahid Hussain Abro',
    designation: 'Professor',
    qualification: 'Ph.D. Mathematics (University of Karachi)',
    specialization: 'Applied Mathematics & Statistics',
    experience: '20+ Years',
    email: 'z.abro@gdclarkana.edu.pk',
    phone: '+92 309 4455667',
    department: 'Mathematics',
    image: '',
  },
  {
    name: 'Dr. Farzana Baloch',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. English Literature (University of Sindh)',
    specialization: 'Postcolonial Literature',
    experience: '9+ Years',
    email: 'f.baloch@gdclarkana.edu.pk',
    phone: '+92 310 8899001',
    department: 'English',
    image: '',
  },
  {
    name: 'Mr. Ali Hassan Junejo',
    designation: 'Lecturer',
    qualification: 'M.Phil Computer Science (MUET)',
    specialization: 'Data Science & AI',
    experience: '5+ Years',
    email: 'a.junejo@gdclarkana.edu.pk',
    phone: '+92 311 2233445',
    department: 'Computer Science',
    image: '',
  },
];

const departments = ['All', ...Array.from(new Set(facultyData.map(f => f.department)))];

const designationColors: Record<string, string> = {
  'Professor & Chairman': 'from-primary to-rose-600',
  'Professor': 'from-indigo-500 to-blue-600',
  'Associate Professor': 'from-emerald-500 to-teal-600',
  'Assistant Professor': 'from-amber-500 to-orange-600',
  'Lecturer': 'from-violet-500 to-purple-600',
};

const getInitials = (name: string) => {
  return name
    .replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s*/gi, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

const Faculty = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.faculty-hero-content', {
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from('.faculty-stats', {
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faculty-stats-row',
          start: 'top 90%',
        },
      });

      gsap.from('.faculty-card', {
        y: 30,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faculty-grid',
          start: 'top 85%',
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const filtered = facultyData.filter(f => {
    const matchesDept = filter === 'All' || f.department === filter;
    const matchesSearch =
      search === '' ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.specialization.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Faculty | GDC Larkana - Our Teaching Staff</title>
        <meta name="description" content="Meet the experienced faculty members of Government Degree College Larkana's Zoology department and other disciplines." />
        <link rel="canonical" href="https://gdclarkana.edu.pk/faculty" />
      </Helmet>
      <div ref={pageRef} className="min-h-screen bg-gray-50">
        {/* Hero */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        <div className="container-custom relative z-10">
          <div className="faculty-hero-content">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <span className="text-white/90 font-medium text-sm">Our Faculty</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
              Meet Our <span className="text-primary-light">Faculty</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Our dedicated faculty members bring years of academic excellence and research expertise to provide quality education at GDC Larkana.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="container-custom -mt-14 relative z-20">
        <div className="faculty-stats-row grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: GraduationCap, label: 'Total Faculty', value: '80+', gradient: 'from-primary to-rose-600' },
            { icon: Award, label: 'Ph.D. Holders', value: '35+', gradient: 'from-indigo-500 to-blue-600' },
            { icon: BookOpen, label: 'Departments', value: '12+', gradient: 'from-emerald-500 to-teal-600' },
            { icon: Award, label: 'Avg. Experience', value: '14 Yrs', gradient: 'from-amber-500 to-orange-600' },
          ].map((stat, i) => (
            <div key={i} className="faculty-stats bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center gap-4">
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

      {/* Filter & Search */}
      <div className="container-custom pt-12 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialization..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <button
              onClick={() => setShowDeptDropdown(!showDeptDropdown)}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 transition-all"
            >
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span>{filter === 'All' ? 'All Departments' : filter}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDeptDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showDeptDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[200px] z-30">
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => { setFilter(dept); setShowDeptDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${filter === dept ? 'bg-primary/5 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {dept === 'All' ? 'All Departments' : dept}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          Showing <span className="font-semibold text-gray-600">{filtered.length}</span> faculty member{filtered.length !== 1 ? 's' : ''}
          {filter !== 'All' && <span> in <span className="font-semibold text-primary">{filter}</span></span>}
        </p>
      </div>

      {/* Faculty Grid */}
      <div className="container-custom pb-20">
        <div className="faculty-grid grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((member, i) => {
            const gradient = designationColors[member.designation] || 'from-gray-500 to-gray-600';
            return (
              <div
                key={i}
                className="faculty-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                {/* Top Gradient Bar */}
                <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <span className="text-white font-bold text-lg">{getInitials(member.name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{member.name}</h3>
                      <p className={`text-xs font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                        {member.designation}
                      </p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2.5 mb-5 flex-1">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Department</p>
                        <p className="text-sm text-gray-700 font-medium">{member.department}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Specialization</p>
                        <p className="text-sm text-gray-700 font-medium line-clamp-1">{member.specialization}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    <span className="text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
                      {member.experience}
                    </span>
                    <span className="text-[10px] font-medium bg-primary/5 text-primary rounded-full px-2.5 py-1 truncate max-w-[160px]">
                      {member.qualification.split('(')[0].trim()}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 mb-4" />

                  {/* Contact */}
                  <div className="flex items-center gap-3">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-primary/5 rounded-lg py-2 text-xs text-gray-500 hover:text-primary transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                    <a
                      href={`tel:${member.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-primary/5 rounded-lg py-2 text-xs text-gray-500 hover:text-primary transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Faculty Found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Faculty;
