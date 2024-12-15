import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  private afAuth = inject(AngularFireAuth); // Injectando AngularFireAuth
  private firebaseService = inject(FirebaseService); // Inyectando FirebaseService

  constructor() { }

  // Crear y mostrar un loading
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  // Guardar en localStorage
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtener de localStorage
  getFromLocalStorage(key: string) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // Recuperar el usuario logueado
  async getLoggedUser() {
    try {
      const user = await this.afAuth.currentUser;
      if (user && user.uid) {
        // Llama a FirebaseService para obtener los datos del usuario
        const userData = await this.firebaseService.getUserById(user.uid);
        return { id: user.uid, ...userData }; // Combina UID con los datos del usuario
      } else {
        throw new Error('No hay un usuario logueado.');
      }
    } catch (error) {
      console.error('Error al obtener el usuario logueado:', error);
      throw error;
    }
  }
}
