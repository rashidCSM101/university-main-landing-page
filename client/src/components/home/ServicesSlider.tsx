import { useEffect, useRef } from 'react';
import { ShieldCheck, ThermometerSun, FileSpreadsheet, Users, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    id: 'service-1',
    title: 'Climate Risk Assessment',
    category: 'Risk Science & Modeling',
    tagNumber: '01',
    icon: ShieldCheck,
    image: '/assets/images/service-climate-risk.png',
    description:
      'Quantitative climate vulnerability mapping, flood hydrographs, atmospheric WRF simulations, and extreme event attribution across South Asian river basins.',
    pills: ['WRF Modeling', 'Indus Hydrographs'],
    link: '/tools',
  },
  {
    id: 'service-2',
    title: 'Heat Stress Assessments',
    category: 'Urban & Thermal Telemetry',
    tagNumber: '02',
    icon: ThermometerSun,
    image: '/assets/images/service-heat-stress.png',
    description:
      'Wet-bulb temperature (TW > 35°C) threshold tracking, urban heat island monitoring, thermal infrared satellite analysis, and municipal cooling protocols.',
    pills: ['Wet-Bulb TW > 35°C', 'Thermal Infrared'],
    link: '/tools',
  },
  {
    id: 'service-3',
    title: 'Policy Analysis & Governance',
    category: 'Evidence-Based Policy',
    tagNumber: '03',
    icon: FileSpreadsheet,
    image: '/assets/images/service-policy-governance.png',
    description:
      'Formulating evidence-based climate policy, national adaptation plans, loss and damage frameworks, and environmental governance guidance for governments.',
    pills: ['Adaptation Plans', 'Loss & Damage'],
    link: '/publications',
  },
  {
    id: 'service-4',
    title: 'Stakeholder Engagement',
    category: 'Capacity Building',
    tagNumber: '04',
    icon: Users,
    image: '/assets/images/service-stakeholder-engagement.png',
    description:
      'Fostering collaborative climate workshops, multi-sectoral stakeholder consultations, local community resilience building, and technical training.',
    pills: ['Consultations', 'Resilience Training'],
    link: '/contact',
  },
];

export const ServicesSlider = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // GSAP scroll animation on enter
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.services-header-anim',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
          },
        }
      );

      gsap.fromTo(
        '.services-card-anim',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-white text-gray-900 font-sans relative overflow-hidden border-t border-b border-gray-100"
    >
      <div className="container-custom relative z-10">
        {/* Header Block */}
        <div className="services-header-anim max-w-4xl mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#48b302]/30 bg-[#48b302]/10 text-[#48b302] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#48b302]" />
            <span>Integrated Environmental Solutions</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 leading-tight mb-5">
            Our Services — <span className="text-[#48b302]">What We Do</span>
          </h2>

          <p className="text-gray-600 text-sm md:text-base leading-relaxed font-normal">
            At <strong className="text-gray-900 font-semibold">WCS</strong>, we provide integrated weather, climate, and environmental solutions in the field of <strong className="text-[#48b302] font-semibold">energy, water and climate change</strong> to help stakeholders make informed decisions, reduce climate risks, and build long-term climate resilience. Our services combine scientific expertise with climate modelling, advanced data analytics, climate risk and vulnerability assessments and climate change services dashboards to deliver actionable insights.
          </p>
        </div>

        {/* 4 Premium Cards Grid Matching User Reference Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {servicesData.map((service) => {
            const ServiceIcon = service.icon;
            return (
              <div
                key={service.id}
                className="services-card-anim group relative flex flex-col h-[460px] rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] border border-gray-800/20 hover:border-[#48b302]/60 bg-gray-950"
              >
                {/* Full-Bleed Card Background Image */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                />

                {/* Dark Gradient Overlay for Smooth Bottom Text Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent opacity-95 group-hover:opacity-90 transition-opacity" />

                {/* Top Number Tag */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[#48b302] text-[11px] font-black tracking-widest z-10 shadow-md">
                  {service.tagNumber}
                </span>

                {/* Top Icon Badge */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white flex items-center justify-center z-10 group-hover:scale-110 group-hover:bg-[#48b302] group-hover:text-white transition-all duration-300 shadow-md">
                  <ServiceIcon className="w-4 h-4" />
                </div>

                {/* Bottom Content Area */}
                <div className="p-6 relative z-10 flex flex-col justify-end h-full mt-auto">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#48b302] mb-1.5 block">
                    {service.category}
                  </span>

                  <h3 className="text-xl font-heading font-bold text-white mb-2 leading-tight group-hover:text-white transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-gray-300 font-light leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Frosted Glass Pill Badges */}
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    {service.pills.map((pill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] text-gray-200 border border-white/15 font-medium flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#48b302]" />
                        <span>{pill}</span>
                      </span>
                    ))}
                  </div>

                  {/* Full-Width Curved Pill Action Button (Matches "Reserve now" style) */}
                  <Link
                    to={service.link}
                    className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-gray-100 text-gray-950 font-bold text-xs tracking-wide text-center transition-all duration-300 shadow-lg active:scale-98 flex items-center justify-center gap-2 group-hover:bg-[#48b302] group-hover:text-white"
                  >
                    <span>Explore Solutions</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSlider;
