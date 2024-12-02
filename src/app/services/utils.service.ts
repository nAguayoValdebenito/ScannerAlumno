import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular/providers/loading-controller';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);

  constructor() { }

  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }
}
