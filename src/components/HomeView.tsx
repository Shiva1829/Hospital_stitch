import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  ShieldAlert, 
  Stethoscope, 
  UserCheck, 
  Brain, 
  Heart, 
  Calendar, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: 'home' | 'appointment' | 'contact' | 'dashboard') => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16 py-4 page-reveal"
      id="home-view-container"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 md:p-16 text-white border border-slate-800 shadow-2xl glow-indigo" id="home-hero">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-indigo/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-1.5 text-xs text-brand-cyan font-mono"
            id="home-badge"
          >
            <Cpu className="h-3.5 w-3.5 animate-pulse" />
            Empowering Healthcare with Gemini-3.5 Intelligence
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight"
            id="home-heading"
          >
            Clinical Excellence <br />
            <span className="bg-gradient-to-r from-brand-cyan via-brand-teal to-brand-violet bg-clip-text text-transparent">
              Accelerated by AI Diagnostics
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-base md:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl"
            id="home-subtext"
          >
            Welcome to the future of integrated healthcare administration. Connect patient scheduling, 
            doctor resource profiles, support messages, and high-performance AI scanners for ECG, 
            hematology, liver enzymes, and radiological scans (MRI, X-ray, CT) on a single gorgeous console.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4" id="home-cta-group">
            <button
              onClick={() => onNavigate('dashboard')}
              id="btn-goto-analyzer"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-teal px-6 py-3.5 font-medium text-slate-950 shadow-lg shadow-brand-cyan/20 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              Enter AI Diagnostics Console
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('appointment')}
              id="btn-goto-scheduler"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-900 px-6 py-3.5 font-medium text-slate-200 transition-colors hover:border-slate-500 cursor-pointer"
            >
              Book Patient Appointment
              <Calendar className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Vital Clinical Modules Grid */}
      <section className="space-y-6" id="home-features-section">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4" id="features-header">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-sans" id="features-heading">
              Comprehensive Medical Services
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Synchronized pipelines coordinating administration and algorithmic diagnostics.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-mono border border-emerald-200 dark:border-emerald-900/40" id="uptime-indicator">
            <TrendingUp className="h-3.5 w-3.5" />
            99.9% Core Engine Uptime Live
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="features-grid">
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-md transition-all flex flex-col justify-between h-full"
            id="feat-card-ai"
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">Multi-Disease AI Analyser</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Live diagnosis for cardiovascular disease, nephrolithiasis, liver metrics, lungs capacity, and brain tumor warnings via Gemini-3.5-Flash.
              </p>
            </div>
            <button onClick={() => onNavigate('dashboard')} id="link-feat-ai" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:gap-2.5 transition-all cursor-pointer">
              Go to Analyser <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-md transition-all flex flex-col justify-between h-full"
            id="feat-card-scan"
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
                <Activity className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">Medical Scan Interpreter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Advanced imaging model for instant assessment of Chest X-rays, axial Brain MRIs, and pelvic CT Scans. Output fully downloadable.
              </p>
            </div>
            <button onClick={() => onNavigate('dashboard')} id="link-feat-scan" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:gap-2.5 transition-all cursor-pointer">
              Scan Diagnostics <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-md transition-all flex flex-col justify-between h-full"
            id="feat-card-appoint"
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">Specialist Directories</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Real-time connection with highly experienced medical staff. Track ratings, active availability days, and schedule custom consultations.
              </p>
            </div>
            <button onClick={() => onNavigate('appointment')} id="link-feat-appoint" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-2.5 transition-all cursor-pointer">
              Schedule Appointment <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-md transition-all flex flex-col justify-between h-full"
            id="feat-card-help"
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">Support & Messaging</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Seamless feedback logs for patient questions. Staff can filter, read, reply, and track audit details of all clinical inquiries.
              </p>
            </div>
            <button onClick={() => onNavigate('contact')} id="link-feat-contact" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:gap-2.5 transition-all cursor-pointer">
              Contact Desk <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Clinical Workflow Guide */}
      <section className="bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-8 md:p-12 border border-slate-200/80 dark:border-slate-800/60" id="home-workflow-section">
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-12" id="workflow-header">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-sans">
            How The AI System Interconnects
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A cohesive full-stack environment where data flows instantly between front-end interfaces, back-end servers, and Gemini clinical systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative" id="workflow-steps">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-[1.5px] bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-violet -translate-y-12 -z-10 opacity-30"></div>

          <div className="text-center space-y-3 relative z-10" id="step-1">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-900 dark:bg-slate-800 text-brand-cyan border border-slate-700/60 flex items-center justify-center text-xl font-bold font-mono shadow-md">
              01
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Collect Vital Parameters</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              Patients or nurses input specific hematology levels, cardiac metrics, or upload imaging scans directly into the portal.
            </p>
          </div>

          <div className="text-center space-y-3 relative z-10" id="step-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-900 dark:bg-slate-800 text-brand-indigo border border-slate-700/60 flex items-center justify-center text-xl font-bold font-mono shadow-md">
              02
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Secure Proxy Engine</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              The Express backend processes requests, keeping clinical credentials safe, and structures parameters to send to Gemini-3.5.
            </p>
          </div>

          <div className="text-center space-y-3 relative z-10" id="step-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-900 dark:bg-slate-800 text-brand-violet border border-slate-700/60 flex items-center justify-center text-xl font-bold font-mono shadow-md">
              03
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Algorithmic Result & Action</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              Vivid scorecards are rendered with custom download options. System triggers warnings, logs entries, and alerts specialists.
            </p>
          </div>
        </div>
      </section>

      {/* Clinical Advisory & Testimonials */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch" id="testimonials-section">
        <div className="rounded-2xl bg-gradient-to-br from-brand-teal via-brand-cyan to-brand-indigo p-8 text-slate-950 flex flex-col justify-between shadow-xl glow-cyan" id="clinical-disclaimer-card">
          <div className="space-y-4">
            <div className="p-2 rounded-lg bg-slate-950/10 inline-block">
              <ShieldAlert className="h-6 w-6 text-slate-900" />
            </div>
            <h3 className="text-xl font-bold font-sans">Core Safety Protocol</h3>
            <p className="text-xs text-slate-900/80 leading-relaxed font-sans font-medium">
              This system utilizes advanced natural language model generation and imaging analyzers for screening support. 
              Always cross-examine analytical scorecards with physical vital tests, clinical symptoms, and a medical specialist.
            </p>
          </div>
          <div className="pt-6 border-t border-slate-950/10 flex items-center gap-3">
            <div className="p-1.5 rounded-full bg-slate-950 text-white">
              <UserCheck className="h-4 w-4 text-brand-cyan" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider font-mono">HIPAA & GDPR Compliant</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 flex flex-col justify-between shadow-md" id="test-1">
          <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
            "The multi-disease analyzer has cut down my clinical preparation time significantly. Being able to review the AI's metrics analysis alongside the scanned MRI on the dashboard before seeing a patient is a total game-changer."
          </p>
          <div className="mt-6 flex items-center gap-4 border-t border-slate-100 dark:border-slate-900 pt-4">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100" 
              alt="Dr. Sarah Jenkins" 
              className="w-10 h-10 rounded-full object-cover border border-brand-teal"
            />
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Dr. Sarah Jenkins</h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Chief Cardiologist, FACC</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 flex flex-col justify-between shadow-md" id="test-2">
          <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
            "Having an automated message routing channel integrated with real-time appointments and an audit trail has streamline our entire administrative workflow. The high-contrast dashboard gives our staff total operational clarity."
          </p>
          <div className="mt-6 flex items-center gap-4 border-t border-slate-100 dark:border-slate-900 pt-4">
            <img 
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100" 
              alt="Dr. Michael Chang" 
              className="w-10 h-10 rounded-full object-cover border border-brand-indigo"
            />
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Dr. Michael Chang</h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Senior Neurologist, MD</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
