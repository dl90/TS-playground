import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

import { emailRgx } from '@app/util/regex'

export interface User {
  readonly email: string
  readonly name: string
}

export interface AccessToken {
  readonly accessToken: string
  readonly expires: number
}


@Injectable(
  // {  providedIn: 'root'}
)
export class UserService {

  private user = new BehaviorSubject<User | null>(null)
  private accessToken = new BehaviorSubject<AccessToken | null>(null)

  userObservable = this.user.asObservable()
  accessTokenObservable = this.accessToken.asObservable()

  constructor () { }

  getUser (): User | null {
    return this.user.getValue()
  }

  setUser (user: User): void {
    this.user.next(user)
  }

  setEmail (email: string): void {
    if (email && emailRgx.test(email) && this.user.getValue())
      this.user.next(Object.assign(this.user.getValue(), { email }))
  }

  setName (name: string): void {
    if (name && name.trim().length > 3 && this.user.getValue())
      this.user.next(Object.assign(this.user.getValue(), { name }))
  }

  logout (): void {
    this.user.next(null)
    this.accessToken.next(null)
  }

  setToken (token: AccessToken): void {
    this.accessToken.next(token)
  }

  getToken (): AccessToken | null {
    return this.accessToken.getValue()
  }
}