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
        loadChildren: () => import('./pages/library/library.module').then(module => module.LibraryModule),
      },
      {
        path: 'cargar',
        loadChildren: () => import('./pages/uploader/uploader.module').then(module => module.UploaderModule),
      },
      {
        path: 'ajustes',
        loadChildren: () => import('./pages/settings/settings.module').then(module => module.SettingsModule),
      },
      {
        path: 'estadisticas',
        loadChildren: () => import('./pages/stats/stats.module').then(module => module.StatsModule),
      },
    ],
  },
  {
    path: 'read/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/reader/reader.module').then(module => module.ReaderModule),
  },
  { 
    path: 'login', 
    component: LoginComponent,
    loadChildren: () => import('./pages/auth/auth.module').then(module => module.AuthModule),
  },
  { path: 'register', component: RegisterComponent },
  
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
