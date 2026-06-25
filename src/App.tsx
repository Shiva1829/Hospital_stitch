import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Calendar, 
  MessageSquare, 
  LayoutDashboard, 
  Activity, 
  Cpu, 
  LogOut,
  FolderSync,
  Heart,
  Stethoscope
} from 'lucide-react';

// Sub-views
import HomeView from './components/HomeView';
import AppointmentView from './components/AppointmentView';
import ContactView from './components/ContactView';
import DashboardView from './components/DashboardView';

// Types
import { Doctor, Appointment, PatientMessage, PredictionHistory, AuditLog } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'appointment' | 'contact' | 'dashboard'>('home');
  
  // App-level Shared State
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // System Loading / Sync indicators
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch all state from full-stack backend
  const fetchAllData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsSyncing(true);

    try {
      const [docsRes, aptsRes, msgsRes, predsRes, logsRes] = await Promise.all([
        fetch('/api/doctors'),
        fetch('/api/appointments'),
        fetch('/api/messages'),
        fetch('/api/predictions'),
        fetch('/api/logs')
      ]);

      const [docs, apts, msgs, preds, logs] = await Promise.all([
        docsRes.json(),
        aptsRes.json(),
        msgsRes.json(),
        predsRes.json(),
        logsRes.json()
      ]);

      setDoctors(docs);
      setAppointments(apts);
      setMessages(msgs);
      setPredictions(preds);
      setAuditLogs(logs);
    } catch (error) {
      console.error("APP STATE: Error syncing data from backend:", error);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  // Sync on mount
  useEffect(() => {
    fetchAllData();
    
    // Auto sync every 15 seconds to simulate real-time updates
    const interval = setInterval(() => {
      fetchAllData(true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // API Callbacks passed to sub-components
  const handleBookAppointment = async (aptData: Partial<Appointment>) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aptData)
      });
      const data = await res.json();
      if (res.ok) {
        // Optimistic / complete sync
        await fetchAllData(true);
        return data;
      } else {
        alert(data.error || "Failed to submit appointment.");
      }
    } catch (err) {
      console.error("APP STATE: Booking failed:", err);
    }
    return null;
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}/cancel`, {
        method: 'POST'
      });
      if (res.ok) {
        await fetchAllData(true);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to cancel appointment.");
      }
    } catch (err) {
      console.error("APP STATE: Cancellation failed:", err);
    }
  };

  const handleAddDoctor = async (docData: Partial<Doctor>) => {
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData)
      });
      const data = await res.json();
      if (res.ok) {
        await fetchAllData(true);
        return data;
      } else {
        alert(data.error || "Failed to register doctor.");
      }
    } catch (err) {
      console.error("APP STATE: Registration failed:", err);
    }
    return null;
  };

  const handleSubmitMessage = async (msgData: Partial<PatientMessage>) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
      const data = await res.json();
      if (res.ok) {
        await fetchAllData(true);
        return data;
      } else {
        alert(data.error || "Failed to route message.");
      }
    } catch (err) {
      console.error("APP STATE: Routing failed:", err);
    }
    return null;
  };

  const handleAnalyzeDisease = async (payload: {
    diseaseType: string;
    patientName: string;
    patientAge: number;
    metrics: Record<string, any>;
    imageUrl?: string;
  }) => {
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        await fetchAllData(true);
        return data;
      } else {
        alert(data.error || "Failed to compile diagnostic analysis.");
      }
    } catch (err) {
      console.error("APP STATE: Analysis compile failed:", err);
    }
    return null;
  };

  // Navigations switcher wrapper
  const handleNavigate = (tab: typeof activeTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="dark min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-brand-cyan selection:text-slate-950" id="app-root-frame">
      
      {/* 1. Header Navigation Bar (Glassmorphic) */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-900 shadow-md transition-all px-4 py-4" id="main-navigation-header">
        <div className="max-w-7xl mx-auto flex justify-between items-center" id="nav-wrapper">
          
          {/* Hospital Logo Accent */}
          <div 
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group" 
            id="brand-logo"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-indigo text-slate-950 shadow-md shadow-brand-cyan/10 group-hover:scale-105 transition-transform">
              <Activity className="h-5 w-5 text-slate-950 animate-heartbeat-slow" />
            </div>
            <div>
              <span className="text-sm font-black font-sans tracking-tight text-white flex items-center gap-1.5 leading-none">
                AI CLINIC <span className="text-[10px] bg-brand-violet/20 border border-brand-violet/30 text-brand-violet font-mono px-1 py-0.5 rounded uppercase">V1.5</span>
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">INTELLIGENT RECONCILIATION</span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-slate-800" id="nav-links">
            <button
              onClick={() => handleNavigate('home')}
              id="nav-btn-home"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'home' 
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-teal text-slate-950 shadow-sm font-extrabold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              Home Portal
            </button>
            <button
              onClick={() => handleNavigate('appointment')}
              id="nav-btn-appointment"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'appointment' 
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-teal text-slate-950 shadow-sm font-extrabold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              Book Consult
            </button>
            <button
              onClick={() => handleNavigate('contact')}
              id="nav-btn-contact"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'contact' 
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-teal text-slate-950 shadow-sm font-extrabold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Contact Desk
            </button>
            <button
              onClick={() => handleNavigate('dashboard')}
              id="nav-btn-dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'bg-gradient-to-r from-brand-indigo to-brand-violet text-white shadow-sm font-extrabold glow-indigo' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              AI Dashboard
            </button>
          </nav>

          {/* Sync indicator */}
          <div className="flex items-center gap-3" id="sync-indicator">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 rounded-full px-2.5 py-1">
              <FolderSync className={`h-3 w-3 ${isSyncing ? 'animate-spin text-brand-cyan' : 'text-slate-500'}`} />
              {isSyncing ? "Syncing..." : "Database Live"}
            </span>
          </div>

        </div>
      </header>

      {/* 2. Main Content Stage Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8" id="main-view-stage">
        {isLoading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4" id="app-loading-screen">
            <div className="relative flex items-center justify-center w-16 h-16" id="loading-spinner-box">
              <div className="absolute inset-0 rounded-full border-4 border-slate-900"></div>
              <div className="absolute inset-0 rounded-full border-4 border-brand-cyan border-t-transparent animate-spin"></div>
              <Activity className="h-6 w-6 text-brand-cyan animate-pulse absolute" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold font-mono tracking-widest text-slate-400 uppercase">Synchronizing Portal Services</h3>
              <p className="text-xs text-slate-500">Connecting secure database pools & AI modules...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait" id="page-animations-wrapper">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-[60vh]"
              id="active-pane-frame"
            >
              {activeTab === 'home' && (
                <HomeView onNavigate={handleNavigate} />
              )}
              {activeTab === 'appointment' && (
                <AppointmentView 
                  doctors={doctors}
                  appointments={appointments}
                  onBookAppointment={handleBookAppointment}
                  onCancelAppointment={handleCancelAppointment}
                />
              )}
              {activeTab === 'contact' && (
                <ContactView 
                  messages={messages}
                  onSubmitMessage={handleSubmitMessage}
                />
              )}
              {activeTab === 'dashboard' && (
                <DashboardView 
                  doctors={doctors}
                  appointments={appointments}
                  predictions={predictions}
                  auditLogs={auditLogs}
                  onAddDoctor={handleAddDoctor}
                  onAnalyzeDisease={handleAnalyzeDisease}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* 3. Global Footer (High Contrast) */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 mt-16 text-slate-500 text-xs" id="main-global-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6" id="footer-wrapper">
          <div className="text-center md:text-left space-y-1" id="footer-branding">
            <span className="font-bold text-slate-300 block font-sans">AI-Based Hospital & Diagnostics Administration System</span>
            <span className="text-[10px] text-slate-600 block leading-relaxed font-mono">
              Designed as a HIPAA compliant sandbox integrating Express compilation with Gemini-3.5 clinical vision interfaces.
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-[10px] font-mono tracking-widest uppercase" id="footer-links">
            <span className="text-brand-cyan">● Heart</span>
            <span className="text-orange-400">● Liver</span>
            <span className="text-brand-teal">● Lungs</span>
            <span className="text-brand-violet">● Kidney</span>
            <span className="text-amber-500">● Cancer</span>
            <span className="text-pink-500">● Brain</span>
          </div>

          <div className="text-center md:text-right" id="footer-copyright">
            <span className="block">&copy; 2026 AI Hospital Systems Inc.</span>
            <span className="text-[10px] text-slate-600 block mt-0.5">All diagnostic modules actively secure.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
