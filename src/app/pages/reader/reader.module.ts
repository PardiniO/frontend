import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReaderComponent } from "./reader.component";
import { ReaderRoutingModule } from './reader-routing.module';
import { SharedModule } from '../../components/shared.module';


@NgModule({
  declarations: [ReaderComponent],
  imports: [
    CommonModule,
    ReaderRoutingModule,
    SharedModule
  ]
})
export class ReaderModule { }
