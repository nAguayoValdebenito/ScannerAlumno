import { Component, OnInit } from '@angular/core';
import { Asignaturas } from 'src/app/interfaces/asignaturas';
import { FirebaseService } from 'src/app/services/firebase.service';
import { QrCodeService } from 'src/app/services/qrcode.service'; // Asegúrate de importar el servicio del QR

@Component({
  selector: 'app-asignaturas-docente',
  templateUrl: './asignaturas-docente.page.html',
  styleUrls: ['./asignaturas-docente.page.scss'],
})
export class AsignaturasDocentePage implements OnInit {

  asignatura: Asignaturas = { asignaturaId: Date.now().toString(), nombreAsignatura: '', horarioAsignatura: '', cuposAsignatura: 0 };  // Objeto para el formulario
  asignaturasList: Asignaturas[] = [];  // Lista de asignaturas obtenidas de Firebase
  isModalOpen = false;  // Variable para controlar la visibilidad del modal
  selectedAsignaturaId: string = '';  // ID de la asignatura seleccionada (inicializado vacío)
  qrCodeUrl: string = '';  // URL del QR generado

  constructor(
    private firebaseService: FirebaseService,
    private qrCodeService: QrCodeService  // Injecta el servicio para generar el código QR
  ) { }

  ngOnInit() {
    this.loadAsignaturas();  // Cargar las asignaturas al iniciar
  }

  // Método para abrir el modal
  openModal() {
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Método para agregar una asignatura
  async addAsignatura() {
    if (this.asignatura.nombreAsignatura && this.asignatura.horarioAsignatura && this.asignatura.cuposAsignatura) {
      try {
        // Crear un objeto con los datos de la asignatura
        const asignaturaData = {
          asignaturaId: this.asignatura.asignaturaId, 
          nombreAsignatura: this.asignatura.nombreAsignatura,
          horarioAsignatura: this.asignatura.horarioAsignatura,
          cuposAsignatura: this.asignatura.cuposAsignatura
        };
  
        // Agregar la asignatura a Firebase
        await this.firebaseService.addAsignatura(asignaturaData);
        
  
        // Actualizar el objeto de la asignatura con el ID de Firebase
        const asignaturaConId = {
          ...asignaturaData,
          asignaturaId: asignaturaData.asignaturaId
        };
  
        // Recargar la lista de asignaturas después de agregar
        await this.loadAsignaturas();
  
        // Limpiar el formulario
        this.clearForm();
  
        // Cerrar el modal
        this.closeModal();
  
        console.log('Asignatura agregada correctamente', asignaturaConId);
      } catch (error) {
        console.error("Error al agregar asignatura: ", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
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
  this.firebaseService.getAsignaturaById(asignaturaId).subscribe(
    (asignatura:any) => {
      const { nombreAsignatura, horarioAsignatura, cuposAsignatura } = asignatura;
      const qrData = `Asignatura: ${nombreAsignatura}, Horario: ${horarioAsignatura}, Cupos: ${cuposAsignatura}`;
      this.qrCodeUrl = qrData;
      console.log("Datos del QR:", qrData);
    },
    (error) => {
      console.error("Error al obtener los datos de la asignatura:", error);
    }
  );
}

}
