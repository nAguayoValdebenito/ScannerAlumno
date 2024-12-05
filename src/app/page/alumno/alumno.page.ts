import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Asignaturas } from 'src/app/interfaces/asignaturas';
import { ActivatedRoute, Router } from '@angular/router';  // Importamos Router para navegación
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Users } from 'src/app/interfaces/users';
import { LoadingController } from '@ionic/angular'; // Importamos LoadingController

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {
  usuario: Users; // El usuario actual
  asignaturasList: Asignaturas[] = []; // Lista de todas las asignaturas disponibles
  asignaturasFiltradas: Asignaturas[] = [];
  isLoading: boolean = false; // Estado de carga para manejar el desenfoque

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
    this.isLoading = true; // Activar el estado de carga
    const loading = await this.presentLoading('Cargando usuario...'); // Mostrar loading

    this.AFAuth.onAuthStateChanged(user => {
      if (user) {
        // Si el usuario está autenticado, obtenemos sus datos
        const userId = user.uid; // Obtener el ID del usuario autenticado
        this.firebaseService.getUserById(userId).then(userData => {
          this.usuario = userData; // Asignar los datos del usuario
          this.filterAsignaturas(); // Filtrar asignaturas del usuario
        }).catch(error => {
          console.error('Error al obtener usuario:', error);
        }).finally(() => {
          this.dismissLoading(loading); // Ocultar loading después de obtener los datos
          this.isLoading = false; // Desactivar el estado de carga
        });
      } else {
        console.log('No hay usuario autenticado');
        this.dismissLoading(loading); // Ocultar loading si no hay usuario
        this.isLoading = false; // Desactivar el estado de carga
      }
    });
  }

  // Cargar todas las asignaturas disponibles
  async loadAsignaturas() {
    this.isLoading = true; // Activar el estado de carga
    const loading = await this.presentLoading('Cargando asignaturas...'); // Mostrar loading

    this.firebaseService.getAsignaturas().subscribe(asignaturas => {
      this.asignaturasList = asignaturas; // Asignar las asignaturas a la lista
      this.dismissLoading(loading); // Ocultar loading después de obtener las asignaturas
      this.isLoading = false; // Desactivar el estado de carga
    }, error => {
      console.error('Error al cargar asignaturas:', error);
      this.dismissLoading(loading); // Ocultar loading en caso de error
      this.isLoading = false; // Desactivar el estado de carga
    });
  }

  // Filtrar las asignaturas que el usuario tiene inscritas
  filterAsignaturas() {
    if (!this.usuario) {
      console.error('Usuario no encontrado');
      return;
    }

    // Asegúrate de que asignaturas del usuario sea un array de IDs
    const asignaturaIds = this.usuario?.asignaturas || []; // Array de IDs de asignaturas

    // Filtrar las asignaturas que están en la lista de asignaturas del usuario
    this.asignaturasFiltradas = this.asignaturasList.filter(asignatura => 
      asignaturaIds.includes(asignatura.asignaturaId) // Usamos includes() para verificar si el ID de la asignatura está en el array
    );

    console.log('Asignaturas filtradas:', this.asignaturasFiltradas);
  }

  // Mostrar Loading
  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'circles',  // Estilo del spinner
      duration: 0 // duración infinita hasta que se oculte manualmente
    });
    await loading.present();
    return loading;
  }

  // Ocultar Loading
  async dismissLoading(loading) {
    await loading.dismiss();
  }
}
