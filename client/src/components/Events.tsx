import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const events = [
    {
      id: 1,
      title: 'Building Future Through Technology',
      date: 'Jan 15, 2025',
      location: 'Main Auditorium',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      size: 'large',
    },
    {
      id: 2,
      title: 'The World Trip Our Dream Come True',
      date: 'Feb 20, 2025',
      location: 'Campus Ground',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      size: 'medium',
    },
    {
      id: 3,
      title: 'Annual Sports Championship',
      date: 'Mar 10, 2025',
      location: 'Sports Complex',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      size: 'medium',
    },
  ];

const Events = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.from(contentRef.current?.children || [], {
        x: -50,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Images animation with parallax
      gsap.from('.event-image', {
        y: 50,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: imagesRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });

      // Parallax effect on images
      gsap.utils.toArray('.event-image').forEach((img: any) => {
        gsap.to(img.querySelector('img'), {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <div ref={contentRef}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="decorative-line"></div>
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                Upcoming Events
              </span>
            </div>

            <h2 className="section-title mb-6">
              Recent &{' '}
              <span className="text-primary">Upcoming Events</span>
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              Stay updated with our latest events, seminars, and activities. Join us
              in building a community of learners and innovators.
            </p>

            {/* Event List */}
            <div className="space-y-4 mb-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <span className="text-xs font-medium text-primary group-hover:text-white">
                      {event.date.split(' ')[0]}
                    </span>
                    <span className="text-xl font-bold text-primary group-hover:text-white">
                      {event.date.split(' ')[1].replace(',', '')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>

            <Link to="/events" className="btn-primary group">
              <Calendar className="w-5 h-5 mr-2" />
              <span>View All Events</span>
            </Link>
          </div>

          {/* Images Grid */}
          <div ref={imagesRef} className="relative grid grid-cols-2 gap-4">
            {/* Large Image */}
            <div className="event-image col-span-2 relative overflow-hidden rounded-2xl h-64">
              <img
                src={events[0].image}
                alt={events[0].title}              loading="lazy"
                width={800}
                height={533}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm opacity-80">{events[0].date}</p>
                <h4 className="font-semibold">{events[0].title}</h4>
              </div>
            </div>

            {/* Medium Images */}
            {events.slice(1).map((event) => (
              <div
                key={event.id}
                className="event-image relative overflow-hidden rounded-2xl h-48"
              >
                <img
                  src={event.image}
                  alt={event.title}                loading="lazy"
                  width={800}
                  height={533}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs opacity-80">{event.date}</p>
                  <h4 className="text-sm font-semibold">{event.title}</h4>
                </div>
              </div>
            ))}

            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full -z-10"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-accent-gold/20 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
