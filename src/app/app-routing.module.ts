import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from "./pages/auth/login/login.component";
import { RegisterComponent } from "./pages/auth/register/register.component";
import { AuthGuard } from "./core/guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      /*{
        path: '',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(module => module.DashboardModule),
      },
      {
        path: 'biblioteca',
        loadChildren: () => import('./pages/library/library.module').then(module => module.LibraryModule),
      },*/
    ],
  },
  { 
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(module => module.AuthModule),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
