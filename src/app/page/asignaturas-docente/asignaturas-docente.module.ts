import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignaturasDocentePageRoutingModule } from './asignaturas-docente-routing.module';

import { AsignaturasDocentePage } from './asignaturas-docente.page';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignaturasDocentePageRoutingModule,
    QrCodeModule
  ],
  declarations: [AsignaturasDocentePage]
})
export class AsignaturasDocentePageModule {}
