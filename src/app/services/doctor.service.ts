import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Appointment } from '../models/appointment.model';

interface SubmitTreatmentRequest {
  appointmentId: number;
  diagnosis: string;
  prescription: string;
}

export interface RecentTreatment {
  id: number;
  patientName: string;
  treatmentDate: string;
  description: string;
}

export interface DoctorDashboard {
  name: string;
  appointmentsToday: number;
  pendingValidations: number;
  recentTreatments: RecentTreatment[];
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:3001/api';
  private refreshDashboardSource = new Subject<void>();
  refreshDashboard$ = this.refreshDashboardSource.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const doctorEmail = localStorage.getItem('email');
    return new HttpHeaders({
      'x-doctor-email': doctorEmail || ''
    });
  }

  getDoctorDashboard(): Observable<DoctorDashboard> {
    const doctorEmail = localStorage.getItem('email');
    const headers = new HttpHeaders().set('x-doctor-email', doctorEmail || '');
    return this.http.get<DoctorDashboard>(`${this.apiUrl}/doctor/dashboard`, { headers });
  }

  getAppointments(): Observable<Appointment[]> {
    const doctorEmail = localStorage.getItem('email');
    const headers = new HttpHeaders().set('x-doctor-email', doctorEmail || '');
    return this.http.get<Appointment[]>(`${this.apiUrl}/doctor/appointments?doctorEmail=${doctorEmail}`, { headers });
  }

  validateAppointment(appointmentId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(
      `${this.apiUrl}/doctor/appointments/${appointmentId}/validate`, 
      {}, 
      { headers }
    );
  }

  getAppointmentInfo(appointmentId: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/doctor/appointments/${appointmentId}`, {
      headers: this.getHeaders()
    });
  }

submitTreatment(requestBody: { appointmentId: number, diagnosis: string, prescription: string }): Observable<any> {
  const headers = this.getHeaders();
  
  return this.http.post<any>(
    `${this.apiUrl}/doctor/treatments`, 
    {
      appointmentId: requestBody.appointmentId,
      diagnosis: requestBody.diagnosis,
      prescription: requestBody.prescription
    },
    { headers }
  ).pipe(
    tap(() => this.triggerDashboardRefresh())
  );
}

  triggerDashboardRefresh(): void {
    this.refreshDashboardSource.next();
  }
}