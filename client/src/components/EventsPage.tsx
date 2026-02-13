import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Search,
  ChevronDown,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  attendees: number;
  status: 'upcoming' | 'ongoing' | 'past';
}

const eventsData: EventItem[] = [
  {
    id: 1,
    title: 'Annual Science Exhibition 2026',
    description: 'Showcasing innovative science projects by Zoology, Botany, and Chemistry students. A platform for young minds to present research and experiments.',
    date: 'March 15, 2026',
    time: '9:00 AM - 4:00 PM',
    location: 'Main Auditorium & Science Block',
    category: 'Academic',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    attendees: 500,
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Zoology Department Seminar',
    description: 'Guest lecture on "Biodiversity Conservation in Sindh" by Prof. Dr. Iqbal Shah from University of Karachi. Open to all students.',
    date: 'February 28, 2026',
    time: '11:00 AM - 1:00 PM',
    location: 'Zoology Lecture Hall',
    category: 'Seminar',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    attendees: 150,
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Annual Sports Championship',
    description: 'Inter-departmental sports competition including cricket, football, volleyball, and athletics. Show your skills and win trophies!',
    date: 'March 5-8, 2026',
    time: '8:00 AM - 5:00 PM',
    location: 'Sports Complex & Ground',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    attendees: 800,
    status: 'upcoming',
  },
  {
    id: 4,
    title: 'Career Counseling Workshop',
    description: 'Learn about career opportunities after BS Zoology. Experts from different fields will guide students on career paths and further studies.',
    date: 'February 22, 2026',
    time: '10:00 AM - 2:00 PM',
    location: 'Conference Room',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    attendees: 200,
    status: 'upcoming',
  },
  {
    id: 5,
    title: 'Lab Safety Training Program',
    description: 'Mandatory safety training for all laboratory students covering proper handling of equipment, chemicals, and emergency procedures.',
    date: 'February 18, 2026',
    time: '9:00 AM - 12:00 PM',
    location: 'Zoology Lab Complex',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    attendees: 120,
    status: 'ongoing',
  },
  {
    id: 6,
    title: 'Welcome Ceremony - New Session 2026',
    description: 'Welcoming new students of BS Zoology session 2026-2030. Meet the faculty, department tour, and orientation program.',
    date: 'January 10, 2026',
    time: '10:00 AM - 3:00 PM',
    location: 'Main Auditorium',
    category: 'Ceremony',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    attendees: 350,
    status: 'past',
  },
  {
    id: 7,
    title: 'Wildlife Photography Contest',
    description: 'Annual photography contest celebrating the wildlife of Sindh. Submit your best wildlife photographs and win exciting prizes.',
    date: 'April 5, 2026',
    time: 'All Day',
    location: 'Art Gallery & Online',
    category: 'Competition',
    image: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    attendees: 100,
    status: 'upcoming',
  },
  {
    id: 8,
    title: 'Parent-Teacher Meeting',
    description: 'Semester review meeting for parents to discuss student progress, attendance, and academic performance with faculty members.',
    date: 'December 20, 2025',
    time: '9:00 AM - 1:00 PM',
    location: 'Respective Departments',
    category: 'Meeting',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    attendees: 400,
    status: 'past',
  },
];

const categories = ['All', ...Array.from(new Set(eventsData.map(e => e.category)))];
const statuses = ['All', 'upcoming', 'ongoing', 'past'];

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  upcoming: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  ongoing: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  past: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

const categoryGradients: Record<string, string> = {
  Academic: 'from-indigo-500 to-blue-600',
  Seminar: 'from-primary to-rose-600',
  Sports: 'from-emerald-500 to-teal-600',
  Workshop: 'from-amber-500 to-orange-600',
  Ceremony: 'from-violet-500 to-purple-600',
  Competition: 'from-pink-500 to-rose-600',
  Meeting: 'from-cyan-500 to-blue-600',
};

const EventsPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCatDrop, setShowCatDrop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.events-hero-content', {
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from('.event-page-card', {
        y: 30,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.events-grid',
          start: 'top 85%',
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const filtered = eventsData.filter(e => {
    const matchesCat = catFilter === 'All' || e.category === catFilter;
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesSearch =
      search === '' ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Events | GDC Larkana - Campus Events & Activities</title>
        <meta name="description" content="Explore upcoming events, seminars, workshops, and campus activities at Government Degree College Larkana." />
        <link rel="canonical" href="https://gdclarkana.edu.pk/events" />
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
          <div className="events-hero-content">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <span className="text-white/90 font-medium text-sm">Events & Activities</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
              Our <span className="text-primary-light">Events</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Stay connected with what's happening at GDC Larkana. From academic seminars to sports championships, there's always something exciting going on.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container-custom -mt-14 relative z-20">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Upcoming Events', value: eventsData.filter(e => e.status === 'upcoming').length, gradient: 'from-emerald-500 to-teal-600', icon: Calendar },
            { label: 'Ongoing Events', value: eventsData.filter(e => e.status === 'ongoing').length, gradient: 'from-blue-500 to-indigo-600', icon: Clock },
            { label: 'Past Events', value: eventsData.filter(e => e.status === 'past').length, gradient: 'from-gray-500 to-gray-600', icon: Calendar },
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

      {/* Filters */}
      <div className="container-custom pt-12 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Status tabs */}
            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Category dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCatDrop(!showCatDrop)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 transition-all"
              >
                <span>{catFilter === 'All' ? 'All Categories' : catFilter}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCatDrop ? 'rotate-180' : ''}`} />
              </button>
              {showCatDrop && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[180px] z-30">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setCatFilter(cat); setShowCatDrop(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${catFilter === cat ? 'bg-primary/5 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {cat === 'All' ? 'All Categories' : cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          Showing <span className="font-semibold text-gray-600">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Events Grid */}
      <div className="container-custom pb-20">
        <div className="events-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => {
            const gradient = categoryGradients[event.category] || 'from-gray-500 to-gray-600';
            const statusStyle = statusColors[event.status];
            return (
              <div
                key={event.id}
                className="event-page-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}                  loading="lazy"                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-semibold text-white px-3 py-1 rounded-full bg-gradient-to-r ${gradient}`}>
                      {event.category}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      <span className="capitalize">{event.status}</span>
                    </span>
                  </div>

                  {/* Date overlay */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 opacity-80" />
                    <span className="text-sm font-medium">{event.date}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
                    {event.description}
                  </p>

                  {/* Meta */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span>{event.attendees}+ Expected Attendees</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-gray-100">
                    <button className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      event.status === 'past'
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-primary/5 text-primary hover:bg-primary hover:text-white'
                    }`}>
                      <span>{event.status === 'past' ? 'Event Ended' : 'View Details'}</span>
                      {event.status !== 'past' && <ArrowRight className="w-4 h-4" />}
                    </button>
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
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Events Found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default EventsPage;
