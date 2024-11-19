import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/interfaces/users';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private auths: FirebaseService, private router: Router) { }

  usr: Users = {
    id: Date.now().toString(),
    usuario: "",
    email: "",
    password: '',
    role: '',
    departamento: ''
  }

  ngOnInit() {
  }

  login() {
    this.auths.login(this.usr.email, this.usr.password).then(() => {
      console.log('Usuario logeado');
      if (this.usr.email.endsWith('@alumnoduoc.cl')) {
        console.log('alumno culiao');;
      } else if (this.usr.email.endsWith('@profesorduoc.cl')) {
        console.log('docente mamawebo');;
      }
    }).catch((e) => {
      console.log('Error al iniciar sesión', e);
    });
  }

}
