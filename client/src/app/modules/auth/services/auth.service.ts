import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs'

import { environment } from 'environments/environment'
import { UserService } from '@app/shared/services/user.service'
import { LoginRequest, TokensResponse, MessageResponse } from '../types/auth-service.interfaces'


export type Callback = (err: null | MessageResponse) => void

@Injectable()
export class AuthService {

  private url: string = environment.authServerURL

  constructor(
    private http: HttpClient
  ) { }

  login(credentials: LoginRequest): Observable<TokensResponse> {
    return this.http.post<TokensResponse>(this.url + '/auth/login', credentials)

  }

  register(email: string, password: string): Observable<HttpResponse<TokensResponse>> {
    return this.http.post<TokensResponse>(this.url + '/auth/register',
      { email, password },
      { observe: 'response', withCredentials: true })
  }

  refreshToken(): Observable<HttpResponse<TokensResponse>> {
    return this.http.get<TokensResponse>(
      this.url + '/token/refresh',
      { observe: 'response', withCredentials: true }
    )
    // .pipe(catchError(this.handelError))
  }

  logout(): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      this.url + '/auth/logout',
      {},
      { withCredentials: true }
    )
  }

  check(): Observable<HttpResponse<MessageResponse>> {
    return this.http.get<MessageResponse>(
      this.url,
      { observe: 'response', withCredentials: true }
    )
  }
}
