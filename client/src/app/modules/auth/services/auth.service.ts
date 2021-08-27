import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { environment } from 'environments/environment'
import { UserService, AccessToken } from '@app/shared/services/user.service'

export interface TokenResponse {
  readonly accessToken: string,
  readonly expires: number,
  readonly time: number,
  readonly tokenType: string
}

export interface MessageResponse {
  readonly message: string
  readonly time: number
}

export type Callback = (err: null | MessageResponse) => void

@Injectable()
export class AuthService {

  private url: string = environment.authServerURL

  constructor (
    private http: HttpClient,
    private userService: UserService
  ) { }

  private handelSuccess (response: TokenResponse): void {
    if (response.tokenType === 'access') {
      const token = Object.create(null)
      Object.assign(token, { accessToken: response.accessToken, expires: response.expires })
      Object.freeze(token)

      this.userService.setToken(token as AccessToken)
    }
  }

  private handelError (): void {
    this.userService.setToken(null)
    // this.logout().subscribe()
  }

  private parseError (err: HttpErrorResponse): MessageResponse {
    const { message, time } = err.error
    return this.cleanObj({ message, time })
  }

  private cleanObj (obj: any): any {
    const newObj = Object.create(null)
    Object.assign(newObj, obj)
    Object.freeze(newObj)

    return newObj
  }

  login (email: string, password: string, cb: Callback): void {
    this.http.post<TokenResponse>(
      this.url + '/auth/login',
      { email, password },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
      })
      .subscribe(
        (res: TokenResponse) => {
          this.handelSuccess(res)
          cb(null)
        },
        (err: HttpErrorResponse) => {
          this.handelError()
          cb(this.parseError(err))
        }
      )
  }

  register (email: string, password: string): Observable<HttpResponse<TokenResponse>> {
    return this.http.post<TokenResponse>(this.url + '/auth/register',
      { email, password },
      { observe: 'response', withCredentials: true })
  }

  refreshToken (): Observable<HttpResponse<TokenResponse>> {
    return this.http.get<TokenResponse>(
      this.url + '/token/refresh',
      { observe: 'response', withCredentials: true }
    )
    // .pipe(catchError(this.handelError))
  }

  logout (): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      this.url + '/auth/logout',
      {},
      { withCredentials: true }
    )
      .pipe(
        map(this.cleanObj)
      )
  }

  check (): Observable<HttpResponse<MessageResponse>> {
    return this.http.get<MessageResponse>(
      this.url + '/auth',
      { observe: 'response', withCredentials: true }
    )
  }
}
