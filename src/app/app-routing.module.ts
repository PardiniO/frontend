import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from "./pages/auth/login/login.component";
import { RegisterComponent } from "./pages/auth/register/register.component";
import { ReaderComponent } from "./pages/reader/reader.component";
import { AuthGuard } from "./core/guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(module => module.DashboardModule),
      },
      {
        path: 'biblioteca',
        loadChildren: () => import('./pages/library').then(module => module.LibraryModule),
      },
      {
        path: 'cargar',
        loadChildren: () => import('./pages/uploader').then(module => module),
      },
      {
        path: 'ajustes',
        loadChildren: () => import('./pages/settings').then(module => module),
      },
      {
        path: 'estadisticas',
        loadChildren: () => import('./pages/settings').then(module => module),
      },
    ],
  },
  {
    path: 'read/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/reader').then(module => module),
  },
  { 
    path: 'login', 
    component: LoginComponent,
    loadChildren: () => import('./pages/auth/').then(module => module),
  },
  { path: 'register', component: RegisterComponent },
  
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
