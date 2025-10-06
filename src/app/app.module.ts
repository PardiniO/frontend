import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { DropzoneComponent } from './components/dropzone/dropzone.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { BookCardComponent } from './components/book-card/book-card.component';
import { BookCarouselComponent } from './components/book-carousel/book-carousel.component';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';
import { HighlightToolbarComponent } from './components/highlight-toolbar/highlight-toolbar.component';
import { HomeComponent } from './pages/home/home.component';
import { LibraryComponent } from './pages/library/library.component';
import { ReaderComponent } from './pages/reader/reader.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { SettingsComponent } from './pages/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    DropzoneComponent,
    SearchBarComponent,
    BookCardComponent,
    BookCarouselComponent,
    NoteEditorComponent,
    HighlightToolbarComponent,
    HomeComponent,
    LibraryComponent,
    ReaderComponent,
    ProfileComponent,
    DiscoverComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
