import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { AuthUIModule } from './auth-ui.module'

import { AuthService } from './services/auth.service'
import { AuthRoutingModule } from './auth-routing.module'
import { LoginComponent } from './components/login/login.component'
import { SignUpComponent } from './components/sign-up/sign-up.component'


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,

    AuthUIModule
  ],
  declarations: [
    LoginComponent,
    SignUpComponent
  ],
  exports: [LoginComponent, SignUpComponent],
  providers: [AuthService]
})
export class AuthModule { }