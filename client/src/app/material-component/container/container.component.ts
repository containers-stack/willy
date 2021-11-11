import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSidenav } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { BottomSheetComponent } from 'src/app/shared/component/bottom-sheet/bottom-sheet.component';
import { ContainerService } from './container.service';
import { Subscription } from 'rxjs';
import { SocketLogService } from './container.socket.service';
import { Socket } from 'ngx-socket-io';


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

  public logs: string[] = [];

  private readonly notifier: NotifierService;

  constructor(private _containerSvc: ContainerService,
    private _bottomSheet: MatBottomSheet,
    private notifierService: NotifierService,
    private _socket: Socket,
    private _socketLogService: SocketLogService) {

    this.notifier = notifierService;
  }

  ngOnInit(): void {

    this.getContainers()

    this._socket.on('stream_logs_response', (log: any) =>{
      alert(log.log)
    });
    // const source = interval(60000);
    // this.containerSub = source.subscribe(() => this.getContainers());
    
        // if (response.containerid == this.logContainerContext.id) {
          // if (this.followLogs) {
          //   // this.textarealogs.nativeElement.scrollTop = this.textarealogs.nativeElement.scrollHeight
          // }
    // this.socket.on("stream_stats_response", (response: any) => {
    //   if (response.containerid == this.logContainerContext.id) {
    //     alert(response.stats)
    //   }
    // })
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
        // this.socket.emit('stream_stats_request', id);
        return this.containerInfo;
      })
  }

  containerLogs(container: Container): void {
    this.logContainerContext = container;
    this.sidenav_logs = true;
    this._socketLogService.LogsRequest(container.id);
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

  logsClose() {
    this.sidenav_logs = false;
    this.logClear();
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
    this._containerSvc.getContainerInfo(id)
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

  logClear(){
    this.logs = []
  }
}


