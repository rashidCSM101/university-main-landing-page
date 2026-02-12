import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Pricing = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from('.pricing-header', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Cards animation
      gsap.from('.pricing-card-item', {
        y: 50,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const plans = [
    {
      name: 'Starter Plan',
      price: 29,
      period: 'month',
      description: 'Perfect for beginners starting their learning journey',
      features: [
        'Access to 50+ courses',
        'Basic support',
        'Course certificates',
        'Mobile app access',
        'Community forum access',
      ],
      featured: false,
    },
    {
      name: 'Premium Plan',
      price: 59,
      period: 'month',
      description: 'Best value for dedicated learners',
      features: [
        'Access to all 300+ courses',
        'Priority support 24/7',
        'Verified certificates',
        'Offline downloads',
        'Live Q&A sessions',
        '1-on-1 mentoring',
        'Career guidance',
      ],
      featured: true,
    },
    {
      name: 'Enterprise',
      price: 99,
      period: 'month',
      description: 'For organizations and teams',
      features: [
        'Everything in Premium',
        'Team management',
        'Custom learning paths',
        'Analytics dashboard',
        'API access',
        'Dedicated account manager',
      ],
      featured: false,
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="pricing-header text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="decorative-line"></div>
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Pricing Plans
            </span>
            <div className="decorative-line"></div>
          </div>
          <h2 className="section-title mb-6">
            Flexible Pricing <span className="text-primary">Options</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Choose the perfect plan that fits your learning goals and budget.
            All plans come with a 30-day money-back guarantee.
          </p>
        </div>

        {/* Pricing Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card-item relative bg-white rounded-2xl p-8 transition-all duration-300 ${
                plan.featured
                  ? 'shadow-2xl scale-105 border-2 border-primary z-10'
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Featured Badge */}
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500">/{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center group transition-all ${
                  plan.featured
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-100 text-gray-900 hover:bg-primary hover:text-white'
                }`}
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-gray-500 mt-8">
          All prices in USD. Cancel anytime. No hidden fees.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
