import { Injectable } from '@angular/core'
import { createEffect, ofType } from '@ngrx/effects'
import { Actions } from '@ngrx/effects'
import { catchError, map, exhaustMap, tap } from 'rxjs/operators'
import { of } from 'rxjs'

import { AuthService } from '../../services/auth.service'
import { AuthActionTypes } from '../auth.action-types'
import { loginSuccessAction, loginFailureAction } from '../auth.actions'
import { LoginRequest, TokensResponse, MessageResponse } from '../../types/auth-service.interfaces'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'


@Injectable()
export class LoginEffects {
  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActionTypes.LOGIN_REQUEST),
    exhaustMap((props: { credentials: LoginRequest }) => this.authService.login(props.credentials).pipe(
      map((tokens: TokensResponse) => loginSuccessAction({ response: tokens })),
      catchError((error: HttpErrorResponse) => of(loginFailureAction({
        message: {
          ...error.error,
          status: error.status,
          statusText: error.statusText
        }
      })))
    ))
  ))

  redirectAfterLoginSuccess = createEffect(() => this.actions$.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
    tap(() => this.router.navigate(['/']))
  ), { dispatch: false })


  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) { }
}
