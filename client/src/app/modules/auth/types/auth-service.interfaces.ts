
export interface LoginRequest {
  readonly email: string
  readonly password: string
  readonly rememberMe: boolean
}

export interface TokensResponse {
  time?: number
  readonly accessToken: string,
  readonly accessTokenExpires: number,
  readonly refreshToken: string,
  readonly refreshTokenExpires: number
}

export interface MessageResponse {
  time?: number
  readonly message: string
  readonly lockedUntil?: string
  readonly status?: number
  readonly statusText?: string
}