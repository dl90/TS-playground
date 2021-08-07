import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export interface User {
  email: string
  name: string
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user = new BehaviorSubject<User | null>(null)

  userObservable = this.user.asObservable()

  constructor () { }

  getUser () {
    return this.user.getValue()
  }

  hydrate (user: User) {
    this.user.next(user)
  }

  setEmail (email: string) {
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && this.user.getValue())
      this.user.next(Object.assign(this.user.getValue(), { email }))
  }

  setName (name: string) {
    if (name && name.trim().length > 3 && this.user.getValue())
      this.user.next(Object.assign(this.user.getValue(), { name }))
  }

  logout () {
    this.user.next(null)
  }
}