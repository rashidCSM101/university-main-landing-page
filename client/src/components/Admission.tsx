import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, FileText, Cpu, CheckCircle2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { icon: FileText, title: '1. Research Proposal', desc: 'Submit climate attribution intent or project scope' },
  { icon: Cpu, title: '2. Model Simulation', desc: 'Run high-resolution WRF atmospheric ensemble models' },
  { icon: CheckCircle2, title: '3. Peer-Review Sync', desc: 'Validate findings against ERA5 reanalysis data' },
  { icon: Award, title: '4. Open-Access Release', desc: 'Publish policy brief & dataset to national portals' },
];

const Admission = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.admission-content', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.admission-step', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.admission-steps',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gray-900 text-white relative overflow-hidden font-sans">
      <div className="container-custom relative z-10">
        <div className="admission-content text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00C8C8]/10 text-[#00C8C8] text-xs font-bold uppercase tracking-wider border border-[#00C8C8]/30">
            <Award className="w-4 h-4" />
            <span>Research Collaboration Protocol</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white">
            Partner on <span className="text-[#00C8C8]">Climate Action Grants</span>
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            From initial research inquiry to WRF convective simulation and open-access monograph publishing — how we collaborate with international agencies and government departments.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="admission-steps grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="admission-step bg-gray-800/80 border border-gray-700/60 p-6 rounded-3xl backdrop-blur-md shadow-xl text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#00C8C8]/15 text-[#00C8C8] flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Call to Action Button */}
        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#00C8C8] text-gray-950 font-bold text-sm hover:bg-teal-400 transition-all shadow-xl shadow-teal-950/40"
          >
            <span>Submit Research Collaboration Inquiry</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Admission;
