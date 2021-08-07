import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { UserService } from '../../shared/services/user.service'
import { AuthService } from './services/auth.service'

import { AuthRoutingModule } from './auth-routing.module'
import { LoginComponent } from './components/login/login.component'
import { SignUpComponent } from './components/sign-up/sign-up.component'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent,
    SignUpComponent
  ],
  exports: [LoginComponent, SignUpComponent],
  providers: [AuthService]
})
export class AuthModule { }