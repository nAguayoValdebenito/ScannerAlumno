import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private AFAuth:AngularFireAuth, private router:Router,) { }

  login(email: string, password: string){
    return this.AFAuth.signInWithEmailAndPassword(email,password).then((result)=>{console.log('usuario logeado',result.user);
    this.router.navigateByUrl('/home');
    return result.user
    }).catch((e)=>{
    console.log('Error al iniciar sesion',e);
    throw e;
    })
    }

}
