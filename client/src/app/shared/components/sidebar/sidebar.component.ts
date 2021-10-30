import { Component, OnInit } from '@angular/core'

import { UserService, User } from '../../services/user.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  private userService: UserService
  user: User | null = null

  constructor(userService: UserService) {
    this.userService = userService
  }

  ngOnInit(): void {
    this.userService.userObservable.subscribe(u => this.user = u)
    this.userService.setUser({ email: 'test@test.com' })
    this.userService.setEmail('test@test.com')
  }

}
