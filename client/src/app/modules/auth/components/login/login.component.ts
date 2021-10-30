import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Observable, Observer, tap } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { Store, select } from '@ngrx/store'

import { emailRgx } from '@app/util/regex'
import { loginRequestAction } from '../../store/auth.actions'
import { LoginRequest, MessageResponse } from '../../types/auth-service.interfaces'
import { selectError, selectIsLoading } from '../../store/auth.selectors'


@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private debounceTime = 500

  isLoading$!: Observable<boolean>
  error$!: Observable<MessageResponse | null>
  loginForm!: FormGroup
  hidePassword = true
  loginError = ''
  formError = {
    email: ''
  }

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.initialize()
  }

  private initialize(): void {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
        Validators.pattern(emailRgx)
      ]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    })

    this.loginForm.valueChanges.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    ).subscribe(this.formErrorHandler.bind(this))

    this.isLoading$ = this.store.pipe(select(selectIsLoading))
    this.error$ = this.store.pipe(select(selectError))
    this.error$.subscribe(this.responseErrorHandler.bind(this))

  }

  private formErrorHandler(): void {
    if (!this.loginForm)
      return

    for (const error in this.loginForm.get('email')?.errors) {
      switch (error) {
        case 'required':
          this.formError.email = 'Email is required'
          break;
        case 'minlength':
          this.formError.email = 'Email must be at least 3 characters long'
          break;
        case 'maxlength':
          this.formError.email = 'Email cannot be more than 254 characters long'
          break;
        case 'pattern':
          this.formError.email = 'Email must be a valid email address'
          break;
        case 'login':
          this.formError.email = ''
          break;
        default:
          this.formError.email = 'Email is invalid'
      }
    }
  }

  private responseErrorHandler(error: MessageResponse | null): void {
    if (!error)
      return

    this.loginForm.controls.email.setErrors({ 'login': true })
    this.loginForm.controls.password.setErrors({ 'login': true })
    switch (error.status) {
      case 400: // invalid credentials
      case 422: // invalid format
        this.loginError = 'Invalid email or password'
        break;
      case 423: // account locked
        this.loginError = `Account locked until ${new Date(error.lockedUntil!).toLocaleString()}`
        break;
      default:
        this.loginError = 'An error occurred'
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid)
      return

    const loginRequest: LoginRequest = Object.assign({}, this.loginForm.value)
    this.store.dispatch(loginRequestAction({ credentials: loginRequest }))
  }

}
