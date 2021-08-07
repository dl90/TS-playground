import { Component, OnInit } from '@angular/core'

import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private authService: AuthService

  constructor (authService: AuthService) {
    this.authService = authService
  }

  ngOnInit (): void { }

  csrf (): void {
    this.authService.getCSRF()
      .subscribe(req => {
        console.log(req)
      })
  }

  login (): void {
    this.authService.login('test@test.com', 'Test!123')
      .subscribe(res => {
        console.log(res)
      })
  }

  refreshToken (): void {
    this.authService.refreshToken()
      .subscribe(res => {
        console.log(res)
      })
  }

}
