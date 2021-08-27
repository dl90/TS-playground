import { NgModule } from '@angular/core'
import { RouterModule, Routes, PreloadAllModules } from '@angular/router'

import { DefaultComponent } from './layouts/default/default.component'
import { DashboardComponent } from './modules/dashboard/dashboard.component'
import { AuthModule } from '@app/modules/auth/auth.module'

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
      { path: 'posts', loadChildren: () => import('./modules/posts/posts.module').then(m => m.PostsModule) },
      { path: 'logs', loadChildren: () => import('./modules/logs/logs.module').then(m => m.LogsModule) },
      { path: '**', redirectTo: '' }
    ]
  },
  { path: '**', redirectTo: '' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
