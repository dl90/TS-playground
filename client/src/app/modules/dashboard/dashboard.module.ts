import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatDividerModule } from '@angular/material/divider'

import { DashboardComponent } from './dashboard.component'
import { SharedModule } from '../../shared/shared.module'


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    SharedModule
  ]
})
export class DashboardModule { }
