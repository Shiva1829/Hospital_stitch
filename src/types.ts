export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  experience: number;
  rating: number;
  availability: string[];
  email: string;
  phone: string;
  status: 'Active' | 'On Leave';
  imageUrl: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  patientName: string;
  patientAge: number;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  symptoms: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface PatientMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'Unread' | 'Read' | 'Replied';
}

export interface PredictionHistory {
  id: string;
  patientName: string;
  patientAge: number;
  diseaseType: 'Heart Disease' | 'Liver Disease' | 'Lungs Disease' | 'Kidney Stone' | 'Cancer' | 'Brain Tumor' | 'CT Scan' | 'X-ray' | 'MRI';
  scanType?: 'CT Scan' | 'X-ray' | 'MRI' | 'None';
  symptomsOrMetrics: Record<string, string | number>;
  confidence: number;
  severity: 'Healthy' | 'Mild' | 'Moderate' | 'Severe';
  diagnosisText: string;
  recommendations: string[];
  date: string;
  suggestedSpecialist: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  date: string;
  details: string;
  type: 'Login' | 'Registration' | 'Analysis' | 'Appointment' | 'System';
}

export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  totalDoctors: number;
  totalPredictions: number;
  totalMessages: number;
}
