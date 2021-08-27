import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { SharedUIModule } from './shared-ui.module'

import { HighchartsChartModule } from 'highcharts-angular'

import { FooterComponent } from './components/footer/footer.component'
import { HeaderComponent } from './components/header/header.component'
import { SidebarComponent } from './components/sidebar/sidebar.component'

import { WorldPopulationComponent } from './charts/world-population/world-population.component'


@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    WorldPopulationComponent
  ],
  imports: [
    RouterModule,
    CommonModule,

    SharedUIModule,
    HighchartsChartModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    WorldPopulationComponent
  ]
})
export class SharedModule { }
