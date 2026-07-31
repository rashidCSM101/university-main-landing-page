import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe2, FileText, Satellite, Building2, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  end: number;
  suffix: string;
  label: string;
  badge: string;
  icon: React.ElementType;
  gradient: string;
  duration?: number;
}

const CounterCard = ({ end, suffix, label, badge, icon: Icon, gradient, duration = 2 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div
      ref={counterRef}
      className="stat-card group relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#00C8C8]/50 rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,200,200,0.15)] flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle Inner Card Glow */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity duration-500`} />

      <div>
        {/* Header Icon & Tag */}
        <div className="flex items-center justify-between mb-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            <div className="w-full h-full bg-gray-950/80 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
              <Icon className="w-6 h-6 text-[#00C8C8]" />
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80">
            {badge}
          </span>
        </div>

        {/* Counter Number */}
        <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight mb-2 flex items-baseline">
          <span>{count}</span>
          <span className="text-[#00C8C8] ml-1">{suffix}</span>
        </div>

        {/* Metric Label */}
        <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-300 leading-snug">
          {label}
        </div>
      </div>

      {/* Bottom Accent Bar */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-[#00C8C8] font-medium">
        <TrendingUp className="w-3.5 h-3.5" />
        <span>Verified Climate Metric</span>
      </div>
    </div>
  );
};

const Stats = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stats-container', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      end: 15,
      suffix: '+',
      label: 'Years in Climate Science',
      badge: 'Est. 2010',
      icon: Globe2,
      gradient: 'from-cyan-500 to-teal-600',
    },
    {
      end: 50,
      suffix: '+',
      label: 'Research Publications',
      badge: 'Peer-Reviewed',
      icon: FileText,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      end: 30,
      suffix: '+',
      label: 'Policy Briefs Delivered',
      badge: 'ADB · EU · NDMA',
      icon: Satellite,
      gradient: 'from-teal-500 to-emerald-600',
    },
    {
      end: 12,
      suffix: '+',
      label: 'Countries Engaged',
      badge: 'South Asia Scope',
      icon: Building2,
      gradient: 'from-amber-500 to-cyan-500',
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-[#0A2540] relative overflow-hidden text-white border-t border-b border-gray-800">
      {/* Background Atmosphere Lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="w-full max-w-[68rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Small Section Tag */}
        <div className="flex items-center justify-center space-x-3 mb-10 text-center">
          <span className="w-8 h-px bg-[#00C8C8]" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full border border-[#00C8C8]/40 text-[#00C8C8] bg-[#00C8C8]/10">
            Proven Track Record &amp; Impact
          </span>
          <span className="w-8 h-px bg-[#00C8C8]" />
        </div>

        {/* 4 Stat Cards Grid */}
        <div className="stats-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <CounterCard
              key={index}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
              badge={stat.badge}
              icon={stat.icon}
              gradient={stat.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
