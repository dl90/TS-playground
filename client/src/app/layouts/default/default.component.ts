import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  sidebarOpen: boolean = false

  constructor () { }

  ngOnInit (): void { }

  closeSidebar (): void {
    this.sidebarOpen = false
  }

}
