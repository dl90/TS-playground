import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatDividerModule } from '@angular/material/divider'

import { DashboardComponent } from './dashboard.component'


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule
  ]
})
export class DashboardModule { }
