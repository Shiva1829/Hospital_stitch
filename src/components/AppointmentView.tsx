import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  ChevronRight, 
  X, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Info
} from 'lucide-react';
import { Doctor, Appointment } from '../types';

interface AppointmentViewProps {
  doctors: Doctor[];
  appointments: Appointment[];
  onBookAppointment: (appointmentData: Partial<Appointment>) => Promise<any>;
  onCancelAppointment: (id: string) => Promise<any>;
}

export default function AppointmentView({ 
  doctors, 
  appointments, 
  onBookAppointment, 
  onCancelAppointment 
}: AppointmentViewProps) {
  // Form State
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('Low');

  // Interactive UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookedReceipt, setBookedReceipt] = useState<Appointment | null>(null);

  // Filter Active Doctors
  const activeDoctors = doctors.filter(doc => doc.status === 'Active');

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !selectedDocId || !date || !timeSlot) {
      alert("Please populate all mandatory fields to secure your consultation slot.");
      return;
    }

    setIsSubmitting(true);
    const doctorObj = doctors.find(doc => doc.id === selectedDocId);

    try {
      const payload: Partial<Appointment> = {
        doctorId: selectedDocId,
        doctorName: doctorObj?.name || 'General Physician',
        specialty: doctorObj?.specialty || 'General Practice',
        patientName,
        patientAge: parseInt(patientAge) || 30,
        date,
        time: timeSlot,
        symptoms,
        severity
      };

      const result = await onBookAppointment(payload);
      if (result) {
        setBookedReceipt(result);
        setShowSuccessModal(true);
        // Reset form
        setPatientName('');
        setPatientAge('');
        setSelectedDocId('');
        setDate('');
        setTimeSlot('');
        setSymptoms('');
        setSeverity('Low');
      }
    } catch (error) {
      console.error("Failed to secure appointment slot:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Receipt text file download
  const downloadReceipt = (apt: Appointment) => {
    const text = `
=====================================================
          AI HOSPITAL CLINICAL RECONCILIATION
                  CONSULTATION TICKET
=====================================================
Ticket Identifier:  ${apt.id}
Generated On:       ${new Date().toLocaleDateString()}
Registration Status: CONFIRMED

PATIENT INFORMATION
-----------------------------------------------------
Name:               ${apt.patientName}
Age:                ${apt.patientAge} Years Old
Clinical Severity:  ${apt.severity.toUpperCase()} Priority

SCHEDULING DETAILS
-----------------------------------------------------
Date of Visit:      ${apt.date}
Preferred Slot:     ${apt.time}
Medical Department: ${apt.specialty}
Assigned Provider:  ${apt.doctorName}

PATIENT CLINICAL MEMORANDUM
-----------------------------------------------------
"${apt.symptoms || 'No custom symptoms submitted.'}"

DIAGNOSTIC INSTRUCTIONS
-----------------------------------------------------
Please report to the department frontdesk 15 minutes 
prior to your designated slot with this clinical 
reconciliation ticket. Present any previous health records 
and relevant scans for medical evaluation.

=====================================================
    Empowering Advanced Medicine through Automation
=====================================================
`;
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Hospital_Reconciliation_Ticket_${apt.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'High': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4 page-reveal" id="appointment-container">
      
      {/* Success Modal */}
      <AnimatePresence id="modal-animate">
        {showSuccessModal && bookedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md" id="success-overlay">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-6 text-center"
              id="success-modal-content"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center" id="success-icon-container">
                <CheckCircle2 className="h-7 w-7 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans" id="success-title">Consultation Slot Secured!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your appointment with <span className="font-semibold text-slate-700 dark:text-slate-300">{bookedReceipt.doctorName}</span> has been locked and confirmed by the automated scheduling agent.
                </p>
              </div>

              {/* Mini Ticket rendering inside modal */}
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 text-left space-y-3 font-mono text-xs text-slate-600 dark:text-slate-300" id="mini-ticket">
                <div className="flex justify-between" id="ticket-hdr"><span className="text-[10px] text-slate-400">TICKET #{bookedReceipt.id}</span> <span className="text-brand-emerald font-bold">CONFIRMED</span></div>
                <div className="h-[1px] bg-slate-200 dark:bg-slate-800"></div>
                <div><span className="text-slate-400">Patient:</span> {bookedReceipt.patientName} ({bookedReceipt.patientAge} yrs)</div>
                <div><span className="text-slate-400">Specialist:</span> {bookedReceipt.doctorName}</div>
                <div><span className="text-slate-400">Schedule:</span> {bookedReceipt.date} @ {bookedReceipt.time}</div>
                <div className="h-[1px] bg-slate-200 dark:bg-slate-800"></div>
                <div className="text-[10px] text-slate-400 text-center uppercase tracking-widest">Presenter Slip</div>
              </div>

              <div className="flex gap-3" id="modal-btn-group">
                <button
                  onClick={() => downloadReceipt(bookedReceipt)}
                  id="btn-dl-rec-modal"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 py-3 text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4" /> Download Ticket
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setBookedReceipt(null);
                  }}
                  id="btn-close-modal"
                  className="flex-1 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-teal text-slate-950 py-3 text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grid Left: Booking Form */}
      <div className="lg:col-span-5 space-y-6" id="apt-grid-left">
        <div className="space-y-2" id="booking-intro">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-sans">
            Schedule a Consultation
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Secure a direct diagnostic consult slot with any of our active medical practitioners. 
          </p>
        </div>

        <form onSubmit={handleBookingSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-lg space-y-5" id="appointment-form">
          
          <div className="space-y-1.5" id="form-patient-name-group">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Patient Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                id="input-patient-name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4" id="form-grid-info">
            <div className="space-y-1.5" id="form-age-group">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Age *</label>
              <input
                type="number"
                required
                min="1"
                max="125"
                value={patientAge}
                onChange={e => setPatientAge(e.target.value)}
                placeholder="Years"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                id="input-patient-age"
              />
            </div>

            <div className="space-y-1.5" id="form-severity-group">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Priority Urgency</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                id="select-severity"
              >
                <option value="Low">Low (Routine Checkup)</option>
                <option value="Medium">Medium (Discomfort/Referral)</option>
                <option value="High">High (Urgent Diagnostics)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5" id="form-doc-group">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Assign Medical Provider *</label>
            <div className="relative">
              <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                required
                value={selectedDocId}
                onChange={e => setSelectedDocId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all appearance-none"
                id="select-doctor"
              >
                <option value="">-- Choose Specialist --</option>
                {activeDoctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialty} ({doc.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4" id="form-grid-schedule">
            <div className="space-y-1.5" id="form-date-group">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Consultation Date *</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                id="input-date"
              />
            </div>

            <div className="space-y-1.5" id="form-time-group">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Time Slot *</label>
              <select
                required
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                id="select-time"
              >
                <option value="">-- Choose Slot --</option>
                <option value="09:00 AM">09:00 AM - Morning</option>
                <option value="10:15 AM">10:15 AM - Morning</option>
                <option value="11:30 AM">11:30 AM - Morning</option>
                <option value="01:30 PM">01:30 PM - Afternoon</option>
                <option value="02:45 PM">02:45 PM - Afternoon</option>
                <option value="04:00 PM">04:00 PM - Evening</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5" id="form-symptoms-group">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Patient Symptoms & Clinical Memo</label>
            <textarea
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              placeholder="Provide a detailed description of discomfort, pains, or chronic issues..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all resize-none"
              id="input-symptoms"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            id="btn-submit-booking"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-teal text-slate-950 py-3 text-sm font-bold shadow-lg shadow-brand-cyan/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Locking Slot...
              </span>
            ) : (
              <>
                Lock Consultation Slot <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Grid Right: Appointment Registry List */}
      <div className="lg:col-span-7 space-y-6" id="apt-grid-right">
        <div className="flex justify-between items-center" id="registry-header">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans" id="registry-heading">
            Clinical Appointments Registry
          </h3>
          <span className="rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
            {appointments.length} Total
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-3" id="empty-registry">
            <Calendar className="mx-auto h-12 w-12 text-slate-400 stroke-[1.5]" />
            <div className="space-y-1">
              <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">No active appointments found</h4>
              <p className="text-xs text-slate-400">Schedule a new consultation slot using the secure booking module on the left.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[650px] overflow-y-auto pr-2" id="appointments-cards-grid">
            {appointments.map(apt => (
              <motion.div
                key={apt.id}
                layoutId={`card-${apt.id}`}
                className={`rounded-xl border p-5 shadow-sm transition-all relative flex flex-col justify-between ${
                  apt.status === 'Cancelled' 
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 opacity-75' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 glow-indigo'
                }`}
                id={`card-${apt.id}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start" id="card-top-row">
                    <div id="card-patient-info">
                      <span className="text-[10px] text-slate-400 font-mono tracking-wider block">ID: {apt.id}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white font-sans text-sm">{apt.patientName}</h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Age: {apt.patientAge} Years</span>
                    </div>

                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${getSeverityColor(apt.severity)}`}>
                      {apt.severity} Risk
                    </span>
                  </div>

                  <div className="h-[1px] bg-slate-100 dark:bg-slate-800"></div>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-sans" id="card-clinic-details">
                    <div className="flex items-center gap-2" id="dt-doc">
                      <Stethoscope className="h-3.5 w-3.5 text-brand-cyan" />
                      <span className="font-semibold text-slate-800 dark:text-slate-300 text-xs truncate max-w-[200px]">{apt.doctorName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-5 leading-none mt-0.5">{apt.specialty}</div>
                    
                    <div className="flex items-center gap-2 pt-1" id="dt-time">
                      <Calendar className="h-3.5 w-3.5 text-brand-indigo" />
                      <span className="font-mono">{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-2" id="dt-clock">
                      <Clock className="h-3.5 w-3.5 text-brand-indigo" />
                      <span className="font-mono">{apt.time}</span>
                    </div>
                  </div>

                  {apt.symptoms && (
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2 text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2" id="card-symptom-text">
                      "{apt.symptoms}"
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between" id="card-action-row">
                  <div className="flex items-center gap-1.5" id="status-display">
                    <span className={`h-2 w-2 rounded-full ${
                      apt.status === 'Confirmed' 
                        ? 'bg-emerald-500 animate-pulse' 
                        : apt.status === 'Cancelled' 
                        ? 'bg-rose-500' 
                        : 'bg-amber-500 animate-pulse'
                    }`}></span>
                    <span className={`text-[11px] font-bold ${
                      apt.status === 'Confirmed' 
                        ? 'text-emerald-500' 
                        : apt.status === 'Cancelled' 
                        ? 'text-rose-500' 
                        : 'text-amber-500'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  {apt.status !== 'Cancelled' ? (
                    <div className="flex items-center gap-2" id="action-btn-group">
                      <button
                        onClick={() => downloadReceipt(apt)}
                        title="Download Slip"
                        id={`btn-dl-rec-${apt.id}`}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onCancelAppointment(apt.id)}
                        id={`btn-cancel-${apt.id}`}
                        className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white px-2.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer"
                      >
                        <X className="h-3 w-3" /> Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Void Consultation</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 flex gap-3 text-slate-500 text-xs" id="appointment-footer-info">
          <Info className="h-5 w-5 text-brand-cyan shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            All appointments secured through the portal are automatically mapped inside the medical staff registry in the dashboard, enabling doctors to track logs and patient queues dynamically.
          </p>
        </div>
      </div>
    </div>
  );
}
