import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators'
import { ContainerService } from './container.service';


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

  @ViewChild('logs') public sidenav_logs: MatSidenav | undefined;
  
  inProgress = false

  logs = "";

  private readonly notifier: NotifierService;

  constructor(private containerSvc: ContainerService,
                private notifierService: NotifierService,
                private socket: Socket) { 
                
                  this.notifier = notifierService;
              }

  ngOnInit(): void {
    this.inProgress = true;
    this.containerSvc.getContainers()
    .subscribe((response: Container[])=> {     
      this.containers = response;
      this.inProgress = false;
    })

    this.socket.on("stream_logs_response", (log: any)=>{
      (<HTMLInputElement>document.getElementById('logs')).value += log.data;
    
    })
  }

  containerInspect(id: string): void{
    this.inProgress = true;
    this.containerSvc.getContainerInfo(id)
    .subscribe((response: Container)=> {   
      this.containerInfo = response;      
      this.inProgress = false;
      this.sidenav_inspect?.open()
    })
  }

  containerLogs(id: string): void{
    this.sidenav_logs?.open()
    this.socket.emit('stream_logs_request', id);
  }

  restart(id: string) {
    this.inProgress = true;
    this.containerSvc.restart(id)
    .subscribe((response: any)=> {   
      this.notifier.notify('success', response.msg)
      this.inProgress = false;
    })
  }

  localDateTime(dateNumber: string): string{
    return new Date(dateNumber).toLocaleString()
  }
  
  logsClose(){
    this.sidenav_logs?.close()
  }

}
