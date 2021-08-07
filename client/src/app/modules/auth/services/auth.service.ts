import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'

import { environment } from '../../../../environments/environment'
import { UserService } from '../../../shared/services/user.service'


@Injectable()
export class AuthService {

  private http: HttpClient
  private url: string = environment.authServer
  private userService: UserService

  constructor (http: HttpClient, userService: UserService) {
    this.http = http
    this.userService = userService
  }

  getCSRF (): Observable<Object> {
    return this.http.get(this.url + '/auth', { observe: 'response' })
  }

  login (username: string, password: string): Observable<Object> {
    return this.http.post(this.url + '/auth/login', {
      email: username,
      password: password
    }, { observe: 'response', withCredentials: true })
  }

  refreshToken (): Observable<Object> {
    return this.http.get(this.url + '/token/refresh', { observe: 'response', withCredentials: true })
  }
}
