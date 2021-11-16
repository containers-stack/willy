import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { DemoMaterialModule } from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './material.routing';
import { ButtonsComponent } from './buttons/buttons.component';

import { GridComponent } from './grid/grid.component';
import { ListsComponent } from './lists/lists.component';
import { MenuComponent } from './menu/menu.component';
import { TabsComponent } from './tabs/tabs.component';
import { StepperComponent } from './stepper/stepper.component';
import { ExpansionComponent } from './expansion/expansion.component';
import { ChipsComponent } from './chips/chips.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProgressSnipperComponent } from './progress-snipper/progress-snipper.component';
import { ProgressComponent } from './progress/progress.component';
import {
  DialogComponent,
  DialogOverviewExampleDialogComponent
} from './dialog/dialog.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { SliderComponent } from './slider/slider.component';
import { SlideToggleComponent } from './slide-toggle/slide-toggle.component';
import { ContainerComponent } from './container/container.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { BottomSheetComponent } from '../shared/component/bottom-sheet/bottom-sheet.component';
import { SearchTextComponent } from '../shared/component/search-text/search-text.component';
import { HighlightSearchPipe } from '../shared/component/search-text/highlight-search.pipe';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { LogComponent } from './container/log/log.component';
import { StatsComponent } from './container/stats/stats.component';
import { environment } from 'src/environments/environment';

//const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
const config: SocketIoConfig = { url: environment.apiURL , options: {
  transports: ['websocket']
} };


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    NgxJsonViewerModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  entryComponents: [DialogOverviewExampleDialogComponent],
  declarations: [
    ButtonsComponent,
    GridComponent,
    ListsComponent,
    MenuComponent,
    TabsComponent,
    StepperComponent,
    ExpansionComponent,
    ChipsComponent,
    ToolbarComponent,
    ProgressSnipperComponent,
    ProgressComponent,
    DialogComponent,
    DialogOverviewExampleDialogComponent,
    TooltipComponent,
    SnackbarComponent,
    SliderComponent,
    SlideToggleComponent,
    ContainerComponent,
    BottomSheetComponent,
    SearchTextComponent,
    HighlightSearchPipe,
    LogComponent,
    StatsComponent
  ]
})
export class MaterialComponentsModule {}
