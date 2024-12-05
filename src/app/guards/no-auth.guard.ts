import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from 'src/app/services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private utilsService: UtilsService
  ) {}

  canActivate(): Promise<boolean> {
    return this.afAuth.authState.toPromise().then(user => {
      if (user) {
        // Si el usuario ya está autenticado, redirigir según su rol
        const userRole = this.utilsService.getFromLocalStorage('userRole');
        if (userRole === 'alumno') {
          this.router.navigate(['/home']);
          return false; // Bloquea el acceso a login si es alumno
        } else if (userRole === 'profesor') {
          this.router.navigate(['/docente']);
          return false; // Bloquea el acceso a login si es profesor
        }
      }
      return true; // Permite el acceso si no está autenticado
    });
  }
}
