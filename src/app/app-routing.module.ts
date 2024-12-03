import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'recover-password',
    loadChildren: () => import('./auth/recover-password/recover-password.module').then( m => m.RecoverPasswordPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./page/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'docente',
    loadChildren: () => import('./page/docente/docente.module').then( m => m.DocentePageModule)
  },
  {
    path: 'alumno',
    loadChildren: () => import('./page/alumno/alumno.module').then( m => m.AlumnoPageModule)
  },
  {
    path: 'asignaturas-docente',
    loadChildren: () => import('./page/asignaturas-docente/asignaturas-docente.module').then( m => m.AsignaturasDocentePageModule)
  },
  {
    path: 'agregar-asignatura',
    loadChildren: () => import('./page/agregar-asignatura/agregar-asignatura.module').then( m => m.AgregarAsignaturaPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
