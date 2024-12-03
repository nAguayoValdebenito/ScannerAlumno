import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarAsignaturaPage } from './agregar-asignatura.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarAsignaturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarAsignaturaPageRoutingModule {}
