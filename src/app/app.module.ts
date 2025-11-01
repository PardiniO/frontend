import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./core/interceptors/auth.interceptor";
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { DropzoneComponent } from './components/dropzone/dropzone.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { LibraryComponent } from './pages/library/library.component';
import { ReaderComponent } from './pages/reader/reader.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UploaderComponent } from './pages/uploader/uploader.component';
import { StatsComponent } from './pages/stats/stats.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { NotePanelComponent } from './components/note-panel/note-panel.component';
import { HighlightToolbarComponent } from './components/highlight-toolbar/highlight-toolbar.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LastActiveBookComponent } from './components/last-active-book/last-active-book.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,

    SearchBarComponent,
    DropzoneComponent,
    LibraryComponent,
    ReaderComponent,
    ProfileComponent,
    SettingsComponent,
    UploaderComponent,
    StatsComponent,
    LoginComponent,
    RegisterComponent,
    NotePanelComponent,
    HighlightToolbarComponent,
    DashboardComponent,
    LastActiveBookComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxExtendedPdfViewerModule
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
