import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
})
export class RecoverPasswordPage {
  email: string = ''; // Variable para capturar el email ingresado

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private alertController: AlertController
  ) {}

  async recoverPassword() {
    if (!this.email) {
      this.showAlert('Error', 'Por favor, ingresa un correo electrónico.');
      return;
    }

    try {
      // Verificar si el correo existe en Firebase
      const usersSnapshot = await this.firestore.collection('usuarios', ref => ref.where('email', '==', this.email)).get().toPromise();
      if (usersSnapshot?.empty) {
        // Si no hay coincidencias, el correo no existe
        this.showAlert('Error', 'El correo no está registrado en el sistema.');
        return;
      }

      // Si el correo existe, enviar el enlace de recuperación
      await this.afAuth.sendPasswordResetEmail(this.email);
      this.showAlert(
        'Correo enviado',
        'Se ha enviado un enlace de recuperación a tu correo institucional.'
      );
    } catch (error) {
      console.error('Error al intentar recuperar contraseña:', error);
      this.showAlert(
        'Error',
        'No se pudo enviar el correo. Intente nuevamente más tarde.'
      );
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
