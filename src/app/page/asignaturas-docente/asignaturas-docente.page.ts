import { Component, OnInit } from '@angular/core';
import { Asignaturas } from 'src/app/interfaces/asignaturas';
import { FirebaseService } from 'src/app/services/firebase.service';
import { QrCodeService } from 'src/app/services/qrcode.service';
import { AlertController, LoadingController } from '@ionic/angular'; // Importamos LoadingController
import { Router } from '@angular/router';

@Component({
  selector: 'app-asignaturas-docente',
  templateUrl: './asignaturas-docente.page.html',
  styleUrls: ['./asignaturas-docente.page.scss'],
})
export class AsignaturasDocentePage implements OnInit {

  asignatura: Asignaturas = { asignaturaId: Date.now().toString(), nombreAsignatura: '', horarioAsignatura: '', cuposAsignatura: 0 };
  asignaturasList: Asignaturas[] = [];
  isModalOpen = false;
  selectedAsignaturaId: string = '';
  qrCodeUrl: string = '';
  isLoading = true; // Variable para controlar el estado del cargador

  constructor(
    private firebaseService: FirebaseService,
    private qrCodeService: QrCodeService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController, // Inyectamos LoadingController
    private router: Router
  ) { }

  navigateToHome() {
    this.router.navigate(['/docente']);
  }

  async ngOnInit() {
    // Muestra el LoadingController al iniciar
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Cargando asignaturas...',
    });

    await loading.present();

    // Simula una carga de 2 segundos antes de mostrar el contenido
    setTimeout(async () => {
      this.loadAsignaturas(); // Carga las asignaturas
      this.isLoading = false; // Actualiza el estado
      await loading.dismiss(); // Oculta el cargador
    }, 2000);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Alerta: Campos incompletos
  async presentIncompleteFieldsAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Completa todos los campos.',
      buttons: ['OK']
    });
    await alert.present();
  }

  // Alerta: Asignatura creada con éxito
  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Asignatura creada con éxito.',
      buttons: ['OK']
    });
    await alert.present();
  }

  // Alerta: Confirmación antes de crear la asignatura
  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de querer agregar esta asignatura?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Operación cancelada.');
            this.closeModal(); // Cierra el modal y regresa al HTML
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.confirmAddAsignatura(); // Llama al método para agregar la asignatura
          }
        }
      ]
    });
    await alert.present();
  }

  // Método para agregar una asignatura después de la confirmación
  async confirmAddAsignatura() {
    try {
      const asignaturaData = {
        asignaturaId: this.asignatura.asignaturaId, 
        nombreAsignatura: this.asignatura.nombreAsignatura,
        horarioAsignatura: this.asignatura.horarioAsignatura,
        cuposAsignatura: this.asignatura.cuposAsignatura
      };

      await this.firebaseService.addAsignatura(asignaturaData);

      // Recargar la lista de asignaturas después de agregar
      await this.loadAsignaturas();

      // Limpiar el formulario
      this.clearForm();

      // Cerrar el modal
      this.closeModal();

      console.log('Asignatura agregada correctamente', asignaturaData);

      // Mostrar alerta de éxito
      await this.presentSuccessAlert();
    } catch (error) {
      console.error("Error al agregar asignatura: ", error);
    }
  }

  // Método para agregar una asignatura con confirmación
  async addAsignatura() {
    if (this.asignatura.nombreAsignatura && this.asignatura.horarioAsignatura && this.asignatura.cuposAsignatura) {
      // Mostrar alerta de confirmación
      await this.presentConfirmationAlert();
    } else {
      // Mostrar alerta de campos incompletos
      await this.presentIncompleteFieldsAlert();
    }
  }

  // Método para cargar las asignaturas desde Firebase
  loadAsignaturas() {
    this.firebaseService.getAsignaturas().subscribe((data) => {
      this.asignaturasList = data;  // Guardar las asignaturas obtenidas
    });
  }

  // Método para limpiar el formulario
  clearForm() {
    this.asignatura = { asignaturaId: '', nombreAsignatura: '', horarioAsignatura: '', cuposAsignatura: 0 };
  }

  // Método para generar el código QR
  generateQRCode(asignaturaId: string) {
    console.log("ID proporcionado:", asignaturaId);
    const qrData = `id: ${asignaturaId}`;
    this.qrCodeUrl = qrData;
    console.log("Datos del QR:", qrData);
  }
}
