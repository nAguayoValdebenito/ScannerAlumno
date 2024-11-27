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
    departamento: '' // Nuevo campo para el departamento (solo para Profesor)
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

   // Metodo para actualizar la visibilidad del campo de departamento
   onRoleChange() {
    this.isProfesor = this.usr.role === 'Profesor';
    if(!this.isProfesor){
      this.usr.role === 'Alumno';
    }
  }

  async register(usuario:any) {
    return await this.firestore.collection('usuarios').add(usuario)
  }

  async regAsignatura(asignatura:any){
    return await this.firestore.collection('asignaturas').add(asignatura)
  }

  async registrarUsuario(){
    const credencial = await this.AFAuth.createUserWithEmailAndPassword(this.usr.email,this.usr.password)
    const userId = credencial.user?.uid;
    const datoUsuario: any = {
      id: userId,
      usuario:this.usr.usuario,
      email:this.usr.email,
      password:this.usr.password,
      role:this.usr.role,
      departamento:this.usr.departamento
    }
    await this.register(datoUsuario);
    console.log('usuario registrado');
  }

  async registroAsignatura(){
    const datosAsignatura:any={
      id: this.asg.asignaturaId,
      nombre: this.asg.nombreAsignatura,
      horario: this.asg.horarioAsignatura,
      cupos: this.asg.cuposAsignatura
    }
    await this.regAsignatura(datosAsignatura);
  }

}
