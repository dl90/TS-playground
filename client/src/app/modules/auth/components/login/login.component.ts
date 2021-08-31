import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms'

import { AuthService, Callback } from '../../services/auth.service'
import { emailRgx, passwordRgx } from '@app/util/regex'

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hidePassword = true
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
      // Validators.minLength(8),
      // Validators.maxLength(100),
      // Validators.pattern(passwordRgx)
    ])
  })

  constructor (
    private authService: AuthService
  ) { }

  ngOnInit (): void { }

  emailErrorMessage (): string | undefined {
    if (!this.email)
      return

    for (const error in this.email.errors) {
      switch (error) {
        case 'required':
          return 'Email is required'
        case 'minlength':
          return 'Email must be at least 3 characters long'
        case 'maxlength':
          return 'Email cannot be more than 254 characters long'
        case 'pattern':
          return 'Email must be a valid email address'
        default:
          return 'Email is invalid'
      }
    }

    return
  }

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
        this.loginCallback
      )
    }
  }

  private loginCallback: Callback = err => {
    if (err) {
      this.loginError = err.message
      this.password?.setValue('')
    } else {
      this.loginError = ''
    }
  }
}
