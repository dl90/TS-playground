import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'

import { UserService, User } from '@app/shared/services/user.service'

interface time {
  date: string
  hour: number
  minute: number
  second: number
  timeZone: string
  elapsed: number
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private intervalRef: number | undefined
  private local = 'en-US'
  private timeStamp!: Date

  @Output() sidebarOpenChange: EventEmitter<boolean> = new EventEmitter()
  @Input() sidebarOpen!: boolean

  time!: time
  user!: User | null

  constructor (
    private userService: UserService
  ) { }

  ngOnInit (): void {
    this.timeStamp = new Date()
    this.time = this.loadTime()
    this.intervalRef = window.setInterval(() => this.tick(), 1000)

    this.userService.userObservable.subscribe(user => this.user = user)
  }

  ngOnDestroy (): void {
    if (this.intervalRef)
      clearInterval(this.intervalRef)
  }

  loadTime (): time {
    return {
      date: this.timeStamp.toLocaleDateString(this.local, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      hour: this.timeStamp.getHours(),
      minute: this.timeStamp.getMinutes(),
      second: this.timeStamp.getSeconds(),
      timeZone: this.timeStamp.toTimeString().split(' ')[1],
      elapsed: 0
    }
  }

  tick (): void {
    if (this.time.second < 59) {
      this.time.second++
    } else if (this.time.minute < 59 && this.time.elapsed < 2) {
      this.time.minute++
      this.time.elapsed++
      this.time.second = 0
    } else {
      this.timeStamp = new Date()
      this.time = this.loadTime()
    }
  }

  toggleSidebar () {
    this.sidebarOpenChange.emit(!this.sidebarOpen)
  }
}
