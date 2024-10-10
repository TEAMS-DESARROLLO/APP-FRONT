import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule, } from '@angular/material/input';

import { SessionService } from '../../session/session.service';
import { LoginInterface } from './login.interface';
import { LoginResponseInterface } from './login.response.interface';
import { LoginService } from './login.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,  MatCardModule,MatInputModule,MatButtonModule,MatIconModule,
    HttpClientModule, FormsModule, ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',

})
export default class LoginComponent {

  mensajeError: string = "Error de credenciales !!!";
  flagMensaje:boolean = false;

  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  @Input() error: string | null | undefined;

  @Output() submitEM = new EventEmitter();

  private loginService = inject(LoginService);
  private sessionService = inject(SessionService);


  constructor(private router:Router, private route: ActivatedRoute,){
    this.sessionService.logout();
  }

  login() {

    this.flagMensaje = false;
    let username = this.form.get("username")?.value;
    let password = this.form.get("password")?.value;

    let login :LoginInterface = {"username":username ,"password":password};

    this.loginService.getTokenWithLogin(login)
      .subscribe({
        next : (res)=> {

          if(res.status != 200){
            this.flagMensaje = true;
          }else {
            console.log("Usuario logado");
            this.sessionService.saveToken(res.token);
            //this.router.navigate (["app/menu"], { relativeTo: this.route })
            this.router.navigate (["app/menu"])
          }
        },
        error : (error) => {

          const resp = error as LoginResponseInterface;
          if(resp.status == 500){
            this.mensajeError = "Erro de conexion con el serv. auth"
            this.flagMensaje = true;
          }else{
            this.mensajeError = resp.msg;
            this.flagMensaje = true;

          }
        }

      }

    );

  }

}
