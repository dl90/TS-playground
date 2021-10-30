import { MessageResponse, TokensResponse } from "./auth-service.interfaces"


export interface AuthState {
  readonly isLoading: boolean
  readonly isAuthenticated: boolean | null
  readonly tokens: TokensResponse | null
  readonly error: MessageResponse | null
}
