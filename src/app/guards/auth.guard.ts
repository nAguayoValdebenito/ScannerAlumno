import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    // Verificar si el usuario está autenticado
    return this.afAuth.authState.toPromise().then(user => {
      if (user) {
        // Verificar el rol desde la localStorage
        const userRole = this.utilsService.getFromLocalStorage('userRole');
        
        // Redirigir al usuario según su rol
        if (userRole === 'alumno') {
          this.router.navigate(['/home']);
          return false; // Bloquea el acceso si el rol no coincide
        } else if (userRole === 'profesor') {
          this.router.navigate(['/docente']);
          return false; // Bloquea el acceso si el rol no coincide
        } else {
          return true; // Permite acceso si no hay rol definido
        }
      } else {
        // Si el usuario no está autenticado, redirigir al login
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
