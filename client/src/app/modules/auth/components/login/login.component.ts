import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms'

import { AuthService, Callback } from '@app/modules/auth/services/auth.service'
import { emailRgx, passwordRgx } from '@app/util/regex'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private authService: AuthService

  loginError = ''
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      // Validators.email,
      Validators.minLength(3),
      Validators.maxLength(254),
      Validators.pattern(emailRgx)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(100),
      Validators.pattern(passwordRgx)
    ])
  })

  constructor (authService: AuthService) {
    this.authService = authService
  }

  ngOnInit (): void { }

  check (): void {
    try {
      this.authService.check()
        .subscribe(req => {
          console.log(req)
        })
    } catch (e) {
      console.log(e.message)
    }
  }

  refreshToken (): void {
    this.authService.refreshToken()
      .subscribe(res => {
        console.log(res)
      })
  }

  logout (): void {
    this.authService.logout()
      .subscribe(res => {
        console.log(res)
      })
  }

  get email (): AbstractControl | null { return this.loginForm.get('email') }
  get password (): AbstractControl | null { return this.loginForm.get('password') }

  submit (): void {
    if (this.loginForm.valid) {
      this.authService.login(
        this.email?.value,
        this.password?.value,
        this.loginCallback)
    }
  }

  private loginCallback: Callback = (err, data) => {
    if (err) {
      console.log(err.error)
    } else if (data) {
      console.log('success', data)
    }
  }

}
