import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSidenav } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { BottomSheetComponent } from 'src/app/shared/component/bottom-sheet/bottom-sheet.component';
import { ContainerService } from './container.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs-compat';


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

  headers = ['Start/Stop', 'Name', 'Id', 'State', 'Status', 'Action']

  refreshSeconds = [5,10,30,60]

  public refreshInterval = 10;

  
  inProgress = false
  
  statsOpen = false;
  
  @ViewChild('inspect') public sidenav_inspect: MatSidenav | undefined;

  constructor(private _containerSvc: ContainerService,
    private _bottomSheet: MatBottomSheet,
    private notifierService: NotifierService,
    private _router: Router) {}

  ngOnInit() {

    this.getContainers();

    const refreshContainer$ = Observable.of(null)
            .switchMap(e=>this.refreshObs()) 
            .map(() =>{
              this._containerSvc.list()
              .subscribe(
                (response) => {
                this.containers = response;
                },
                (error: any) => {
                  this.notifierService.notify('error', `Failed to list containers: ${error.message}`)  
                })
            })
          .repeat();

    refreshContainer$.subscribe(t => {
              const currentTime = t;
              console.log('refresh interval = '+this.refreshInterval);
          });

        }
          
  refreshObs() {return Observable.timer(this.refreshInterval * 1000)}

  getContainers(): void {
    this.inProgress = true;
    this._containerSvc.list()
      .subscribe(
        (response) => {
        this.containers = response;
        this.inProgress = false;
        },
        (error: any) => {
          this.notifierService.notify('error', `Failed to list containers: ${error.message}`)  
          this.inProgress = false;
        })
  }

  containerInspect(id: string): void {
    this.inProgress = true;
    this._containerSvc.inspect(id)
      .subscribe(
        (response: any) => {
        this.containerInfo = response;
        this.inProgress = false;
        this.sidenav_inspect?.open()
        return this.containerInfo;        
        },
        (error: any) => {
          this.notifierService.notify('error', `Failed to inspect container: ${error.message}`)  
          this.inProgress = false;
      })
  }

  containerLogs(container: Container): void {
      this._router.navigateByUrl(`/logs?id=${container.id}&name=${container.name}`)
  }

  restart(id: string):void {
    this.inProgress = true;
    this._containerSvc.restart(id)
      .subscribe(
        (response: any) => {
        this.notifierService.notify('success', response.msg)
        this.inProgress = false;
      },
      (error: any) => {
        this.notifierService.notify('error', `Failed to restart container: ${error.message}`)  
        this.inProgress = false;
      })
  }

  pause(id: string):void{
    this.inProgress = true;
    this._containerSvc.pause(id)
      .subscribe((response: any) => {
        this.notifierService.notify('success', response.msg)
        this.inProgress = false;

      },
      (error: any) => {
        this.notifierService.notify('error', `Failed to stop container: ${error.message}`)  
        this.inProgress = false;
      })
  }
  
  unpause(id: string):void{
    this.inProgress = true;
    this._containerSvc.unpause(id)
      .subscribe(
        (response: any) => {
        this.notifierService.notify('success', response.msg)
        this.inProgress = false;
        },
      (error: any) => {
        this.notifierService.notify('error', `Failed to unpause container: ${error.message}`)  
        this.inProgress = false;
      })
  }

  delete(id: string):void{
    this.inProgress = true;
    this._containerSvc.delete(id)
      .subscribe((response: any) => {
        this.notifierService.notify('success', response.msg)
        this.inProgress = false;
        this.RemoveElementFromContainers(id);
      },
      (error: any) => {
        this.notifierService.notify('error', `Failed to delete container: ${error.message}`)  
        this.inProgress = false;
      })
  }

  RemoveElementFromContainers(containerId: string) {
    this.containers.forEach((value,index)=>{
        if(value.id==containerId) this.containers.splice(index,1);
    });
  }  

  localDateTime(dateNumber: string): string {
    return new Date(dateNumber).toLocaleString()
  }

  onrefreshSecondsChange(event: any):void{
    this.refreshInterval = event.value;
  }

  openBottomSheet(id: string): void {
    this._containerSvc.inspect(id)
      .subscribe((response:any) => {
        this._bottomSheet.open(BottomSheetComponent, {
          data: {
            containerInfo: response
          }
        })
      })
  }
}


