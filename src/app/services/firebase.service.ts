import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Asignaturas } from '../interfaces/asignaturas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private AFAuth:AngularFireAuth, private router:Router,private firestore: AngularFirestore) { }

  login(email: string, password: string){
    return this.AFAuth.signInWithEmailAndPassword(email,password).then((result)=>{console.log('usuario logeado',result.user);
    this.router.navigateByUrl('/home');
    return result.user
    }).catch((e)=>{
    console.log('Error al iniciar sesion',e);
    throw e;
    })
    }

    addAsignatura(asignatura: Asignaturas) {
      return this.firestore.collection('asignaturas').add(asignatura);
    }
  
    // Método para obtener todas las asignaturas de Firebase
    getAsignaturas(): Observable<Asignaturas[]> {
      return this.firestore.collection<Asignaturas>('asignaturas').valueChanges();
    }
    getAsignaturaById(id: string) {
      return this.firestore.collection('asignaturas').doc(id).get();
    }
}
