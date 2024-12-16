import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Asignaturas } from 'src/app/interfaces/asignaturas';
import { Users } from 'src/app/interfaces/users';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.page.html',
  styleUrls: ['./lista-alumnos.page.scss'],
})
export class ListaAlumnosPage implements OnInit {
  asignaturasList: Asignaturas[] = [];
  usuariosList: Users[] = [];
  asignaturasConUsuarios: { asignatura: Asignaturas; usuarios: Users[] }[] = [];
  isLoading = true;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    // Mostrar pantalla de carga
    const loading = await this.loadingController.create({
      message: 'Cargando datos...',
    });
    await loading.present();

    // Simulamos el tiempo fijo de carga (2 segundos)
    setTimeout(async () => {
      // Una vez que pase el tiempo, cargamos los datos
      this.loadAsignaturasYUsuarios();

      // Ocultamos el loader
      await loading.dismiss();
      this.isLoading = false; // Cambiamos el estado de carga
    }, 2000); // Tiempo fijo de espera (2 segundos)
  }

  navigateToHome() {
    this.router.navigate(['/docente']);
  }

  // Cargar asignaturas y usuarios desde Firebase
  loadAsignaturasYUsuarios() {
    this.firebaseService.getAsignaturas().subscribe(asignaturas => {
      this.asignaturasList = asignaturas;

      this.firebaseService.getAllUsuarios().subscribe(usuarios => {
        this.usuariosList = usuarios;
        this.mapAsignaturasToUsuarios();
      });
    });
  }

  // Combinar asignaturas con usuarios inscritos
  mapAsignaturasToUsuarios() {
    this.asignaturasConUsuarios = this.asignaturasList.map(asignatura => {
      const usuariosInscritos = this.usuariosList.filter(usuario =>
        usuario.asignaturas?.includes(asignatura.asignaturaId)
      );
      return { asignatura, usuarios: usuariosInscritos };
    });
  }
}
