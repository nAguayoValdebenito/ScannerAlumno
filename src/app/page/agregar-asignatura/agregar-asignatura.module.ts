import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarAsignaturaPageRoutingModule } from './agregar-asignatura-routing.module';

import { AgregarAsignaturaPage } from './agregar-asignatura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarAsignaturaPageRoutingModule
  ],
  declarations: [AgregarAsignaturaPage]
})
export class AgregarAsignaturaPageModule {}
