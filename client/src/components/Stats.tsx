import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, BookOpen, Globe, GraduationCap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  end: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  duration?: number;
}

const Counter = ({ end, suffix, label, icon: Icon, duration = 2 }: CounterProps) => {
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
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={counterRef} className="counter-item flex-1 text-center px-6 py-4">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
        {count}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="text-gray-500 font-medium">{label}</div>
    </div>
  );
};

const Stats = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stats-container', {
        y: 30,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { end: 10, suffix: 'K+', label: 'Happy Students', icon: Users },
    { end: 300, suffix: '+', label: 'Quality Courses', icon: BookOpen },
    { end: 48, suffix: 'K+', label: 'Global Learners', icon: Globe },
    { end: 2, suffix: 'K+', label: 'Expert Faculty', icon: GraduationCap },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="stats-container bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="flex flex-wrap justify-between items-center">
            {stats.map((stat, index) => (
              <Counter
                key={index}
                end={stat.end}
                suffix={stat.suffix}
                label={stat.label}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
