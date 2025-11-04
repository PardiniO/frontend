import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReaderComponent } from "./reader.component";
import { ReaderRoutingModule } from './reader-routing.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SharedModule } from '../../components/shared.module';


@NgModule({
  declarations: [ReaderComponent],
  imports: [
    CommonModule,
    ReaderRoutingModule,
    NgxExtendedPdfViewerModule,
    SharedModule
  ]
})
export class ReaderModule { }
