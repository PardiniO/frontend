import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from "./stats.component";
import { StatsRoutingModule } from './stats-routing.module';
import { SharedModule } from '../../components/shared.module';


@NgModule({
  declarations: [StatsComponent],
  imports: [
    CommonModule,
    StatsRoutingModule,
    SharedModule
  ]
})
export class StatsModule { }
