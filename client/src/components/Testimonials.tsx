import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: 'Dr. Tariq Hassan',
    role: 'Climate Policy Advisor, Asian Development Bank (ADB)',
    content:
      'WenClims provided exceptional scientific guidance and flood attribution modeling for our regional infrastructure resilience program. Their research insights are indispensable for South Asian climate policy.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 5,
  },
  {
    id: 2,
    name: 'Dr. Elena Rostova',
    role: 'Senior Environmental Scientist, EU Climate Initiative',
    content:
      'Working with the WenClims team on Indus Basin hydrological vulnerability was seamless. Their peer-reviewed datasets and localized climate intelligence set the gold standard in South Asia.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 5,
  },
  {
    id: 3,
    name: 'Muhammad Bilal Khan',
    role: 'Disaster Risk Reduction Specialist, NDMA Pakistan',
    content:
      'The real-time weather telemetry and extreme heatwave advisory tools developed by WenClims have greatly enhanced our early warning capabilities across vulnerable districts.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    rating: 5,
  },
];

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonial-content', {
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={sectionRef} className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="testimonial-content">
            <div className="flex items-center space-x-3 mb-4">
              <div className="decorative-line"></div>
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                Testimonials
              </span>
            </div>

            <h2 className="section-title mb-6">
              Impact Endorsements &amp;{' '}
              <span className="text-[#48b302]">Partner Feedback</span>
            </h2>

            {/* Testimonial Card */}
            <div className="relative bg-gray-50 rounded-2xl p-8 md:p-10">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-12 h-12 text-primary/20" />
              </div>

              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                "{testimonials[currentIndex].content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  loading="lazy"
                  width={300}
                  height={300}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={prevTestimonial}
                  aria-label="Previous testimonial"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  aria-label="Next testimonial"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-gray-500 ml-4">
                  {currentIndex + 1} / {testimonials.length}
                </span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Partner Organizations"              loading="lazy"
                width={800}
                height={533}
                className="rounded-2xl w-full h-[500px] object-cover"
              />
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-3">
                    {testimonials.slice(0, 3).map((t, i) => (
                      <img
                        key={i}
                        src={t.image}
                        alt={t.name}
                        loading="lazy"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">50+</div>
                    <div className="text-sm text-gray-500">Global Research Partners</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-primary/20 rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
