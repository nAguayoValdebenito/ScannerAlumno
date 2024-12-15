import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Users } from 'src/app/interfaces/users';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Asignaturas } from 'src/app/interfaces/asignaturas';
import { UtilsService } from 'src/app/services/utils.service';
import { AlertController } from '@ionic/angular';

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

  constructor(private auths: FirebaseService, private router: Router, private AFAuth: AngularFireAuth, private firestore: AngularFirestore,
    private utilsService: UtilsService, private alertController: AlertController
  ) { }

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

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
  
    await alert.present();
  }
  
  async registrarUsuario() {
    try {
      // Validar el formato del correo electrónico
      if (!this.usr.email.endsWith('@alumnoduoc.cl') && !this.usr.email.endsWith('@profesorduoc.cl')) {
        await this.presentAlert('Error en el Registro', 'El correo electrónico debe ser del dominio @alumnoduoc.cl o @profesorduoc.cl.');
        return; // Detiene el proceso si el correo no es válido
      }
  
      // Validar el formato del nombre de usuario (solo letras y números)
      const usernameRegex = /^[a-zA-Z0-9]+$/;
      if (!usernameRegex.test(this.usr.usuario)) {
        await this.presentAlert('Error en el Registro', 'El nombre de usuario solo puede contener letras y números.');
        return; // Detiene el proceso si el nombre de usuario no es válido
      }
  
      // Asignar el rol según el dominio del correo
      if (this.usr.email.endsWith('@alumnoduoc.cl')) {
        this.usr.role = 'alumno';
      } else if (this.usr.email.endsWith('@profesorduoc.cl')) {
        this.usr.role = 'profesor';
      }
  
      // Crear usuario en Firebase Authentication
      const credencial = await this.AFAuth.createUserWithEmailAndPassword(this.usr.email, this.usr.password);
  
      const userId = credencial.user?.uid;
      if (userId) {
        const datoUsuario: any = {
          id: userId,
          usuario: this.usr.usuario,
          email: this.usr.email,
          password: this.usr.password,
          role: this.usr.role,
          asignaturas: this.usr.asignaturas,
          porcentaje: this.usr.porcentaje
        };
  
        // Guardar el usuario en Firestore
        await this.firestore.collection('usuarios').doc(userId).set(datoUsuario);
        console.log('Usuario registrado exitosamente');
  
        // Guardar los datos del usuario en localStorage
        this.utilsService.saveInLocalStorage('userEmail', this.usr.email);
        this.utilsService.saveInLocalStorage('userRole', this.usr.role);
        this.utilsService.saveInLocalStorage('userId', userId);
        this.utilsService.saveInLocalStorage('userAsignaturas', this.usr.asignaturas);
        this.utilsService.saveInLocalStorage('userPorcentaje', this.usr.porcentaje);
  
        // Redirigir al login o al área correspondiente
        await this.presentAlert('Registro Exitoso', 'Se pudo registrar exitosamente.');
        this.router.navigate(['/login']); // o alguna ruta de éxito
      } else {
        throw new Error('No se pudo obtener el ID del usuario');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      await this.presentAlert('Error en el Registro', 'Hubo un problema al registrar el usuario. Intente nuevamente.');
    }
  }
  
  
  
}
