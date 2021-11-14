import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSidenav } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { BottomSheetComponent } from 'src/app/shared/component/bottom-sheet/bottom-sheet.component';
import { ContainerService } from './container.service';
import { Router } from '@angular/router';



export interface Container {

  id: string;
  name: string;
  state: string;
  status: string;
  age: string;
}

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  containers: Container[] = [];

  containerInfo!: any;

  headers = ['Name', 'Id', 'State', 'Status', 'Created', 'Action']

  @ViewChild('inspect') public sidenav_inspect: MatSidenav | undefined;

  inProgress = false



  private readonly notifier: NotifierService;

  constructor(private _containerSvc: ContainerService,
    private _bottomSheet: MatBottomSheet,
    private notifierService: NotifierService,
    private _router: Router) {

    this.notifier = notifierService;
  }

  ngOnInit(): void {

    this.getContainers();

  }

  getContainers(): void {
    this.inProgress = true;
    this._containerSvc.getContainers()
      .subscribe((response: Container[]) => {
        this.containers = response;
        this.inProgress = false;
      })
  }

  containerInspect(id: string): void {
    this.inProgress = true;
    this._containerSvc.getContainerInfo(id)
      .subscribe((response: Container) => {
        this.containerInfo = response;
        this.inProgress = false;
        this.sidenav_inspect?.open()
        return this.containerInfo;
      })
  }

  containerLogs(container: Container): void {

    this._router.navigateByUrl(`/logs?id=${container.id}&name=${container.name}`)
  }

  restart(id: string) {
    this.inProgress = true;
    this._containerSvc.restart(id)
      .subscribe((response: any) => {
        this.notifier.notify('success', response.msg)
        this.inProgress = false;
      })
  }

  localDateTime(dateNumber: string): string {
    return new Date(dateNumber).toLocaleString()
  }
  openBottomSheet(id: string): void {
    this._containerSvc.getContainerInfo(id)
      .subscribe((response) => {
        this._bottomSheet.open(BottomSheetComponent, {
          data: {
            containerInfo: response
          }
        })
      })
  }
}


