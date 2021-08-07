import { Component, OnInit, Output, EventEmitter } from '@angular/core'

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

  intervalRef: number | undefined
  local = 'en-US'
  time: time
  timeStamp = new Date()

  @Output() toggleSideBarEvt: EventEmitter<boolean> = new EventEmitter()
  sidebarOpen = true
  menuIcon = 'menu_open'

  constructor () {
    this.time = this.loadTime()
  }

  ngOnInit (): void {
    this.intervalRef = window.setInterval(() => {
      this.tick()
    }, 1000)
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
    this.sidebarOpen = !this.sidebarOpen
    this.menuIcon = this.sidebarOpen ? 'menu_open' : 'menu'
    this.toggleSideBarEvt.emit(this.sidebarOpen)
  }
}
