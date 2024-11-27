import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';  // Asegúrate de instalar la librería QRCode

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  constructor() { }

  // Método para generar el código QR
  generateQRCode(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(data, { errorCorrectionLevel: 'H' }, (err, url) => {
        if (err) {
          reject(err);  // Si ocurre un error, lo rechazamos
        } else {
          resolve(url);  // Si se genera el código QR, devolvemos la URL
        }
      });
    });
  }
}
