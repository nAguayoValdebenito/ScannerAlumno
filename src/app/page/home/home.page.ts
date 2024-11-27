import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  temperature: number | null = null;  // Almacenará la temperatura
  city: string = 'concepción, Chile';  // Ciudad predeterminada
  errorMessage: string = '';  // To store any error messages
  scanResult: '';

  constructor(private http: HttpClient, private modalController: ModalController) { }

  async startScan() {
    const modal = await this.modalController.create({
    component: BarcodeScanningModalComponent,
    cssClass: 'barcode-scanning-modal',
    componentProps: { 
      formats: [],
      lensFacing: LensFacing.Back
     }
    });
  
    await modal.present();

    const { data } = await modal.onWillDismiss();
    
    if(data){
      this.scanResult= data?.barcode?.displayValue;
    }
  
  }

  ngOnInit() {
    this.getWeather();  // Llamamos a la función para obtener el clima
  }

  // Función para obtener la temperatura
  getWeather() {
    const apiKey = '8eca85a2fbca3c17fc85b92de4bcf7ec';  // Use the Default API key
    const city = this.city;  // Use the city property from the component
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    this.http.get(url).subscribe(
      (response: any) => {
        this.temperature = response.main.temp;  // Extract the temperature from the API response
        this.errorMessage = '';  // Clear any previous error messages
      },
      (error) => {
        this.errorMessage = 'Could not fetch weather data';  // Display an error message if API call fails
        console.error(error);  // Log the error to the console
      }
    );
  }
}
