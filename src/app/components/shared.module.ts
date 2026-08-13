import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { DropzoneComponent } from "./dropzone/dropzone.component";
import { LastActiveBookComponent } from "./last-active-book/last-active-book.component";
import { HighlightToolbarComponent } from "./highlight-toolbar/highlight-toolbar.component";
import { NavbarComponent } from "./header/navbar/navbar.component";
import { NotePanelComponent } from "./note-panel/note-panel.component";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from './header/logo/logo.component';
import { AuthComponent } from './header/auth/auth.component';


@NgModule({
  declarations: [
    DropzoneComponent,
    LastActiveBookComponent,
    HighlightToolbarComponent,
    NavbarComponent,
    NotePanelComponent,
    ProgressBarComponent,
    SidebarComponent,
    LogoComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    DropzoneComponent,
    LastActiveBookComponent,
    HighlightToolbarComponent,
    NavbarComponent,
    NotePanelComponent,
    ProgressBarComponent,
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class SharedModule { }
