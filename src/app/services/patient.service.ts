import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';
import { Appointment } from '../models/appointment.model';
import { Treatment } from '../models/treatment.model';
import { PatientDashboard } from '../models/patient-dashboard.model';

export interface CreateAppointmentRequest {
  doctorEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8901/api';

  constructor(private http: HttpClient) { }

  getPatientDashboard(): Observable<PatientDashboard> {
    const patientEmail = localStorage.getItem('email');
    const headers = new HttpHeaders({
      'x-patient-email': patientEmail || '',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    
    return this.http.get<PatientDashboard>(`${this.apiUrl}/patient/dashboard`, { headers });
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`);
  }

  createAppointment(appointment: CreateAppointmentRequest): Observable<{ message: string, appointmentId: number }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post<{ message: string, appointmentId: number }>(
      `${this.apiUrl}/patient/appointments`, 
      appointment,
      { headers }
    );
  }

  getPatientTreatments(): Observable<Treatment[]> {
    const patientEmail = localStorage.getItem('email');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<Treatment[]>(
      `${this.apiUrl}/patient/treatments?patientEmail=${patientEmail}`,
      { headers }
    );
  }
}