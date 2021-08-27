import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from '@app/app.component'
import { AppRoutingModule } from '@app/app-routing.module'
import { DefaultModule } from '@app/layouts/default/default.module'

import { UserService } from '@app/shared/services/user.service'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    DefaultModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
