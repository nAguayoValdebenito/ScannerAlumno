import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/interfaces/users';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private auths: FirebaseService, 
    private router: Router,
    private alertController: AlertController // Inyectamos AlertController
  ) { }

  usr: Users = {
    id: Date.now().toString(),
    usuario: "",
    email: "",
    password: '',
    role: '',
    asignaturas: [],
    porcentaje: ''
  };

  ngOnInit() {}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error de Autenticación',
      message: 'Las credenciales son Incorrectas.',
      buttons: ['OK']
    });

    await alert.present();
  }

  login() {
    this.auths.login(this.usr.email, this.usr.password)
      .then(() => {
        console.log('Usuario logeado');
        
        // Redirección según el dominio del correo
        if (this.usr.email.endsWith('@alumnoduoc.cl')) {
          console.log('Alumno logeado');
          this.router.navigate(['/home']);
        } else if (this.usr.email.endsWith('@profesorduoc.cl')) {
          console.log('Docente logeado');
          this.router.navigate(['/docente']);
        }
        
        // Vaciar los campos después de la redirección
        this.usr.email = '';
        this.usr.password = '';
      })
      .catch(async (e) => {
        console.error('Error al iniciar sesión', e);
        
        // Mostrar la alerta si las credenciales son incorrectas
        await this.presentAlert();
        
        // Vaciar los campos después del error
        this.usr.email = '';
        this.usr.password = '';
      });
  }
  

  
}
