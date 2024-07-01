import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isSignDivVisiable: boolean  = true;

  signUpObj: SignUpModel  = new SignUpModel();
  loginObj: LoginModel  = new LoginModel();

  constructor(private router: Router, private authService: AuthService){}

  async ngOnInit() {
    // if (this.authService.getToken()) {
    //   this.router.navigateByUrl('/message');
    // }
  }

  switchToSignIn(event: Event) {
    event.preventDefault();
    this.isSignDivVisiable = false;
  }

  switchToSignUp(event: Event) {
    event.preventDefault();
    this.isSignDivVisiable = true;
  }

  onRegister() {    
    this.authService.signup({ 
      username: this.signUpObj.name, 
      email: this.signUpObj.email, 
      password: this.signUpObj.password 
    }).subscribe(response => {      
      this.isSignDivVisiable = false;
      // Handle successful login (e.g., store token, redirect)
      alert('Registration Success');
    }, error => {
      console.error('Login failed', error);
      // Handle login error
    });    
  }

  onLogin() {
    this.authService.login({ 
      username: this.loginObj.email, 
      password: this.loginObj.password 
    }).subscribe(response => {      
      this.authService.setToken(response.token);
      // Handle successful login (e.g., store token, redirect)
      this.router.navigateByUrl('/message');
    }, error => {
      console.error('Login failed', error);
      // Handle login error
      alert('Login failed!');
    });
  }

}

export class SignUpModel  {
  name: string;
  email: string;
  password: string;

  constructor() {
    this.email = "";
    this.name = "";
    this.password= ""
  }
}

export class LoginModel  { 
  email: string;
  password: string;

  constructor() {
    this.email = ""; 
    this.password= ""
  }
}
