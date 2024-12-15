import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Asignaturas } from 'src/app/interfaces/asignaturas';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Users } from 'src/app/interfaces/users';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {
  usuario: Users; // El usuario actual
  asignaturasList: Asignaturas[] = []; // Lista de todas las asignaturas disponibles
  asignaturasFiltradas: any[] = []; // Lista de asignaturas filtradas con porcentaje de asistencia
  isLoading: boolean = false; // Estado de carga

  constructor(
    private firebaseService: FirebaseService,
    private AFAuth: AngularFireAuth,
    private router: Router,
    private loadingController: LoadingController // Inyectamos LoadingController
  ) {}

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.loadUser(); // Cargar datos del usuario
    this.loadAsignaturas(); // Cargar todas las asignaturas disponibles
  }

  // Cargar el usuario autenticado
  async loadUser() {
    this.isLoading = true;
    const loading = await this.presentLoading('Cargando usuario...');

    this.AFAuth.onAuthStateChanged(user => {
      if (user) {
        const userId = user.uid; // Obtener el ID del usuario autenticado
        this.firebaseService.getUserById(userId).then(userData => {
          this.usuario = userData; // Asignar los datos del usuario
          this.filterAsignaturas(); // Filtrar asignaturas del usuario
        }).catch(error => {
          console.error('Error al obtener usuario:', error);
        }).finally(() => {
          this.dismissLoading(loading);
          this.isLoading = false;
        });
      } else {
        console.log('No hay usuario autenticado');
        this.dismissLoading(loading);
        this.isLoading = false;
      }
    });
  }

  // Cargar todas las asignaturas disponibles
  async loadAsignaturas() {
    this.isLoading = true;
    const loading = await this.presentLoading('Cargando asignaturas...');

    this.firebaseService.getAsignaturas().subscribe(asignaturas => {
      this.asignaturasList = asignaturas; // Asignar las asignaturas a la lista
      this.dismissLoading(loading);
      this.isLoading = false;
    }, error => {
      console.error('Error al cargar asignaturas:', error);
      this.dismissLoading(loading);
      this.isLoading = false;
    });
  }

  // Filtrar las asignaturas que el usuario tiene inscritas
  filterAsignaturas() {
    if (!this.usuario) {
      console.error('Usuario no encontrado');
      return;
    }

    // Asegúrate de que asignaturas del usuario sea un array de IDs
    const asignaturaIds = this.usuario.asignaturas || []; // Array de IDs de asignaturas

    // Filtrar las asignaturas que están en la lista de asignaturas del usuario
    this.asignaturasFiltradas = this.asignaturasList.filter(asignatura =>
      asignaturaIds.includes(asignatura.asignaturaId) // Solo mostrar las asignaturas que tiene el usuario
    );

    // Asociamos el porcentaje de asistencia del usuario a las asignaturas filtradas
    this.asignaturasFiltradas = this.asignaturasFiltradas.map(asignatura => ({
      ...asignatura,
      porcentajeAsistencia: this.usuario.porcentaje // Asociamos el porcentaje de asistencia
    }));

    console.log('Asignaturas filtradas:', this.asignaturasFiltradas);
  }

  // Mostrar Loading
  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'circles',
      duration: 0
    });
    await loading.present();
    return loading;
  }

  // Ocultar Loading
  async dismissLoading(loading) {
    await loading.dismiss();
  }
}
