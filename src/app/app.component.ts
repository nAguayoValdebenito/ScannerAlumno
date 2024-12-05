import { Component} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Asistencia', url: '/alumno', icon: 'school' },
    { title: 'Asignaturas', url: '/agregar-asignatura', icon: 'book' },
  ];
  public labels = ['Scan QR'];
  constructor(private router: Router, private menu: MenuController) {
    // Escuchar los eventos de navegación para habilitar/deshabilitar el menú
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Deshabilitar el menú en las páginas de login y register
        if (event.url === '/login' || event.url === '/register' || event.url === '/recover-password') {
          this.menu.enable(false);  // Deshabilita el menú
        } else {
          this.menu.enable(true);  // Habilita el menú para otras páginas
        }
      }
    });
    
  }
  logout() {
    this.router.navigate(['/login']); // Redirige a la página de login
  }

 
}
