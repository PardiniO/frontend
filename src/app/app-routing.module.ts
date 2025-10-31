import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { HomeComponent } from './pages/home/home.component';
import { ReaderComponent } from "./pages/reader/reader.component";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { 
    path: '', 
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { 
        path: 'library', 
        loadComponent: () => 
          import('./pages/library/library.component').then(
            module => module.LibraryComponent
          ), 
      },
      { path: 'reader/:id', component: ReaderComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
