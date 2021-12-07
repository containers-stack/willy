import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { ChartistModule } from 'ng-chartist';
import { SummaryComponent } from './summary/summary.component';
import { EventsComponent } from './events/events.component';
import { ContainersPieComponent } from './containers-pie/containers-pie.component';


@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  declarations: [DashboardComponent, SummaryComponent, EventsComponent, ContainersPieComponent]
})
export class DashboardModule {}
