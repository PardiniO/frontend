import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReaderComponent } from "./reader.component";
import { ReaderRoutingModule } from './reader-routing.module';


@NgModule({
  declarations: [ReaderComponent],
  imports: [
    CommonModule,
    ReaderRoutingModule
  ]
})
export class ReaderModule { }
