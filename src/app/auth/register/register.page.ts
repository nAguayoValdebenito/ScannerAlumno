import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Users } from 'src/app/interfaces/users';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Asignaturas } from 'src/app/interfaces/asignaturas';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  usr: Users = {
    id: Date.now().toString(),
    usuario: "",
    email: "",
    password: '',
    role: '',        // Nuevo campo para el rol
    asignaturas:[],
    porcentaje:''
  };

  asg: Asignaturas = {
    asignaturaId: Date.now().toString(),
    nombreAsignatura:'',
    horarioAsignatura:'',
    cuposAsignatura: 0
    
  }

  isProfesor: boolean = false; // Controla la visibilidad del campo de departamento

  constructor(private auths: FirebaseService, private router: Router, private AFAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  ngOnInit() { }

  onRoleChange() {
    if (this.usr.role === 'Profesor') {
      this.isProfesor = true;
    } else {
      this.isProfesor = false;
    }
  }
  

  async register(usuario:any) {
    return await this.firestore.collection('usuarios').add(usuario)
  }

  async regAsignatura(asignatura:any){
    return await this.firestore.collection('asignaturas').add(asignatura)
  }

  async registrarUsuario() {
    try {
      // Crear usuario en Firebase Authentication
      const credencial = await this.AFAuth.createUserWithEmailAndPassword(this.usr.email, this.usr.password);
      
      const userId = credencial.user?.uid;
      if (userId) {
        const datoUsuario: any = {
          id: userId,
          usuario: this.usr.usuario,
          email: this.usr.email,
          password: this.usr.password, // Mejor no guardar la contraseña en Firestore por seguridad
          role: this.usr.role,
          asignaturas: this.usr.asignaturas,
          porcentaje: this.usr.porcentaje
        };
  
        // Guardar el usuario en Firestore
        await this.firestore.collection('usuarios').doc(userId).set(datoUsuario);
        console.log('Usuario registrado exitosamente');
        // Redirigir al login o al área correspondiente
        this.router.navigate(['/login']); // o alguna ruta de éxito
      } else {
        throw new Error('No se pudo obtener el ID del usuario');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Hubo un problema al registrar el usuario. Intente nuevamente.');
    }
  }
  async registroAsignatura() {
    try {
      const datosAsignatura: any = {
        id: this.asg.asignaturaId,
        nombre: this.asg.nombreAsignatura,
        horario: this.asg.horarioAsignatura,
        cupos: this.asg.cuposAsignatura
      };
  
      // Verificar si los campos son válidos antes de registrar la asignatura
      if (this.asg.nombreAsignatura && this.asg.horarioAsignatura) {
        await this.regAsignatura(datosAsignatura);
        console.log('Asignatura registrada');
      } else {
        throw new Error('Debe completar todos los campos de la asignatura');
      }
    } catch (error) {
      console.error('Error al registrar la asignatura:', error);
      alert('Hubo un problema al registrar la asignatura.');
    }
  }
  

}
