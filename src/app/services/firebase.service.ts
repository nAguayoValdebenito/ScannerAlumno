import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Asignaturas } from '../interfaces/asignaturas';
import { map, Observable } from 'rxjs';
import { Users } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    private AFAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  // Iniciar sesión de un usuario
  login(email: string, password: string): Promise<any> {
    return this.AFAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('Usuario logeado', result.user);
        return result.user;
      })
      .catch((e) => {
        console.log('Error al iniciar sesión', e);
        throw e;
      });
  }

  // Agregar una asignatura a Firestore
  addAsignatura(asignatura: Asignaturas) {
    return this.firestore.collection('asignaturas').add(asignatura);
  }

  // Obtener todas las asignaturas
  getAsignaturas(): Observable<Asignaturas[]> {
    return this.firestore.collection<Asignaturas>('asignaturas').valueChanges();
  }

  // Obtener asignatura por ID
  getAsignaturaById(asignaturaId: string) {
    return this.firestore.collection('asignaturas').doc(asignaturaId).get();
  }

  getUserById(userId: string): Promise<any> {
    return this.firestore.collection('usuarios').doc(userId).get().toPromise().then(doc => {
      if (doc.exists) {
        return doc.data();  // Retorna los datos del usuario
      } else {
        throw new Error('El usuario no existe');
      }
    });
  }
  
  
    // Obtener asignaturas inscritas de un usuario y mapear los datos
    getUserAsignaturas(id: string): Observable<Users> {
      return this.firestore
        .collection('usuarios')
        .doc(id)
        .valueChanges()
        .pipe(
          map((data: any) => {
            if (data) {
              return data as Users; // Mapear los datos a la interfaz Users
            } else {
              console.warn('El documento no tiene datos:', data);
              return {} as Users; // Devuelve un objeto vacío si no hay datos
            }
          })
        );
    }
  
    // Métodos adicionales
    saveUserAsignaturas(id: string, asignaturas: string[]): Promise<void> {
      return this.firestore.collection('usuarios').doc(id).update({
        asignaturas: asignaturas,
      });
    }
  
    // Actualiza las asignaturas del usuario en la base de datos
    updateUserAsignaturas(userId: string, asignaturas: string[]): Promise<void> {
      return this.firestore.collection('usuarios').doc(userId).update({
        asignaturas: asignaturas,
      });
    }
  
    // Inscribir asignaturas (evitar duplicados)
    inscribirAsignaturas(userId: string, selectedAsignaturas: string[]): Promise<void> {
      return this.getUserById(userId).then(userData => {
        const asignaturasActuales = userData?.asignaturas || [];
        
        // Filtra las asignaturas duplicadas
        const nuevasAsignaturas = [...new Set([...asignaturasActuales, ...selectedAsignaturas])];
        
        return this.updateUserAsignaturas(userId, nuevasAsignaturas);
      });
    }
}
