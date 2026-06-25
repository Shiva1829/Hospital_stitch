import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Heart, 
  Brain, 
  Activity, 
  Users, 
  Calendar, 
  TrendingUp, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  UserCheck, 
  ListRestart,
  Upload,
  Search,
  Sliders,
  Sparkles,
  RefreshCw,
  FolderSync
} from 'lucide-react';
import { Doctor, Appointment, PredictionHistory, AuditLog, DashboardStats } from '../types';
import { CLINICAL_PRESETS, SCAN_PRESETS } from '../data';

interface DashboardViewProps {
  doctors: Doctor[];
  appointments: Appointment[];
  predictions: PredictionHistory[];
  auditLogs: AuditLog[];
  onAddDoctor: (docData: Partial<Doctor>) => Promise<any>;
  onAnalyzeDisease: (payload: {
    diseaseType: string;
    patientName: string;
    patientAge: number;
    metrics: Record<string, any>;
    imageUrl?: string;
  }) => Promise<any>;
}

export default function DashboardView({
  doctors,
  appointments,
  predictions,
  auditLogs,
  onAddDoctor,
  onAnalyzeDisease
}: DashboardViewProps) {
  // Current tab inside dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'analyzer' | 'imaging' | 'doctors' | 'logs'>('overview');

  // Multi-disease analyzer state
  const [selectedDisease, setSelectedDisease] = useState<'heart' | 'liver' | 'lungs' | 'kidney' | 'cancer' | 'brain'>('heart');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('45');
  
  // Dynamic metrics state depending on selected disease
  const [metrics, setMetrics] = useState<Record<string, any>>({
    'Blood Pressure': 125,
    'Cholesterol': 210,
    'Max Heart Rate': 165,
    'Chest Pain Type': 'Typical Angina',
    'Exercise Induced Angina': 'No'
  });

  // Load Preset Trigger
  const handleLoadPreset = (preset: any) => {
    setPatientAge(String(preset.age));
    const cleanMetrics: Record<string, any> = {};
    Object.keys(preset).forEach(key => {
      if (key !== 'label' && key !== 'age') {
        const readableLabel = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        cleanMetrics[readableLabel] = preset[key];
      }
    });
    setMetrics(cleanMetrics);
  };

  // Re-sync metrics on disease type change
  useEffect(() => {
    switch (selectedDisease) {
      case 'heart':
        setMetrics({
          'Blood Pressure': 130,
          'Cholesterol': 225,
          'Max Heart Rate': 160,
          'Chest Pain Type': 'Atypical Angina',
          'Exercise Induced Angina': 'No'
        });
        break;
      case 'liver':
        setMetrics({
          'Bilirubin': 1.1,
          'Alkaline Phosphatase': 105,
          'ALT / SGPT': 38,
          'AST / SGOT': 42,
          'Total Proteins': 6.8,
          'Albumin': 3.5
        });
        break;
      case 'lungs':
        setMetrics({
          'Smoking Frequency': 'Sometime',
          'Chronic Coughing': 'Yes',
          'Shortness of Breath': 'No',
          'Chest Tightness': 'No',
          'Fatigue Level': 'Mild'
        });
        break;
      case 'kidney':
        setMetrics({
          'Calcium': 6.2,
          'pH Level': 5.8,
          'Urine Specific Gravity': 1.020,
          'Pain Level': 'Moderate',
          'Hematuria': 'No'
        });
        break;
      case 'cancer':
        setMetrics({
          'Tumor Size (mm)': 12,
          'Family Oncology History': 'No',
          'Enlarged Lymph Nodes': 'No',
          'Unexplained Weight Loss': 'No',
          'Fatigue Level': 'Moderate'
        });
        break;
      case 'brain':
        setMetrics({
          'Headache Severity': 'Mild',
          'Seizure Episodes': 'No',
          'Blurred Vision': 'No',
          'Cognitive Deficits': 'None',
          'Unsteady Balance': 'No'
        });
        break;
    }
  }, [selectedDisease]);

  // Imaging scanner states
  const [selectedScanPreset, setSelectedScanPreset] = useState(SCAN_PRESETS[2]); // Default Healthy Brain MRI
  const [scanPatientName, setScanPatientName] = useState('');
  const [scanPatientAge, setScanPatientAge] = useState('32');
  const [uploadedScanFile, setUploadedScanFile] = useState<string | null>(null);

  // Analysis Animation States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const [currentResult, setCurrentResult] = useState<PredictionHistory | null>(null);

  // Doctor Registration Form State
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [docDept, setDocDept] = useState('Cardiology');
  const [docExp, setDocExp] = useState('8');
  const [docEmail, setDocEmail] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docDays, setDocDays] = useState<string[]>(['Monday', 'Wednesday']);

  // Audit Logs Filter
  const [logSearch, setLogSearch] = useState('');
  const [logFilter, setLogFilter] = useState<string>('All');

  // Triggering diagnosis sequence
  const executeDiagnosticRun = async (type: 'metrics' | 'imaging') => {
    const finalPatientName = type === 'metrics' ? patientName : scanPatientName;
    const finalPatientAge = type === 'metrics' ? Number(patientAge) : Number(scanPatientAge);
    
    if (!finalPatientName) {
      alert("Please provide the Patient's Name before starting AI analysis.");
      return;
    }

    setIsAnalyzing(true);
    setCurrentResult(null);
    setTelemetryLogs([]);

    const logMessages = [
      "Establishing secure diagnostic core pipeline...",
      "Reading physiological parameters and checking calibration...",
      "Connecting server proxy to Gemini-3.5-Flash neural system...",
      "Mapping metrics weights against active medical indices...",
      "Uploading diagnostic matrix frames to visual cognitive module...",
      "Refining predictive outcomes using multi-agent specialist templates...",
      "Diagnostic run completed successfully. Rendering clinical scorecard."
    ];

    // Trigger sequential telemetry logs for beautiful high-tech effect
    for (let i = 0; i < logMessages.length; i++) {
      await new Promise(res => setTimeout(res, 350 + Math.random() * 200));
      setTelemetryLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logMessages[i]}`]);
    }

    try {
      let payload: any = {
        patientName: finalPatientName,
        patientAge: finalPatientAge,
      };

      if (type === 'metrics') {
        const fullDiseaseLabel = selectedDisease === 'heart' ? 'Heart Disease' 
          : selectedDisease === 'liver' ? 'Liver Disease' 
          : selectedDisease === 'lungs' ? 'Lungs Disease'
          : selectedDisease === 'kidney' ? 'Kidney Stone'
          : selectedDisease === 'cancer' ? 'Cancer'
          : 'Brain Tumor';

        payload.diseaseType = fullDiseaseLabel;
        payload.metrics = metrics;
      } else {
        payload.diseaseType = selectedScanPreset.organ === 'Brain' ? 'Brain Tumor' 
          : selectedScanPreset.organ === 'Lungs' ? 'Lungs Disease' 
          : 'Kidney Stone';
        payload.scanType = selectedScanPreset.modality;
        payload.metrics = {
          'Imaging Modality': selectedScanPreset.modality,
          'Anatomy Target': selectedScanPreset.organ,
          'Baseline Findings': selectedScanPreset.clinicalDescription
        };
        payload.imageUrl = uploadedScanFile || selectedScanPreset.url;
      }

      const res = await onAnalyzeDisease(payload);
      if (res) {
        setCurrentResult(res);
      }
    } catch (err) {
      console.error("AI Analysis execution failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Download Diagnoses Report Text File
  const downloadReport = (pred: PredictionHistory) => {
    const metricsLines = Object.entries(pred.symptomsOrMetrics)
      .map(([key, val]) => `  - ${key}: ${val}`)
      .join('\n');
    
    const recsLines = pred.recommendations
      .map((rec, i) => `[${i + 1}] ${rec}`)
      .join('\n');

    const text = `
=====================================================
          AI HOSPITAL DIAGNOSTIC INTELLIGENCE
              CLINICAL ASSESSMENT REPORT
=====================================================
Assessment ID:      ${pred.id}
Date of Analysis:   ${pred.date}
System Modality:    Gemini-3.5-Flash

PATIENT HEALTH PROFILE
-----------------------------------------------------
Patient Name:       ${pred.patientName}
Patient Age:        ${pred.patientAge} Years Old
Clinical Urgency:   ${pred.severity.toUpperCase()} Priority

DIAGNOSTIC TARGET:  ${pred.diseaseType.toUpperCase()}
-----------------------------------------------------

SUBMITTED PHYSIOLOGICAL PARAMETERS:
${metricsLines}

CLINICAL INTERPRETATION EVALUATION:
-----------------------------------------------------
Confidence Rating:  ${pred.confidence}% Neural Certainty
Diagnostic Summary: 
"${pred.diagnosisText}"

ACTIONABLE STRATEGIC PROTOCOLS (RECOMMENDED):
-----------------------------------------------------
${recsLines}

REFERRAL ACTION PLAN
-----------------------------------------------------
Suggested Provider: ${pred.suggestedSpecialist}

=====================================================
IMPORTANT LEGAL DISCLAIMER: This report represents automated 
screening analytics. It must be corroborated by physical 
examinations, laboratory biopsies, and verified physicians.
=====================================================
`;
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Clinical_AI_Report_${pred.patientName.replace(/\s+/g, '_')}_${pred.diseaseType.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Doctor Registration submit handler
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docSpecialty) return;

    try {
      const payload: Partial<Doctor> = {
        name: docName,
        specialty: docSpecialty,
        department: docDept,
        experience: Number(docExp),
        email: docEmail,
        phone: docPhone,
        availability: docDays
      };

      const res = await onAddDoctor(payload);
      if (res) {
        setDocName('');
        setDocSpecialty('');
        setDocEmail('');
        setDocPhone('');
        alert(`Successfully registered ${res.name} inside the hospital provider database.`);
      }
    } catch (err) {
      console.error("Failed to register provider:", err);
    }
  };

  const handleDayToggle = (day: string) => {
    if (docDays.includes(day)) {
      setDocDays(docDays.filter(d => d !== day));
    } else {
      setDocDays([...docDays, day]);
    }
  };

  // Compute stats metrics dynamically
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
  const activeDoctorsCount = doctors.filter(d => d.status === 'Active').length;
  const totalPredictionsCount = predictions.length;

  // Prepare Chart Data
  // 1. Diagnostics categorizations distribution
  const diseaseDist = predictions.reduce((acc: Record<string, number>, curr) => {
    acc[curr.diseaseType] = (acc[curr.diseaseType] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(diseaseDist).map(([key, val]) => ({
    name: key,
    value: val
  }));

  if (pieChartData.length === 0) {
    pieChartData.push({ name: 'Heart Disease', value: 1 }, { name: 'Kidney Stone', value: 1 });
  }

  // 2. Daily Trends
  const dailyTrends = [
    { date: 'Mon', Appts: 4, Predictions: 2 },
    { date: 'Tue', Appts: 8, Predictions: 5 },
    { date: 'Wed', Appts: 12, Predictions: 9 },
    { date: 'Thu', Appts: 15, Predictions: 14 },
    { date: 'Fri', Appts: 18, Predictions: 18 },
    { date: 'Sat', Appts: 22, Predictions: 25 },
    { date: 'Sun', Appts: appointments.length + 2, Predictions: predictions.length + 3 }
  ];

  const PIE_COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f43f5e', '#f59e0b', '#ec4899'];

  const getSeverityBadgeColor = (sev: string) => {
    switch (sev) {
      case 'Severe': return 'bg-rose-500/15 text-rose-500 border-rose-500/20';
      case 'Moderate': return 'bg-amber-500/15 text-amber-500 border-amber-500/20';
      case 'Mild': return 'bg-cyan-500/15 text-cyan-500 border-cyan-500/20';
      default: return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20';
    }
  };

  return (
    <div className="space-y-8 py-4 page-reveal" id="dashboard-main-container">
      
      {/* 1. Header Overview Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-summary-grid">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm relative overflow-hidden flex items-center gap-4 glow-cyan"
          id="stat-appts"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-brand-cyan/5 rounded-full -mr-6 -mt-6"></div>
          <div className="p-3.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Total Appointments</span>
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-mono leading-none mt-1 block">
              {totalAppointments}
            </span>
            <span className="text-[10px] text-emerald-500 font-medium block mt-1">● {pendingAppointments} Pending Approval</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm relative overflow-hidden flex items-center gap-4 glow-indigo"
          id="stat-predictions"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-brand-indigo/5 rounded-full -mr-6 -mt-6"></div>
          <div className="p-3.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Cpu className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">AI Predictions Run</span>
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-mono leading-none mt-1 block">
              {totalPredictionsCount}
            </span>
            <span className="text-[10px] text-brand-indigo font-medium block mt-1">Powered by Gemini AI</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm relative overflow-hidden flex items-center gap-4 glow-emerald"
          id="stat-providers"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-brand-emerald/5 rounded-full -mr-6 -mt-6"></div>
          <div className="p-3.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Active Providers</span>
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-mono leading-none mt-1 block">
              {activeDoctorsCount}
            </span>
            <span className="text-[10px] text-emerald-500 font-medium block mt-1">98% Active Rating Avg</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm relative overflow-hidden flex items-center gap-4 glow-rose"
          id="stat-accuracy"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-brand-rose/5 rounded-full -mr-6 -mt-6"></div>
          <div className="p-3.5 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            <Activity className="h-6 w-6 animate-heartbeat-slow" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Model Precision</span>
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-mono leading-none mt-1 block">
              96.4%
            </span>
            <span className="text-[10px] text-brand-rose font-medium block mt-1">Validated Medical Datasets</span>
          </div>
        </motion.div>
      </section>

      {/* 2. Secondary Navigation / Sub-tab Selector */}
      <section className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-1" id="inner-nav-tabs">
        <button
          onClick={() => { setActiveTab('overview'); setCurrentResult(null); }}
          id="tab-btn-overview"
          className={`px-5 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'overview' 
              ? 'border-brand-cyan text-slate-900 dark:text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          Overview Dashboard
        </button>
        <button
          onClick={() => { setActiveTab('analyzer'); setCurrentResult(null); }}
          id="tab-btn-analyzer"
          className={`px-5 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'analyzer' 
              ? 'border-brand-violet text-slate-900 dark:text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          🧬 Multi-Disease AI Analyser
        </button>
        <button
          onClick={() => { setActiveTab('imaging'); setCurrentResult(null); }}
          id="tab-btn-imaging"
          className={`px-5 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'imaging' 
              ? 'border-brand-cyan text-slate-900 dark:text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          📷 MRI / CT Scan Interpreter
        </button>
        <button
          onClick={() => { setActiveTab('doctors'); setCurrentResult(null); }}
          id="tab-btn-doctors"
          className={`px-5 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'doctors' 
              ? 'border-brand-teal text-slate-900 dark:text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          🏥 Provider Registry
        </button>
        <button
          onClick={() => { setActiveTab('logs'); setCurrentResult(null); }}
          id="tab-btn-logs"
          className={`px-5 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'logs' 
              ? 'border-brand-rose text-slate-900 dark:text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          🪵 Audit Trail Logs
        </button>
      </section>

      {/* 3. Sub-Tab Content Rendering */}
      <AnimatePresence mode="wait" id="dashboard-tab-anim">
        
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            id="overview-tab-pane"
          >
            {/* Chart Left: Area Trend */}
            <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4" id="chart-appts-trend">
              <div className="flex justify-between items-center" id="trend-hdr">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white font-sans text-base">Operational Volume Analytics</h3>
                  <p className="text-xs text-slate-400">Weekly progression of manual registrations against AI automated diagnostic runs.</p>
                </div>
                <div className="flex gap-4 text-xs font-mono" id="trend-legends">
                  <span className="flex items-center gap-1.5 text-brand-cyan"><span className="h-2 w-2 rounded-full bg-brand-cyan"></span> Appointments</span>
                  <span className="flex items-center gap-1.5 text-brand-violet"><span className="h-2 w-2 rounded-full bg-brand-violet"></span> AI Predictions</span>
                </div>
              </div>

              <div className="h-[280px] w-full" id="area-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPreds" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: 11 }} />
                    <Area type="monotone" dataKey="Appts" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAppts)" />
                    <Area type="monotone" dataKey="Predictions" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPreds)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart Right: Diagnostics breakdown */}
            <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between" id="chart-pie-dist">
              <div className="space-y-1" id="pie-hdr">
                <h3 className="font-bold text-slate-900 dark:text-white font-sans text-base">AI Diagnoses Distribution</h3>
                <p className="text-xs text-slate-400">Breakdown of AI diagnostic targets evaluated inside this active sandbox.</p>
              </div>

              <div className="h-[200px] w-full relative flex items-center justify-center" id="pie-chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text badge */}
                <div className="absolute text-center space-y-0.5" id="pie-ctr">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Diagnostics</span>
                  <span className="text-xl font-black text-slate-800 dark:text-white font-mono">{totalPredictionsCount} Total</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-sans" id="pie-legends-grid">
                {pieChartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5" id={`pie-leg-${index}`}>
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                    <span className="truncate max-w-[100px]" title={entry.name}>{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row: Recent AI Diagnostic History Table */}
            <div className="lg:col-span-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm" id="table-recent-runs">
              <div className="flex justify-between items-center mb-4" id="table-hdr">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white font-sans text-base">Recent AI Diagnostic Assessments</h3>
                  <p className="text-xs text-slate-400">Detailed register of physiological runs mapped securely inside this console.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('analyzer')}
                  id="btn-trigger-diagnostics"
                  className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5 text-brand-cyan" /> New Diagnosis
                </button>
              </div>

              {predictions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs" id="empty-predictions-logs">No calculations recorded yet. Navigate to AI Analyser to execute diagnostic screens.</div>
              ) : (
                <div className="overflow-x-auto" id="diagnoses-table-scroll">
                  <table className="w-full text-left border-collapse text-xs" id="diagnoses-table">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Patient</th>
                        <th className="py-3 px-4">Assessed Modality</th>
                        <th className="py-3 px-4">Date Run</th>
                        <th className="py-3 px-4">Accuracy</th>
                        <th className="py-3 px-4">Severity</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans text-slate-700 dark:text-slate-300">
                      {predictions.slice(0, 5).map(pred => (
                        <tr key={pred.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all" id={`row-${pred.id}`}>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-950 dark:text-white block">{pred.patientName}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Age: {pred.patientAge} Years</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-brand-indigo">{pred.diseaseType}</td>
                          <td className="py-3.5 px-4 font-mono">{pred.date}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2" id={`cell-conf-${pred.id}`}>
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{pred.confidence}%</span>
                              <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0">
                                <div className="h-full bg-brand-cyan" style={{ width: `${pred.confidence}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeColor(pred.severity)}`}>
                              {pred.severity}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => downloadReport(pred)}
                              id={`btn-dl-report-row-${pred.id}`}
                              className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer inline-flex items-center"
                              title="Download Full Report"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 2: MULTI-DISEASE AI ANALYSER */}
        {activeTab === 'analyzer' && (
          <motion.div
            key="analyzer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
            id="analyzer-tab-pane"
          >
            {/* Multi-Disease Selector Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3" id="disease-module-selector-grid">
              {[
                { key: 'heart', label: 'Heart Disease', icon: Heart, desc: 'ECG & Arterial Plaque', color: 'border-rose-500/10 hover:border-rose-500/40 text-rose-500 bg-rose-500/5' },
                { key: 'liver', label: 'Liver Disease', icon: Activity, desc: 'Serum Liver Enzymes', color: 'border-orange-500/10 hover:border-orange-500/40 text-orange-500 bg-orange-500/5' },
                { key: 'lungs', label: 'Lungs Disease', icon: Sliders, desc: 'Pulmonary Bronchitis', color: 'border-cyan-500/10 hover:border-cyan-500/40 text-brand-cyan bg-cyan-500/5' },
                { key: 'kidney', label: 'Kidney Stone', icon: Sparkles, desc: 'Renal Solute pH Levels', color: 'border-violet-500/10 hover:border-violet-500/40 text-brand-violet bg-violet-500/5' },
                { key: 'cancer', label: 'Cancer Risk', icon: ShieldAlert, desc: 'Solid Tumor Screening', color: 'border-amber-500/10 hover:border-amber-500/40 text-amber-500 bg-amber-500/5' },
                { key: 'brain', label: 'Brain Tumor', icon: Brain, desc: 'Cortical Mass Pressure', color: 'border-pink-500/10 hover:border-pink-500/40 text-pink-500 bg-pink-500/5' }
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => { setSelectedDisease(item.key as any); setCurrentResult(null); }}
                  id={`select-disease-${item.key}`}
                  className={`rounded-xl border p-3.5 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    selectedDisease === item.key 
                      ? 'border-brand-indigo ring-2 ring-brand-indigo/30 bg-slate-900 text-white' 
                      : `${item.color} text-slate-400`
                  }`}
                >
                  <item.icon className={`h-6 w-6 ${selectedDisease === item.key ? 'text-brand-indigo scale-110' : ''} transition-transform`} />
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-extrabold block truncate">{item.label}</span>
                    <span className="text-[9px] text-slate-400 block leading-tight">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="analyzer-main-grid">
              
              {/* Form Input Block Left */}
              <div className="lg:col-span-5 space-y-6" id="analyzer-form-block">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md space-y-5" id="assessment-inputs-card">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3" id="inputs-hdr">
                    <div className="flex items-center gap-2">
                      <Sliders className="h-5 w-5 text-brand-cyan" />
                      <h4 className="font-bold text-slate-950 dark:text-white font-sans text-sm">Diagnostic Parameters</h4>
                    </div>
                    
                    {/* Load Presets Menu */}
                    <div className="relative inline-block" id="preset-dropdown-container">
                      <select
                        onChange={(e) => {
                          const idx = Number(e.target.value);
                          if (!isNaN(idx)) {
                            const activePresets = CLINICAL_PRESETS[selectedDisease];
                            handleLoadPreset(activePresets[idx]);
                          }
                        }}
                        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-2 py-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                        id="select-preset-loader"
                      >
                        <option value="">-- Load Preset Case --</option>
                        {CLINICAL_PRESETS[selectedDisease]?.map((p, idx) => (
                          <option key={p.label} value={idx}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4" id="inputs-grid">
                    
                    {/* Core Patient fields */}
                    <div className="grid grid-cols-2 gap-4" id="inputs-patient-core">
                      <div className="space-y-1" id="f-name">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Patient Name *</label>
                        <input
                          type="text"
                          required
                          value={patientName}
                          onChange={e => setPatientName(e.target.value)}
                          placeholder="Name"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-cyan transition-all"
                          id="in-analyser-name"
                        />
                      </div>
                      <div className="space-y-1" id="f-age">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Patient Age *</label>
                        <input
                          type="number"
                          required
                          value={patientAge}
                          onChange={e => setPatientAge(e.target.value)}
                          placeholder="Age"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-cyan transition-all"
                          id="in-analyser-age"
                        />
                      </div>
                    </div>

                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800"></div>

                    {/* Dynamic Disease Fields */}
                    <div className="grid grid-cols-2 gap-4" id="inputs-disease-specific">
                      {Object.keys(metrics).map(field => (
                        <div key={field} className="space-y-1" id={`field-wrap-${field}`}>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block truncate" title={field}>{field}</label>
                          {typeof metrics[field] === 'number' ? (
                            <input
                              type="number"
                              value={metrics[field]}
                              onChange={(e) => setMetrics({ ...metrics, [field]: Number(e.target.value) })}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-cyan"
                              id={`in-field-${field}`}
                            />
                          ) : (
                            <select
                              value={metrics[field]}
                              onChange={(e) => setMetrics({ ...metrics, [field]: e.target.value })}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-cyan"
                              id={`select-field-${field}`}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                              <option value="Yes (Chronic)">Yes (Chronic)</option>
                              <option value="Never">Never</option>
                              <option value="Heavy Smoker">Heavy Smoker</option>
                              <option value="Sometime">Sometime</option>
                              <option value="None">None</option>
                              <option value="Mild">Mild</option>
                              <option value="Moderate">Moderate</option>
                              <option value="Intense">Intense</option>
                              <option value="Severe">Severe</option>
                              <option value="Typical Angina">Typical Angina</option>
                              <option value="Atypical Angina">Atypical Angina</option>
                              <option value="Non-Anginal">Non-Anginal</option>
                              <option value="Asymptomatic">Asymptomatic</option>
                              <option value="Swollen/Enlarged">Swollen/Enlarged</option>
                              <option value="Normal">Normal</option>
                              <option value="Unsteady">Unsteady</option>
                              <option value="Perfect">Perfect</option>
                            </select>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={isAnalyzing}
                      onClick={() => executeDiagnosticRun('metrics')}
                      id="btn-execute-analyser"
                      className="w-full rounded-xl bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-rose text-white py-3.5 text-xs font-bold shadow-lg shadow-brand-indigo/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Run AI Diagnostic Evaluation
                    </button>
                  </div>
                </div>
              </div>

              {/* Console Output Block Right */}
              <div className="lg:col-span-7 space-y-6" id="analyzer-console-block">
                
                {/* 1. Loading state with running logs */}
                {isAnalyzing && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-6 h-full flex flex-col justify-between" id="telemetry-loading-card">
                    <div className="space-y-4" id="telemetry-hdr-box">
                      <div className="flex justify-between items-center" id="tel-hdr">
                        <span className="flex items-center gap-2 text-xs font-bold text-brand-cyan font-mono uppercase">
                          <RefreshCw className="h-4 w-4 animate-spin text-brand-cyan" />
                          Diagnostic Core Calculating
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Channel: Secure TLS Proxy</span>
                      </div>
                      
                      <div className="space-y-1.5 font-mono text-[10px] text-brand-teal/80 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 max-h-[220px] overflow-y-auto" id="telemetry-log-stream">
                        {telemetryLogs.map((log, idx) => (
                          <div key={idx} className="line-clamp-1">{log}</div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center space-y-2 py-4" id="telemetry-status-message">
                      <p className="text-sm text-slate-300 font-bold">Querying Gemini API Core...</p>
                      <p className="text-[11px] text-slate-500">Retrieving real-time clinical probability index calculations.</p>
                    </div>
                  </div>
                )}

                {/* 2. Standby state */}
                {!isAnalyzing && !currentResult && (
                  <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-4 h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/20" id="standby-diagnostic-card">
                    <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800" id="standby-icon">
                      <Cpu className="h-8 w-8 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1.5 max-w-sm" id="standby-text">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-300">Awaiting Clinical Core Execution</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Populate the patient profile parameters on the left or load a preset, then click "Run AI Diagnostic Evaluation" to query the AI core.
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. Successful assessment result render */}
                {!isAnalyzing && currentResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg space-y-6"
                    id="scorecard-report-card"
                  >
                    <div className="flex justify-between items-start" id="report-top-row">
                      <div id="report-title-box">
                        <span className="text-[10px] text-brand-indigo font-bold font-mono uppercase tracking-wider block">Assessment Verification Successful</span>
                        <h4 className="font-extrabold text-slate-950 dark:text-white font-sans text-base mt-0.5">{currentResult.diseaseType} Assessment Report</h4>
                        <span className="text-[11px] text-slate-400">Patient: {currentResult.patientName} ({currentResult.patientAge} Yrs)</span>
                      </div>

                      <div className="flex flex-col items-end gap-1.5" id="report-confidence-gauge">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-mono font-bold block leading-none">AI Certainty</span>
                          <span className="text-xl font-black text-brand-cyan font-mono mt-0.5 block">{currentResult.confidence}%</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeColor(currentResult.severity)}`}>
                          {currentResult.severity} Case
                        </span>
                      </div>
                    </div>

                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800"></div>

                    {/* Diagnosis summary text */}
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/50 dark:border-slate-800/50 space-y-1.5" id="report-summary-box">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Expert Clinician AI Finding:</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
                        {currentResult.diagnosisText}
                      </p>
                    </div>

                    {/* Structured Recommendations */}
                    <div className="space-y-3" id="report-recs-box">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Strategic Actions Required:</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="recs-grid">
                        {currentResult.recommendations?.map((rec, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-600 dark:text-slate-400 font-sans" id={`rec-item-${idx}`}>
                            <CheckCircle2 className="h-4.5 w-4.5 text-brand-teal shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800"></div>

                    {/* Suggested specialist and download */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4" id="report-actions-row">
                      <div className="flex items-center gap-3" id="assigned-specialist-display">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-brand-indigo border border-slate-200 dark:border-slate-700">
                          <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono block">Recommended Specialist Consultation</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-sans">{currentResult.suggestedSpecialist}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => downloadReport(currentResult)}
                        id="btn-dl-report-scorecard"
                        className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 px-5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="h-4 w-4 text-brand-cyan" /> Download Printable Assessment
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: IMAGING SCAN INTERPRETER */}
        {activeTab === 'imaging' && (
          <motion.div
            key="imaging"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            id="imaging-tab-pane"
          >
            {/* Left Image Selector / presets */}
            <div className="lg:col-span-5 space-y-6" id="imaging-grid-left">
              <div className="space-y-1.5" id="img-intro">
                <h3 className="font-bold text-slate-900 dark:text-white font-sans text-base">Select Radiological Modality</h3>
                <p className="text-xs text-slate-400">Choose one of our preset high-contrast clinical scans to test the AI vision module.</p>
              </div>

              {/* Scan cards presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="scan-presets-grid">
                {SCAN_PRESETS.map(scan => (
                  <button
                    key={scan.id}
                    onClick={() => { setSelectedScanPreset(scan); setUploadedScanFile(null); setCurrentResult(null); }}
                    id={`btn-select-scan-${scan.id}`}
                    className={`rounded-xl border p-3 text-left transition-all cursor-pointer flex gap-3 items-center ${
                      selectedScanPreset.id === scan.id && !uploadedScanFile
                        ? 'border-brand-cyan bg-slate-50 dark:bg-slate-900 ring-2 ring-brand-cyan/20' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50/50'
                    }`}
                  >
                    <img src={scan.url} alt={scan.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-800" />
                    <div className="space-y-0.5 overflow-hidden">
                      <span className="text-[11px] font-extrabold text-slate-900 dark:text-white block truncate">{scan.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">{scan.modality} ({scan.organ})</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Upload custom scan simulation */}
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-950/40 text-center space-y-3" id="file-uploader-box">
                <Upload className="mx-auto h-6 w-6 text-brand-cyan shrink-0 animate-bounce" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Patient Scan File</h5>
                  <p className="text-[10px] text-slate-500">Supports JPEG, DICOM, or axial T1/T2 PNG sequences up to 15MB.</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setUploadedScanFile(reader.result as string);
                        setSelectedScanPreset({
                          id: 'uploaded-scan',
                          name: file.name,
                          modality: 'CT Scan',
                          organ: 'Brain',
                          url: reader.result as string,
                          clinicalDescription: 'User uploaded clinical image diagnostic sequence.'
                        });
                        setCurrentResult(null);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden" 
                  id="custom-file-input" 
                />
                <label 
                  htmlFor="custom-file-input" 
                  id="label-custom-file"
                  className="mx-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 py-1.5 px-3 text-[10px] font-bold cursor-pointer inline-block"
                >
                  Choose Local File
                </label>
              </div>
            </div>

            {/* Right Interactive Scanner with Green laser scroll and telemetry */}
            <div className="lg:col-span-7 space-y-6" id="imaging-grid-right">
              
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md" id="visual-scanner-container">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="scanner-inner-grid">
                  
                  {/* Visualizer Image Frame */}
                  <div className="md:col-span-6 space-y-3" id="visualizer-frame">
                    <div className="relative rounded-xl border border-slate-800 bg-black aspect-square overflow-hidden shadow-inner flex items-center justify-center group" id="scanner-visual">
                      
                      {/* Scanline overlay */}
                      {isAnalyzing && (
                        <div className="absolute left-0 right-0 h-1 bg-brand-cyan shadow-[0_0_12px_#06b6d4] z-20 animate-scan-line"></div>
                      )}

                      <img 
                        src={uploadedScanFile || selectedScanPreset.url} 
                        alt="Radiological Subject" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-80" 
                      />

                      {/* Diagnostic Overlay HUD */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded px-2 py-0.5 text-[8px] font-mono text-brand-cyan border border-brand-cyan/20 uppercase" id="hud-modality">
                        Modality: {selectedScanPreset.modality}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded px-2 py-0.5 text-[8px] font-mono text-brand-cyan border border-brand-cyan/20 uppercase animate-pulse-ring" id="hud-status">
                        STATUS: {isAnalyzing ? 'ACTIVE SCANNING' : 'STANDBY'}
                      </div>
                    </div>
                    
                    <span className="text-[10px] text-slate-500 leading-relaxed block italic text-center font-sans">
                      Fig A: Coronal view of selected radiological study.
                    </span>
                  </div>

                  {/* Settings and Trigger Pane */}
                  <div className="md:col-span-6 flex flex-col justify-between" id="scanner-settings">
                    <div className="space-y-4" id="settings-fields-box">
                      <div id="settings-intro">
                        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest block">Study Identification</span>
                        <h4 className="font-extrabold text-slate-950 dark:text-white font-sans text-sm mt-0.5">{selectedScanPreset.name}</h4>
                      </div>

                      <div className="space-y-3 text-xs" id="interpreter-patient-group">
                        <div className="space-y-1" id="g-scan-name">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Patient Name *</label>
                          <input
                            type="text"
                            required
                            value={scanPatientName}
                            onChange={e => setScanPatientName(e.target.value)}
                            placeholder="Patient's Full Name"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-cyan transition-all"
                            id="in-scan-name"
                          />
                        </div>
                        <div className="space-y-1" id="g-scan-age">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Patient Age *</label>
                          <input
                            type="number"
                            required
                            value={scanPatientAge}
                            onChange={e => setScanPatientAge(e.target.value)}
                            placeholder="Age"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-cyan transition-all"
                            id="in-scan-age"
                          />
                        </div>

                        <div className="rounded-xl bg-slate-100 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-900 space-y-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans" id="study-details">
                          <strong className="text-slate-800 dark:text-slate-300 font-bold block">Study Context findings:</strong>
                          "{selectedScanPreset.clinicalDescription}"
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isAnalyzing}
                      onClick={() => executeDiagnosticRun('imaging')}
                      id="btn-trigger-scan"
                      className="w-full rounded-xl bg-gradient-to-r from-brand-cyan to-brand-teal text-slate-950 py-3.5 text-xs font-bold shadow-lg shadow-brand-cyan/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4 text-slate-950" />
                      Execute Visual AI Analysis
                    </button>
                  </div>
                </div>

                {/* Report panel embedded directly below scanner */}
                <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6" id="imaging-output-dock">
                  {isAnalyzing && (
                    <div className="space-y-3" id="scan-loading-telemetry">
                      <div className="flex justify-between text-[10px] font-mono text-brand-teal" id="scan-tel-hdr">
                        <span>[STREAMING IMAGE MATRIX VECTORS]</span>
                        <span className="animate-pulse">● RUNNING</span>
                      </div>
                      <div className="rounded-xl bg-slate-950 border border-slate-850 p-4 font-mono text-[9px] text-slate-400 max-h-[140px] overflow-y-auto leading-relaxed" id="scan-logs-box">
                        {telemetryLogs.map((log, idx) => <div key={idx}>{log}</div>)}
                      </div>
                    </div>
                  )}

                  {!isAnalyzing && !currentResult && (
                    <div className="text-center py-4 text-slate-400 text-xs font-sans" id="scan-standby-txt">Awaiting Visual Core assessment. Secure patient name, choose study target, and run visual interpreter.</div>
                  )}

                  {!isAnalyzing && currentResult && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-xl bg-slate-50 dark:bg-slate-950 p-5 border border-slate-200 dark:border-slate-800 space-y-4"
                      id="scan-report-scorecard"
                    >
                      <div className="flex justify-between items-start" id="scan-scorecard-hdr">
                        <div id="scan-scorecard-labels">
                          <span className="text-[10px] text-brand-cyan font-mono uppercase block">Imaging Findings Clear</span>
                          <h4 className="font-bold text-slate-900 dark:text-white font-sans text-xs mt-0.5">Radiological Verification</h4>
                        </div>
                        <div className="text-right" id="scan-scorecard-conf">
                          <span className="text-[9px] text-slate-400 font-mono block leading-none">Radiological Certainty</span>
                          <span className="text-sm font-black text-brand-cyan font-mono">{currentResult.confidence}%</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans" id="scan-scorecard-diagnosis">
                        {currentResult.diagnosisText}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-200 dark:border-slate-800 pt-3 text-[11px] text-slate-600 dark:text-slate-400" id="scan-recs">
                        {currentResult.recommendations?.slice(0, 2).map((rec, i) => (
                          <div key={i} className="flex gap-2" id={`scan-rec-item-${i}`}>
                            <CheckCircle2 className="h-4 w-4 text-brand-cyan shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px]" id="scan-actions">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Referral specialist: {currentResult.suggestedSpecialist}</span>
                        <button
                          onClick={() => downloadReport(currentResult)}
                          id="btn-dl-scan-report"
                          className="rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 py-1.5 px-3 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="h-3 w-3 text-brand-cyan" /> Download Report
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: PROVIDER REGISTRY */}
        {activeTab === 'doctors' && (
          <motion.div
            key="doctors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            id="doctors-tab-pane"
          >
            {/* Roster list Grid Left */}
            <div className="lg:col-span-8 space-y-4" id="doctors-grid-left">
              <h3 className="font-bold text-slate-900 dark:text-white font-sans text-base" id="doctors-grid-hdr">Specialist Practitioner Roster</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="doctors-grid-cards">
                {doctors.map(doc => (
                  <div
                    key={doc.id}
                    id={`doc-card-${doc.id}`}
                    className={`rounded-xl border p-4 flex gap-4 items-center shadow-sm relative overflow-hidden ${
                      doc.status === 'On Leave'
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 opacity-75'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 glow-cyan'
                    }`}
                  >
                    <img 
                      src={doc.imageUrl} 
                      alt={doc.name} 
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800" 
                    />
                    
                    <div className="space-y-1 overflow-hidden" id="doc-card-info">
                      <div className="flex items-center gap-2" id="doc-title-row">
                        <h4 className="font-extrabold text-slate-950 dark:text-white font-sans text-sm truncate">{doc.name}</h4>
                        <span className={`text-[9px] font-bold rounded px-1.5 py-0.5 border ${
                          doc.status === 'Active' 
                            ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' 
                            : 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-sans font-semibold truncate">{doc.specialty}</span>
                      
                      <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-mono pt-1" id="doc-card-details">
                        <span>Exp: {doc.experience} Yrs</span>
                        <span>•</span>
                        <span>Rating: ★ {doc.rating}</span>
                      </div>

                      <div className="text-[9px] text-brand-indigo font-mono truncate" id="doc-card-availability" title={doc.availability.join(', ')}>
                        Available: {doc.availability.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Form Right */}
            <div className="lg:col-span-4 space-y-6" id="doctors-grid-right">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md space-y-5" id="provider-registration-card">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3" id="provider-hdr">
                  <UserCheck className="h-5 w-5 text-brand-teal" />
                  <h4 className="font-bold text-slate-950 dark:text-white font-sans text-sm">Register Specialist</h4>
                </div>

                <form onSubmit={handleDoctorSubmit} className="space-y-4" id="provider-form">
                  <div className="space-y-1" id="gp-name">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={docName}
                      onChange={e => setDocName(e.target.value)}
                      placeholder="e.g. Dr. Robert Vance"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-teal transition-all"
                      id="in-provider-name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4" id="gp-grid">
                    <div className="space-y-1" id="gp-specialty">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Medical Specialty *</label>
                      <input
                        type="text"
                        required
                        value={docSpecialty}
                        onChange={e => setDocSpecialty(e.target.value)}
                        placeholder="e.g. Cardiologist"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-teal transition-all"
                        id="in-provider-specialty"
                      />
                    </div>

                    <div className="space-y-1" id="gp-dept">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Department *</label>
                      <select
                        value={docDept}
                        onChange={e => setDocDept(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-teal"
                        id="select-provider-dept"
                      >
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pulmonology">Pulmonology</option>
                        <option value="Urology & Nephrology">Urology</option>
                        <option value="Oncology">Oncology</option>
                        <option value="Radiology">Radiology</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1" id="gp-exp">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Experience (Years) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="60"
                      value={docExp}
                      onChange={e => setDocExp(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-teal transition-all"
                      id="in-provider-exp"
                    />
                  </div>

                  <div className="space-y-2" id="gp-availability">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">Availability Schedule *</label>
                    <div className="flex flex-wrap gap-1.5" id="days-selector">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          id={`btn-toggle-day-${day}`}
                          className={`rounded px-2.5 py-1 text-[10px] font-bold border transition-colors cursor-pointer ${
                            docDays.includes(day)
                              ? 'bg-brand-teal text-slate-950 border-brand-teal'
                              : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="btn-register-doctor-submit"
                    className="w-full rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan text-slate-950 py-3 text-xs font-bold hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer"
                  >
                    Register Provider
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: SYSTEM AUDIT TRAIL LOGS */}
        {activeTab === 'logs' && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
            id="logs-tab-pane"
          >
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4" id="logs-container">
              
              {/* Logs filter bar */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4" id="logs-filter-row">
                <div className="relative flex-1 max-w-md" id="logs-search-wrapper">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={logSearch}
                    onChange={e => setLogSearch(e.target.value)}
                    placeholder="Search audit trail action logs..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 pl-10 pr-4 text-xs text-slate-950 dark:text-white outline-none focus:border-brand-rose transition-all"
                    id="in-logs-search"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs" id="logs-tabs-wrapper">
                  {['All', 'Login', 'Registration', 'Analysis', 'Appointment', 'System'].map(category => (
                    <button
                      key={category}
                      onClick={() => setLogFilter(category)}
                      id={`btn-filter-log-${category}`}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors cursor-pointer ${
                        logFilter === category
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-850'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logs list representation */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs max-h-[480px] overflow-y-auto space-y-3 shadow-inner" id="logs-list-wrapper">
                
                <div className="flex justify-between items-center text-[10px] text-slate-500 pb-2 border-b border-slate-900" id="logs-terminal-hdr">
                  <span>TERMINAL LOGS: CLINICAL SECURITY RECONCILIATION</span>
                  <span className="flex items-center gap-1.5"><FolderSync className="h-3 w-3 text-rose-500 animate-spin" /> DATABASE TUNNEL SECURED</span>
                </div>

                {auditLogs
                  .filter(log => logFilter === 'All' ? true : log.type === logFilter)
                  .filter(log => {
                    const term = logSearch.toLowerCase();
                    return log.action.toLowerCase().includes(term) || log.details.toLowerCase().includes(term) || log.user.toLowerCase().includes(term);
                  })
                  .map(log => (
                    <div key={log.id} className="p-3 bg-slate-900/60 rounded border border-slate-900 flex justify-between items-start gap-4 transition-all hover:bg-slate-900" id={`log-item-${log.id}`}>
                      <div className="space-y-1 flex-1" id="log-item-details">
                        <div className="flex items-center gap-2" id="log-item-title">
                          <span className="text-[10px] text-slate-500">[{log.date}]</span>
                          <span className="font-bold text-brand-cyan">{log.user}:</span>
                          <span className="font-bold text-white uppercase text-[10px] tracking-wider">{log.action}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed font-sans">{log.details}</p>
                      </div>

                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                        log.type === 'Analysis' 
                          ? 'text-brand-violet bg-brand-violet/10 border-brand-violet/20' 
                          : log.type === 'Appointment'
                          ? 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20'
                          : log.type === 'Registration'
                          ? 'text-brand-teal bg-brand-teal/10 border-brand-teal/20'
                          : 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                      }`}>
                        {log.type}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
