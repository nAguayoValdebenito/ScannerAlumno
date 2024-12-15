import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaAlumnosPageRoutingModule } from './lista-alumnos-routing.module';

import { ListaAlumnosPage } from './lista-alumnos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaAlumnosPageRoutingModule
  ],
  declarations: [ListaAlumnosPage]
})
export class ListaAlumnosPageModule {}
