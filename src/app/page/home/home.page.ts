import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';  // Importar Router para navegación

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  temperature: number | null = null;
  city: string = 'concepción, Chile';
  errorMessage: string = '';
  scanResult: string = '';

  constructor(
    private http: HttpClient, 
    private modalController: ModalController,
    private router: Router  // Inyectamos el Router
  ) { }

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
    
    if (data) {
      this.scanResult = data?.barcode?.displayValue;
      console.log('Código escaneado: ', this.scanResult);
      
      // Redirigir a la página de alumno y pasar el scanResult
      this.router.navigate(['/home'], { queryParams: { scanResult: this.scanResult } });
    }
  }

    // Función que redirige a la página de login
    logout() {
      this.router.navigate(['/login']); // Redirige a la página de login
    }

  ngOnInit() {

  }
}
