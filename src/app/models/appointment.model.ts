export interface Appointment {
  patientEmail: string;
  id?: number;
  patientName: string;
  doctorName: string;
  dateTime: string;  // or Date if you prefer
  appointmentDateTime?: string; // optional for backward compatibility
  reason: string;
  status: string;
}