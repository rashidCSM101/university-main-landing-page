import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

const Signup = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    cnic: '', fatherName: '', program: '', session: '', education: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.signup-left', {
        x: -40,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.1,
      });
      gsap.from('.signup-right', {
        x: 40,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const features = [
    { icon: BookOpen, title: 'Course Management', desc: 'Access all your enrolled courses and materials' },
    { icon: CheckCircle2, title: 'Results & Grades', desc: 'View your semester results and transcripts' },
    { icon: Mail, title: 'Notifications', desc: 'Stay updated with college announcements' },
    { icon: User, title: 'Student Profile', desc: 'Manage your academic profile and documents' },
  ];

  return (
    <>
      <Helmet>
        <title>Sign Up | GDC Larkana - Create Account</title>
        <meta name="description" content="Create your student account at Government Degree College Larkana. Register for BS Zoology and other programs." />
        <link rel="canonical" href="https://gdclarkana.edu.pk/signup" />
      </Helmet>
      <div ref={pageRef} className="h-screen flex overflow-hidden">
      {/* Left Panel — Branding */}
      <div className="signup-left hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-32 right-16 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent-gold rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative z-10 max-w-md px-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-white/10 backdrop-blur rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-white">GDC Larkana</span>
          </Link>

          <h2 className="text-2xl font-heading font-bold text-white mb-3">Start Your Journey</h2>
          <p className="text-white/60 leading-relaxed text-sm mb-6">
            Join Government Degree College Larkana and unlock access to quality education,
            experienced faculty, and a vibrant campus community.
          </p>

          {/* Features list */}
          <div className="space-y-2.5">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur rounded-xl p-3 border border-white/10">
                <div className="flex-shrink-0 w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-primary-light" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{feature.title}</h4>
                  <p className="text-xs text-white/50">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="signup-right w-full lg:w-[55%] flex items-center justify-center bg-gray-50 px-6 py-6 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-gray-900">GDC Larkana</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-3 py-1 mb-3">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-primary font-semibold text-[10px] uppercase tracking-wider">Create Account</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-1">
            Get <span className="text-primary">Started</span>
          </h1>
          <p className="text-gray-500 text-sm mb-4">Create your student account to access the portal.</p>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
              <span className={`text-xs font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Personal Info</span>
            </div>
            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'} transition-colors`} />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
              <span className={`text-xs font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Academic Info</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Step 1 */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="you@email.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+92 300 1234567"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="(\+92|0)\d{10}"
                        title="Enter a valid Pakistani phone number"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a strong password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Use 8+ characters with letters, numbers & symbols</p>
                </div>

                <button type="submit" className="btn-primary w-full justify-center group">
                  <span>Continue</span>
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">CNIC Number</label>
                    <input
                      type="text"
                      name="cnic"
                      placeholder="42201-1234567-1"
                      required
                      value={formData.cnic}
                      onChange={handleChange}
                      pattern="\d{5}-\d{7}-\d{1}"
                      title="Enter CNIC in format: 42201-1234567-1"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Father's Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        name="fatherName"
                        placeholder="Father's full name"
                        required
                        value={formData.fatherName}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Program</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <select
                        name="program"
                        required
                        value={formData.program}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                      >
                        <option value="">Select</option>
                        <option value="bs-zoology">BS Zoology</option>
                        <option value="bs-botany">BS Botany</option>
                        <option value="bs-chemistry">BS Chemistry</option>
                        <option value="intermediate">Intermediate</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Session</label>
                    <select
                      name="session"
                      required
                      value={formData.session}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                    >
                      <option value="">Select</option>
                      <option value="2026-2030">2026-2030</option>
                      <option value="2025-2029">2025-2029</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Previous Education</label>
                  <select
                    name="education"
                    required
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                  >
                    <option value="">Highest qualification</option>
                    <option value="matric">Matric / SSC</option>
                    <option value="inter">Intermediate / HSSC</option>
                    <option value="bachelors">Bachelors</option>
                  </select>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" required className="w-4 h-4 mt-0.5 accent-primary rounded" />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link to="#" className="text-primary font-medium hover:underline">Terms & Conditions</Link>{' '}
                    and{' '}
                    <Link to="#" className="text-primary font-medium hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-outline flex-1 justify-center"
                  >
                    Back
                  </button>
                  <button type="submit" className="btn-primary flex-1 justify-center group">
                    <span>Create Account</span>
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signup;
