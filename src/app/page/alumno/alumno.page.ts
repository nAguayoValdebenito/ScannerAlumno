import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Asignaturas } from 'src/app/interfaces/asignaturas';
import { ActivatedRoute, Router } from '@angular/router';  // Importamos Router para navegación

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {
  asignaturasList: { asignatura: Asignaturas; asistencia: number }[] = [];
  scanResult: string = '';  // Variable para almacenar el resultado del QR escaneado

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,  // Inyectamos ActivatedRoute
    private router: Router  // Inyectamos Router para navegación
  ) {}

  ngOnInit() {
    this.loadAsignaturas();  // Cargar asignaturas
    this.route.queryParams.subscribe((params) => {
      this.scanResult = params['scanResult'];  // Obtener el scanResult desde la URL
      if (this.scanResult) {
        this.updateAttendance(this.scanResult);  // Si hay un scanResult, actualizamos la asistencia
      }
    });
  }

  loadAsignaturas() {
    this.firebaseService.getAsignaturas().subscribe((data) => {
      this.asignaturasList = data.map((asignatura) => ({
        asignatura,
        asistencia: 0,
      }));
    });
  }

  updateAttendance(scanResult: string) {
    const asignaturaObj = this.asignaturasList.find(
      (item) => item.asignatura.asignaturaId === scanResult
    );

    if (asignaturaObj && asignaturaObj.asistencia < 100) {
      asignaturaObj.asistencia += 10;  // Aumentar 10% en la asistencia (ajustable)
    }
  }

  // Método para volver al home
  goToHome() {
    this.router.navigate(['/home']);  // Redirigir al home
  }
}
