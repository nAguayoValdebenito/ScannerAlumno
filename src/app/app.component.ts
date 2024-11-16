import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
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

 
}
