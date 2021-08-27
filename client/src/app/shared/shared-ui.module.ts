import { NgModule } from '@angular/core'

import { MatDividerModule } from '@angular/material/divider'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatListModule } from '@angular/material/list'
import { FlexLayoutModule } from '@angular/flex-layout'


@NgModule({
  imports: [
    MatDividerModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    FlexLayoutModule
  ],
  exports: [
    MatDividerModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    FlexLayoutModule
  ]
})
export class SharedUIModule { }