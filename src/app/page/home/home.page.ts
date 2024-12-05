import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  scanResult: string = '';
  segment = 'scan';
  isLoading = true; // Variable para controlar el estado de carga

  constructor(
    private http: HttpClient,
    private modalController: ModalController,
    private router: Router,
    private utilsService: UtilsService,
    private alertController: AlertController
  ) {}

async startScan() {
  try {
    // Solicitar permisos de cámara
    const granted = await this.requestPermissions();
    if (!granted) {
      alert('QR Necesita permisos');
      return;
    }

    // Inicia el escaneo con BarcodeScanner
    const { barcodes } = await BarcodeScanner.scan();

    if (!barcodes || barcodes.length === 0) {
      alert('QR no detectado');
      return;
    }

    const rawValue = barcodes[0].rawValue;

    // Procesar el código QR
    await this.processQRCode(rawValue);

  } catch (error) {
    console.error('Error en el escaneo:', error);
    alert('Error Scaneo QR');
  }
}

async requestPermissions(): Promise<boolean> {
  const { camera } = await BarcodeScanner.requestPermissions();
  return camera === 'granted';
}

private async processQRCode(rawValue: string) {
  let qrData;

  try {
    // Intentar parsear el QR como JSON
    qrData = JSON.parse(rawValue);
  } catch (parseError) {
    console.error('Error al parsear el QR:', parseError);
    alert('Qr Invalido');
    return;
  }

  console.log('Datos del QR procesados:', qrData);

  this.router.navigate(['/home'], { queryParams: { scanData: JSON.stringify(qrData) } });
}



  logout() {
    this.router.navigate(['/login']); // Redirige a la página de login
  }

  async ngOnInit() {
    // Muestra el loading al iniciar la página
    const loading = await this.utilsService.loading();
    await loading.present();

    // Delay de 2 segundos
    setTimeout(() => {
      loading.dismiss(); // Oculta el loading después de 2 segundos
      this.isLoading = false; // Cambia el estado para mostrar el contenido
    }, 2000);
  }
}
