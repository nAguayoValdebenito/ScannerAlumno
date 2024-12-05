import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.page.html', // Asegúrate de que el nombre coincida con el archivo HTML
  styleUrls: ['./docente.page.scss'], // Asegúrate de que el nombre coincida con el archivo CSS
})
export class DocentePage implements OnInit {


  errorMessage: string = '';  // Almacena mensajes de error

  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit() {

  }

  navigateToAsignaturas() {
    this.router.navigate(['/asignaturas-docente']);
  }

  logout() {
    this.router.navigate(['/login']); // Redirige a la página de login
  }

  
}
