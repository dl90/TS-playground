import { createAction, props } from '@ngrx/store'

import { AuthActionTypes } from './auth.action-types'
import { LoginRequest, MessageResponse, TokensResponse } from '../types/auth-service.interfaces'


export const loginRequestAction = createAction(
  AuthActionTypes.LOGIN_REQUEST,
  props<{ credentials: LoginRequest }>()
)

export const loginSuccessAction = createAction(
  AuthActionTypes.LOGIN_SUCCESS,
  props<{ response: TokensResponse }>()
)

export const loginFailureAction = createAction(
  AuthActionTypes.LOGIN_FAILURE,
  props<{ message: MessageResponse, status?: number, statusText?: string }>()
)

