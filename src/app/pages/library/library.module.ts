import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from "./library.component";
import { LibraryRoutingModule } from './library-routing.module';
import { SharedModule } from '../../components/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [LibraryComponent],
  imports: [
    CommonModule,
    LibraryRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class LibraryModule { }
