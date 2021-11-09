import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSidenav } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { Socket } from 'ngx-socket-io';
import { BottomSheetComponent } from 'src/app/shared/component/bottom-sheet/bottom-sheet.component';
import { ContainerService } from './container.service';
import { interval, Subscription } from 'rxjs';


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

  sidenav_logs : boolean = false;

  @ViewChild('inspect') public sidenav_inspect: MatSidenav | undefined;

  inProgress = false

  logContainerContext!: Container;

  followLogs: boolean = false;

  containerSub!: Subscription;

  public search: string = "";

  public logs: string = "";

  private readonly notifier: NotifierService;

  constructor(private containerSvc: ContainerService,
    private _bottomSheet: MatBottomSheet,
    private notifierService: NotifierService,
    private socket: Socket) {

    this.notifier = notifierService;
  }

  ngOnInit(): void {

    this.getContainers()

    const source = interval(60000);

    this.containerSub = source.subscribe(() => this.getContainers());
    this.socket.fromEvent('stream_logs_response')
    .subscribe((response: any) => {
        if (response.containerid == this.logContainerContext.id) {
          this.logs += response.log;
          if (this.followLogs) {
            // this.textarealogs.nativeElement.scrollTop = this.textarealogs.nativeElement.scrollHeight
          }
        }
      })
    // this.socket.on("stream_stats_response", (response: any) => {
    //   if (response.containerid == this.logContainerContext.id) {
    //     alert(response.stats)
    //   }
    // })
  }

  getContainers(): void {
    this.inProgress = true;
    this.containerSvc.getContainers()
      .subscribe((response: Container[]) => {
        this.containers = response;
        this.inProgress = false;
      })
  }
  containerInspect(id: string): void {
    this.inProgress = true;
    this.containerSvc.getContainerInfo(id)
      .subscribe((response: Container) => {
        this.containerInfo = response;
        this.inProgress = false;
        this.sidenav_inspect?.open()
        // this.socket.emit('stream_stats_request', id);
        return this.containerInfo;
      })
  }

  containerLogs(container: Container): void {
    this.logContainerContext = container;
    this.socket.emit('stream_logs_request', this.logContainerContext.id);
    this.sidenav_logs = true;
  }

  restart(id: string) {
    this.inProgress = true;
    this.containerSvc.restart(id)
      .subscribe((response: any) => {
        this.notifier.notify('success', response.msg)
        this.inProgress = false;
      })
  }

  localDateTime(dateNumber: string): string {
    return new Date(dateNumber).toLocaleString()
  }

  logsClose() {
    this.sidenav_logs = false;
  }

  changeLiveLog($liveToggle: any): void {
    if ($liveToggle == true) {
      this.followLogs = false
    }
    if ($liveToggle == false) {
      this.followLogs = true
    }

  }
  openBottomSheet(id: string): void {
    this.containerSvc.getContainerInfo(id)
      .subscribe((response) => {
        this._bottomSheet.open(BottomSheetComponent, {
          data: {
            containerInfo: response
          }
        })
      })
  }

  public OnSearched(searchText: string) {
    this.search = searchText;

  }
}


