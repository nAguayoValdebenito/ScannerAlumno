import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Asignaturas } from 'src/app/interfaces/asignaturas';
import { ActivatedRoute, Router } from '@angular/router';  // Importamos Router para navegación
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Users } from 'src/app/interfaces/users';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {
  usuario: Users; // El usuario actual
  asignaturasList: Asignaturas[] = []; // Lista de todas las asignaturas disponibles
  asignaturasFiltradas: Asignaturas[] = [];

  constructor(private firebaseService: FirebaseService, private AFAuth: AngularFireAuth) {}

  ngOnInit() {
    this.loadUser(); // Cargar datos del usuario
    this.loadAsignaturas(); // Cargar todas las asignaturas disponibles
  }

  // Cargar el usuario autenticado
  loadUser() {
    this.AFAuth.onAuthStateChanged(user => {
      if (user) {
        // Si el usuario está autenticado, obtenemos sus datos
        const userId = user.uid; // Obtener el ID del usuario autenticado
        this.firebaseService.getUserById(userId).then(userData => {
          this.usuario = userData; // Asignar los datos del usuario
          this.filterAsignaturas(); // Filtrar asignaturas del usuario
        }).catch(error => {
          console.error('Error al obtener usuario:', error);
        });
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }

  // Cargar todas las asignaturas disponibles
  loadAsignaturas() {
    this.firebaseService.getAsignaturas().subscribe(asignaturas => {
      this.asignaturasList = asignaturas; // Asignar las asignaturas a la lista
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
}
