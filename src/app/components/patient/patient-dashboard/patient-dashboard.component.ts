import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../models/appointment.model';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit {
  patientName: string | null = null;
  upcomingAppointments: Appointment[] = [];

  constructor(
    private patientService: PatientService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer le nom du patient depuis AuthService
    this.patientName = this.authService.getUsername();

    // Charger les données du tableau de bord du patient
    this.patientService.getPatientDashboard().subscribe(data => {
      if (data) {
        this.patientName = data.name || this.patientName; // Utiliser le nom retourné par l'API si disponible
        this.upcomingAppointments = data.upcomingAppointments || []; // Assurez-vous que la liste est initialisée
      }
    });
  }

  onBookAppointment(): void {
    this.router.navigate(['/patient/appointments/new']);
  }

  onViewTreatments(): void {
    this.router.navigate(['/patient/treatments']);
  }

  onLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name'); // Supprime également le nom de l'utilisateur
    this.router.navigate(['/login']);
  }
}