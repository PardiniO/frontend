import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { DropzoneComponent } from "./dropzone/dropzone.component";
import { LastActiveBookComponent } from "./last-active-book/last-active-book.component";
import { HighlightToolbarComponent } from "./highlight-toolbar/highlight-toolbar.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { NotePanelComponent } from "./note-panel/note-panel.component";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";


@NgModule({
  declarations: [
    DropzoneComponent,
    LastActiveBookComponent,
    HighlightToolbarComponent,
    NavbarComponent,
    NotePanelComponent,
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    DropzoneComponent,
    LastActiveBookComponent,
    HighlightToolbarComponent,
    NavbarComponent,
    NotePanelComponent,
    ProgressBarComponent,
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
