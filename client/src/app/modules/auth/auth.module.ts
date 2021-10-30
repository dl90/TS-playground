import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'

import { AuthMaterialUIModule } from './auth-material-ui.module'
import { AuthRoutingModule } from './auth-routing.module'
import { AuthService } from './services/auth.service'
import { reducer } from './store/auth.reducer'
import { LoginEffects } from './store/effects/login.effect'

import { AuthComponent } from './auth.component'
import { LoginComponent } from './components/login/login.component'
import { SignUpComponent } from './components/sign-up/sign-up.component'


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    AuthMaterialUIModule,
    StoreModule.forFeature('auth', reducer),
    EffectsModule.forFeature([LoginEffects])
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    SignUpComponent
  ],
  providers: [
    AuthService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class AuthModule { }
