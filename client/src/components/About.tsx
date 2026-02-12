import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Target,
  Eye,
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.about-hero-content', {
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from('.about-section', {
        y: 40,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-sections-wrapper',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const milestones = [
    { year: '1960', title: 'College Founded', desc: 'Government Degree College Larkana was established to provide quality education in Sindh.' },
    { year: '1985', title: 'Science Faculty Added', desc: 'Introduction of BSc programs including Zoology, Botany, and Chemistry departments.' },
    { year: '2005', title: 'Modern Labs Built', desc: 'State-of-the-art science laboratories were constructed for practical learning.' },
    { year: '2015', title: '4-Year BS Programs', desc: 'HEC-affiliated 4-year BS degree programs launched across departments.' },
    { year: '2024', title: 'Digital Campus', desc: 'Smart classrooms and digital learning resources introduced campus-wide.' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide accessible, quality education that empowers students from Larkana and beyond to become knowledgeable, skilled, and responsible citizens contributing to national development.',
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be a leading public sector educational institution in Sindh, recognized for academic excellence, research contributions, and producing graduates who make a positive impact in society.',
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'We uphold integrity, inclusivity, and innovation. We believe in equal opportunity for all students regardless of background, fostering a supportive and progressive learning environment.',
      gradient: 'from-primary to-rose-600',
      bg: 'bg-red-50',
    },
  ];

  const stats = [
    { value: '60+', label: 'Years of Excellence', icon: Award },
    { value: '5000+', label: 'Alumni Network', icon: Users },
    { value: '50+', label: 'Expert Faculty', icon: GraduationCap },
    { value: '15+', label: 'Departments', icon: BookOpen },
  ];

  const facilities = [
    'Well-equipped Zoology Laboratory',
    'Digital Library & Reading Room',
    'Computer Lab with Internet Access',
    'Botanical Garden & Specimen Museum',
    'Sports Ground & Indoor Games',
    'Seminar Hall & Auditorium',
    'Student Common Room',
    'Cafeteria & Canteen',
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark pt-32 pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}></div>

        <div className="container-custom relative z-10">
          <div className="about-hero-content">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <span className="text-white/90 font-medium text-sm">About Us</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
              Government Degree College{' '}
              <span className="text-primary-light">Larkana</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mb-10">
              A premier public sector educational institution in Sindh, dedicated to
              academic excellence and holistic development of students since 1960.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary-light" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/50">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-sections-wrapper container-custom py-16">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* About Introduction */}
          <div className="about-section grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-5">
                <span className="text-primary font-semibold text-xs uppercase tracking-wider">Who We Are</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-5">
                A Legacy of{' '}
                <span className="text-primary">Educational Excellence</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Government Degree College Larkana is one of the oldest and most prestigious
                public sector colleges in the Larkana division of Sindh, Pakistan. Established
                in 1960, the college has been serving as a beacon of knowledge and learning
                for over six decades.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Affiliated with the University of Sindh, Jamshoro, the college offers a wide
                range of undergraduate programs including BS Zoology, Botany, Chemistry,
                Physics, Mathematics, and various Arts programs. Our Zoology department is
                particularly renowned for its comprehensive curriculum and well-equipped
                laboratories.
              </p>
              <div className="flex flex-wrap gap-3">
                {['HEC Recognized', 'University of Sindh Affiliated', 'Govt. of Sindh'].map((tag) => (
                  <span key={tag} className="text-xs font-semibold bg-primary/5 text-primary px-4 py-2 rounded-full border border-primary/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="GDC Larkana Campus"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">60+</div>
                    <div className="text-sm text-gray-500">Years of Service</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full -z-10"></div>
            </div>
          </div>

          {/* Mission, Vision, Values */}
          <div className="about-section">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-5">
                <span className="text-primary font-semibold text-xs uppercase tracking-wider">What Drives Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                Mission, Vision & <span className="text-primary">Values</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {values.map((item, i) => (
                <div key={i} className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
                  <div className={`h-1.5 bg-gradient-to-r ${item.gradient}`}></div>
                  <div className="p-8 pt-7">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-[15px]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline / History */}
          <div className="about-section">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-5">
                <span className="text-primary font-semibold text-xs uppercase tracking-wider">Our Journey</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                Milestones & <span className="text-primary">History</span>
              </h2>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-px"></div>

              <div className="space-y-10">
                {milestones.map((milestone, i) => (
                  <div key={i} className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:text-right md:pr-4' : 'md:text-left md:pl-4'}`}>
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <span className="text-primary font-bold text-lg">{milestone.year}</span>
                        <h4 className="text-lg font-bold text-gray-900 mt-1">{milestone.title}</h4>
                        <p className="text-gray-500 text-sm mt-2">{milestone.desc}</p>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-md -translate-x-1/2"></div>

                    {/* Spacer */}
                    <div className="hidden md:block md:w-[calc(50%-2rem)]"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="about-section">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c476?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="College Facilities"
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-5">
                  <span className="text-primary font-semibold text-xs uppercase tracking-wider">Campus Life</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-5">
                  Our <span className="text-primary">Facilities</span>
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  GDC Larkana provides a conducive learning environment with modern facilities
                  that support both academic and extracurricular activities.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {facilities.map((facility, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="about-section bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark rounded-3xl p-10 md:p-14 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '25px 25px',
            }}></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
                Get in <span className="text-primary-light">Touch</span>
              </h2>
              <p className="text-white/60 mb-10 max-w-lg">
                Want to learn more about our programs or visit the campus? Contact us today.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: MapPin, label: 'Address', value: 'Government Degree College, Larkana, Sindh' },
                  { icon: Phone, label: 'Phone', value: '+92 (74) 123-4567' },
                  { icon: Mail, label: 'Email', value: 'info@gdclarkana.edu.pk' },
                  { icon: Clock, label: 'Timing', value: 'Mon - Sat: 8AM - 3PM' },
                ].map((info, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary-light" />
                    </div>
                    <div>
                      <div className="text-xs text-white/40 mb-0.5">{info.label}</div>
                      <div className="text-sm font-medium text-white/90">{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/" className="btn-primary bg-white text-primary hover:bg-gray-100 group">
                  <span>Back to Home</span>
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
