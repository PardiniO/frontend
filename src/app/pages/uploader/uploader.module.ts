import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from "./uploader.component";
import { UploaderRoutingModule } from './uploader-routing.module';
import { SharedModule } from '../../components/shared.module';


@NgModule({
  declarations: [UploaderComponent],
  imports: [
    CommonModule,
    UploaderRoutingModule,
    SharedModule
  ]
})
export class UploaderModule { }
