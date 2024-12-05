import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.page.html',
  styleUrls: ['./docente.page.scss'],
})
export class DocentePage implements OnInit {
  errorMessage: string = ''; // Almacena mensajes de error
  isLoading = true; // Variable para controlar el estado de carga

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    // Muestra el loading al iniciar la página
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Cargando...',
    });
    await loading.present();

    // Simula un retraso de 2 segundos
    setTimeout(() => {
      loading.dismiss(); // Oculta el loading después de 2 segundos
      this.isLoading = false; // Cambia el estado para mostrar el contenido
    }, 2000);
  }

  navigateToAsignaturas() {
    this.router.navigate(['/asignaturas-docente']);
  }
}
