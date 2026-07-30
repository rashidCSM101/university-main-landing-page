import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CloudRain, BarChart2, FileText, Globe } from 'lucide-react';
import introImage from '../../assets/images/introduction.avif';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: CloudRain,
    title: 'Climate Research',
    description: 'Peer-reviewed attribution science on extreme weather',
  },
  {
    icon: BarChart2,
    title: 'Policy Analysis',
    description: 'Evidence-based climate policy for South Asian governments',
  },
  {
    icon: FileText,
    title: 'Data Services',
    description: 'High-resolution climate datasets and technical reports',
  },
  {
    icon: Globe,
    title: 'Regional Expertise',
    description: "Deep specialisation in South Asia's climate dynamics",
  },
];

const Introduction = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image animation
      gsap.from(imageRef.current, {
        x: -50,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      });

      // Parallax for image
      const imgElement = imageRef.current?.querySelector('img');
      if (imgElement) {
        gsap.to(imgElement, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Content animation
      gsap.from(contentRef.current?.children || [], {
        x: 50,
        duration: 0.8,
        stagger: 0.15,
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

  return (
    <section ref={sectionRef} className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <div ref={imageRef} className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={introImage}
                alt="WenClims climate science team at work"
                loading="lazy"
                width={800}
                height={500}
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 max-w-[200px] hidden md:block">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">7+</div>
                  <div className="text-sm text-gray-500">Years Experience</div>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent-gold/20 rounded-full -z-10"></div>
          </div>

          {/* Content Column */}
          <div ref={contentRef}>
            {/* Section Label */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="decorative-line"></div>
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                About WenClims
              </span>
            </div>

            {/* Heading */}
            <h2 className="section-title mb-6">
              Science-Based Climate Intelligence{' '}
              <span className="text-primary">for South Asia</span>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg mb-8">
              WenClims provides rigorous, peer-reviewed climate science and policy analysis
              tailored to the complex weather and climate dynamics of South Asia. From extreme
              heat attribution to monsoon variability and flood risk, we translate cutting-edge
              research into actionable guidance for governments, development agencies, and
              civil society.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link to="/tools" className="btn-primary group inline-flex">
              <span>Explore Our Tools</span>
              <svg
                className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
