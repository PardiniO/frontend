import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from "./uploader.component";
import { UploaderRoutingModule } from './uploader-routing.module';


@NgModule({
  declarations: [UploaderComponent],
  imports: [
    CommonModule,
    UploaderRoutingModule
  ]
})
export class UploaderModule { }
