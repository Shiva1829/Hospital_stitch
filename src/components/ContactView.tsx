import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { PatientMessage } from '../types';

interface ContactViewProps {
  messages: PatientMessage[];
  onSubmitMessage: (messageData: Partial<PatientMessage>) => Promise<any>;
}

export default function ContactView({ messages, onSubmitMessage }: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeInboxMsg, setActiveInboxMsg] = useState<PatientMessage | null>(null);

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Name, Email, and Message text are mandatory to route support requests.");
      return;
    }

    setIsSending(true);
    try {
      const payload: Partial<PatientMessage> = {
        name,
        email,
        phone,
        subject,
        message
      };

      const result = await onSubmitMessage(payload);
      if (result) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Message routing failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  const getUrgencyBadge = (subj: string) => {
    const s = subj.toLowerCase();
    if (s.includes('emergency') || s.includes('acute') || s.includes('urgent') || s.includes('pain')) {
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20 Urgent';
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 Inquiry';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4 page-reveal" id="contact-container">
      
      {/* Page Title Row */}
      <div className="lg:col-span-12 space-y-2" id="contact-heading-group">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-sans">
          Integrated Support & Communications
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Reach out to administrative coordinators or medical staff, or review active messaging logs below.
        </p>
      </div>

      {/* Left Column: Direct Inquiries Form */}
      <div className="lg:col-span-4 space-y-6" id="contact-grid-left">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md space-y-5" id="support-form-card">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800" id="support-card-hdr">
            <MessageSquare className="h-5 w-5 text-brand-cyan" />
            <h3 className="font-bold text-slate-950 dark:text-white font-sans">Direct Dispatch Desk</h3>
          </div>

          <form onSubmit={handleMessageSubmit} className="space-y-4" id="feedback-form">
            <div className="space-y-1" id="g-name">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase font-mono">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Patient or Doctor Name"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                id="in-name"
              />
            </div>

            <div className="space-y-1" id="g-email">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase font-mono">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                id="in-email"
              />
            </div>

            <div className="space-y-1" id="g-phone">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase font-mono">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                id="in-phone"
              />
            </div>

            <div className="space-y-1" id="g-subj">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase font-mono">Inquiry Subject</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Diagnostic report query, fast discharge"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                id="in-subject"
              />
            </div>

            <div className="space-y-1" id="g-msg">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase font-mono">Message / Clinical Request *</label>
              <textarea
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Provide comprehensive details of your inquiry..."
                rows={4}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-2.5 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all resize-none"
                id="in-message"
              />
            </div>

            <AnimatePresence id="status-animate">
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 p-3 text-xs flex items-center gap-2 font-medium"
                  id="notif-success"
                >
                  <FileCheck2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Request dispatched to dispatch supervisor.
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isSending}
              id="btn-dispatch-msg"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-teal text-slate-950 py-2.5 text-xs font-bold hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSending ? (
                <span>Dispatching...</span>
              ) : (
                <>
                  Dispatch Message <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Middle Column: Operational Contact Directories */}
      <div className="lg:col-span-4 space-y-6" id="contact-grid-middle">
        
        {/* Emergency Dispatch Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-brand-rose/20 bg-white dark:bg-slate-900 p-6 shadow-md space-y-4 glow-rose" id="emergency-contact-card">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800" id="em-hdr">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <h3 className="font-bold text-slate-950 dark:text-white font-sans text-sm">Emergency Trauma Hotline</h3>
          </div>
          
          <div className="space-y-3 text-xs" id="em-desc">
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              For active trauma, cardiac crisis, or strokes report directly to Emergency Block C or dial our 24/7 dispatcher instantly.
            </p>
            
            <div className="flex items-center gap-3 text-brand-rose font-mono font-bold text-lg" id="em-tel">
              <Phone className="h-5 w-5 shrink-0" />
              <span>+1 (800) 911-EMERG</span>
            </div>
            
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 flex gap-2.5 text-slate-500 dark:text-slate-400 leading-relaxed" id="em-note">
              <Clock className="h-4 w-4 text-brand-rose shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Response Guarantee:</span> Ambulances are dispatched in less than 6 minutes inside city circles.
              </div>
            </div>
          </div>
        </div>

        {/* Support Registry Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md space-y-5" id="registry-contact-card">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800" id="reg-hdr">
            <ShieldCheck className="h-5 w-5 text-brand-teal" />
            <h3 className="font-bold text-slate-950 dark:text-white font-sans text-sm">General Admin Directory</h3>
          </div>

          <div className="space-y-4 text-xs font-sans text-slate-600 dark:text-slate-400" id="reg-items">
            <div className="flex items-start gap-3" id="reg-location">
              <MapPin className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">AI General Clinical Center</span>
                770 Tech Park Boulevard, Sector 12, <br />
                Silicon Valley, CA 94025
              </div>
            </div>

            <div className="flex items-center gap-3" id="reg-phone">
              <Phone className="h-4 w-4 text-brand-teal shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Admin Helpline</span>
                +1 (555) 500-CARE (Mon-Fri)
              </div>
            </div>

            <div className="flex items-center gap-3" id="reg-mail">
              <Mail className="h-4 w-4 text-brand-teal shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">General Inquiries</span>
                support@aihospital.org
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Live Desk Submissions & Thread Viewer */}
      <div className="lg:col-span-4 space-y-6" id="contact-grid-right">
        <div className="flex justify-between items-center" id="inbox-header">
          <h3 className="font-bold text-slate-950 dark:text-white font-sans text-sm" id="inbox-heading">Active Messaging Tickets</h3>
          <span className="rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-500">
            {messages.length} Tickets
          </span>
        </div>

        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2" id="inbox-scroll">
          {messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => setActiveInboxMsg(msg.id === activeInboxMsg?.id ? null : msg)}
              id={`msg-card-${msg.id}`}
              className={`rounded-xl border p-4 shadow-sm cursor-pointer transition-all ${
                activeInboxMsg?.id === msg.id 
                  ? 'border-brand-cyan bg-slate-50 dark:bg-slate-900 glow-cyan' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/40'
              }`}
            >
              <div className="flex justify-between items-start gap-2" id="msg-top">
                <div id="msg-sender-info">
                  <span className="text-[10px] text-slate-400 font-mono block">Ticket: {msg.id}</span>
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs font-sans truncate max-w-[150px]">{msg.name}</h5>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{msg.email}</span>
                </div>
                
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${getUrgencyBadge(msg.subject)}`}>
                  {msg.subject.length > 15 ? `${msg.subject.substring(0, 15)}...` : msg.subject}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2" id="msg-brief">
                "{msg.message}"
              </p>

              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center" id="msg-footer">
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {msg.date}
                </span>

                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  msg.status === 'Read' || msg.status === 'Replied'
                    ? 'text-emerald-500 bg-emerald-500/10' 
                    : 'text-amber-500 bg-amber-500/10'
                }`}>
                  {msg.status}
                </span>
              </div>

              {/* Collapsible replies tray */}
              <AnimatePresence id="reply-animate">
                {activeInboxMsg?.id === msg.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-3"
                    id="reply-box"
                  >
                    <div className="rounded-lg bg-slate-100 dark:bg-slate-900/60 p-3 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans" id="full-message-text">
                      <strong className="block text-slate-800 dark:text-slate-200 mb-1">Detailed Message:</strong>
                      "{msg.message}"
                    </div>

                    <div className="rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 p-3 text-[11px] text-slate-700 dark:text-brand-cyan/90 leading-relaxed font-sans" id="simulated-staff-reply">
                      <strong className="block text-slate-900 dark:text-white mb-1">✓ Automated Dispatch Response:</strong>
                      Hello {msg.name.split(' ')[0]}, thank you for contacting the AI Hospital Dispatch Desk. Your inquiry regarding "{msg.subject}" has been successfully logged. An administrative coordinator from the relevant outpatient block has been alerted and will coordinate further details directly.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
