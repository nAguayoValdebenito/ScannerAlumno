import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Asignaturas } from 'src/app/interfaces/asignaturas';
import { Users } from 'src/app/interfaces/users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.page.html',
  styleUrls: ['./lista-alumnos.page.scss'],
})
export class ListaAlumnosPage implements OnInit {
  asignaturasList: Asignaturas[] = []; // Lista de asignaturas
  usuariosList: Users[] = []; // Lista de usuarios
  asignaturasConUsuarios: { asignatura: Asignaturas; usuarios: Users[] }[] = []; // Datos combinados

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.loadAsignaturasYUsuarios();
  }

  navigateToHome() {
    this.router.navigate(['/docente']);
  }

  // Cargar asignaturas y usuarios
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
