import { AuthState } from '../../modules/auth/types/auth-store.interfaces'

export interface AppState {
  readonly auth: AuthState;
  readonly isAuthenticated: boolean
}
