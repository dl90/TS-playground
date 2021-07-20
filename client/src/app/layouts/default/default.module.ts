import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatSidenavModule } from '@angular/material/sidenav'

import { SharedModule } from '../../shared/shared.module'
import { DashboardModule } from '../../modules/dashboard/dashboard.module'
import { PostsModule } from '../../modules/posts/posts.module'

import { DefaultComponent } from './default.component'


@NgModule({
  declarations: [
    DefaultComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    SharedModule,
    DashboardModule,
    PostsModule
  ]
})
export class DefaultModule { }
