import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.page.html', // Asegúrate de que el nombre coincida con el archivo HTML
  styleUrls: ['./docente.page.scss'], // Asegúrate de que el nombre coincida con el archivo CSS
})
export class DocentePage implements OnInit {

  temperature: number | null = null;  // Almacena la temperatura
  city: string = 'Concepción, Chile';  // Ciudad predeterminada
  errorMessage: string = '';  // Almacena mensajes de error

  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit() {
    this.getWeather();  // Llama a la función para obtener el clima al cargar la vista
  }

  navigateToAsignaturas() {
    this.router.navigate(['/asignaturas-docente']);
  }

  // Función para obtener la temperatura actual de una API
  getWeather() {
    const apiKey = '8eca85a2fbca3c17fc85b92de4bcf7ec';  // Clave API de OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apiKey}&units=metric`;

    this.http.get(url).subscribe(
      (response: any) => {
        this.temperature = response.main.temp;  // Extrae la temperatura de la respuesta de la API
        this.errorMessage = '';  // Limpia mensajes de error previos
      },
      (error) => {
        this.errorMessage = 'No se pudo obtener los datos del clima';  // Muestra un mensaje de error en caso de fallo
        console.error(error);  // Registra el error en la consola para depuración
      }
    );
  }

  
}
