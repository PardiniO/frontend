import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth.interceptor";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DropzoneComponent } from './components/dropzone/dropzone.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { HomeComponent } from './pages/home/home.component';
import { LibraryComponent } from './pages/library/library.component';
import { ReaderComponent } from './pages/reader/reader.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UploaderComponent } from './pages/uploader/uploader.component';
import { StatsComponent } from './pages/stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DropzoneComponent,
    SearchBarComponent,
    HomeComponent,
    LibraryComponent,
    ReaderComponent,
    ProfileComponent,
    SettingsComponent,
    UploaderComponent,
    StatsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
