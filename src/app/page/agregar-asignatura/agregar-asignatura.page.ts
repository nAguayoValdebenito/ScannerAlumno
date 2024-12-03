import { Component, OnInit } from '@angular/core';
import { Asignaturas } from 'src/app/interfaces/asignaturas';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-agregar-asignatura',
  templateUrl: './agregar-asignatura.page.html',
  styleUrls: ['./agregar-asignatura.page.scss'],
})
export class AgregarAsignaturaPage implements OnInit {

  asignaturasList: Asignaturas[] = []; // Lista de asignaturas disponibles
  selectedAsignaturas: string[] = []; // Lista de IDs de asignaturas seleccionadas
  successMessage = ''; // Mensaje de éxito

  constructor(private firebaseService: FirebaseService,private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.loadAsignaturas(); // Cargar las asignaturas al iniciar
  }

  // Método para cargar las asignaturas desde Firebase
  loadAsignaturas() {
    this.firebaseService.getAsignaturas().subscribe((data) => {
      this.asignaturasList = data;
    });
  }

  // Método para manejar los cambios en la selección
  toggleAsignatura(asignaturaId: string) {
    const index = this.selectedAsignaturas.indexOf(asignaturaId);
    if (index > -1) {
      this.selectedAsignaturas.splice(index, 1); // Eliminar si ya estaba seleccionado
    } else {
      this.selectedAsignaturas.push(asignaturaId); // Agregar si no estaba seleccionado
    }
  }

  inscribirse() {
    if (this.selectedAsignaturas.length > 0) {
      this.afAuth.currentUser.then((user) => {
        if (user) {
          const userId = user.uid;
  
          // Inscribir las asignaturas seleccionadas
          this.firebaseService.inscribirAsignaturas(userId, this.selectedAsignaturas)
            .then(() => {
              this.successMessage = `Te has inscrito correctamente a ${this.selectedAsignaturas.length} asignatura(s).`;
              this.selectedAsignaturas = [];  // Limpiar selección
            })
            .catch((error) => {
              console.error('Error al inscribirse:', error);
              alert('Hubo un problema al inscribirse. Inténtalo nuevamente.');
            });
        } else {
          alert('No se pudo identificar al usuario. Inicia sesión nuevamente.');
        }
      });
    } else {
      alert('Por favor, selecciona al menos una asignatura.');
    }
  }
  
  
  
}
