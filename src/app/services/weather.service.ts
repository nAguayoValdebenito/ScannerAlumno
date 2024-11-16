import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {


  private apiKey = '8eca85a2fbca3c17fc85b92de4bcf7ec';  // Aquí pondrás tu API Key
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) { }

  // Función para obtener la temperatura actual
  getWeather() {
    const apiKey = '8eca85a2fbca3c17fc85b92de4bcf7ec';  // Use the Default API key
    const city = 'Madrid';  // Replace with the city you want
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    this.http.get(url).subscribe(response => {
      console.log(response);
    });
  }
  
}
