import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public error_message=""
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2)]]
  })
  constructor(public router: Router, private fb: FormBuilder, public authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.authService.userLogin(this.loginForm.value).subscribe((response)=>{
        if(response.code == 200){
          this.authService.setAuthToken(response.data)
          this.error_message = response.message
          setTimeout(()=>{
            this.router.navigateByUrl('/')
          }, 100)
          
        }else{
          this.error_message = response.message
        }
      })
    }else{
      this.error_message = 'Invalid login details.'
    }
    setTimeout(()=>{
      this.error_message=""
    }, 1000)
  }
}
