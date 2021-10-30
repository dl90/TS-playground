import { Action, createReducer, on } from '@ngrx/store'

import { loginRequestAction, loginSuccessAction, loginFailureAction } from './auth.actions'
import { AuthState } from '../types/auth-store.interfaces'
import { LoginRequest, MessageResponse, TokensResponse } from '../types/auth-service.interfaces'


const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  tokens: null,
  error: null
}

const _authReducer = createReducer(
  initialState,

  on(loginRequestAction, (_: AuthState, props: { credentials: LoginRequest }): AuthState => ({
    ...initialState,
    isLoading: true
  })),

  on(loginSuccessAction, (prevState: AuthState, props: { response: TokensResponse }): AuthState => ({
    ...prevState,
    isLoading: false,
    isAuthenticated: true,
    tokens: props.response,
    error: null
  })),

  on(loginFailureAction, (prevState: AuthState, props: { message: MessageResponse }): AuthState => ({
    ...prevState,
    isLoading: false,
    error: props.message
  }))

)

export function reducer(state: AuthState, action: Action) {
  return _authReducer(state, action)
}
