import { Component, OnInit } from '@angular/core';
import { Asignaturas } from 'src/app/interfaces/asignaturas';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular'; // Importamos AlertController

@Component({
  selector: 'app-agregar-asignatura',
  templateUrl: './agregar-asignatura.page.html',
  styleUrls: ['./agregar-asignatura.page.scss'],
})
export class AgregarAsignaturaPage implements OnInit {

  asignaturasList: Asignaturas[] = []; // Lista de asignaturas disponibles
  selectedAsignaturas: string[] = []; // Lista de IDs de asignaturas seleccionadas
  successMessage = ''; // Mensaje de éxito

  constructor(
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth,
    private alertController: AlertController // Inyectamos AlertController
  ) {}

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

  // Alerta: Debes seleccionar una asignatura
  async presentSelectAsignaturaAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Debes seleccionar una asignatura.',
      buttons: ['OK']
    });
    await alert.present();
  }

  // Alerta: Asignatura inscrita con éxito
  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Asignatura inscrita con éxito.',
      buttons: ['OK']
    });
    await alert.present();
  }

  // Alerta: Confirmación antes de inscribirse
  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de querer inscribir la(s) asignatura(s)?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Inscripción cancelada.');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.confirmInscription();
          }
        }
      ]
    });
    await alert.present();
  }

  // Método para inscribirse después de la confirmación
  async confirmInscription() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        const userId = user.uid;

        // Inscribir las asignaturas seleccionadas
        this.firebaseService.inscribirAsignaturas(userId, this.selectedAsignaturas)
          .then(async () => {
            this.successMessage = `Te has inscrito correctamente a ${this.selectedAsignaturas.length} asignatura(s).`;
            this.selectedAsignaturas = [];  // Limpiar selección
            
            // Mostrar alerta de éxito
            await this.presentSuccessAlert();
          })
          .catch(async (error) => {
            console.error('Error al inscribirse:', error);
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'Hubo un problema al inscribirse. Inténtalo nuevamente.',
              buttons: ['OK']
            });
            await alert.present();
          });
      } else {
        this.alertController.create({
          header: 'Error',
          message: 'No se pudo identificar al usuario. Inicia sesión nuevamente.',
          buttons: ['OK']
        }).then(alert => alert.present());
      }
    });
  }

  // Método para inscribirse
  inscribirse() {
    if (this.selectedAsignaturas.length > 0) {
      // Mostrar alerta de confirmación
      this.presentConfirmationAlert();
    } else {
      // Mostrar alerta si no se seleccionaron asignaturas
      this.presentSelectAsignaturaAlert();
    }
  }
}
