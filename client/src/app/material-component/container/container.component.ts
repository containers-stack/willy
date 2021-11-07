import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
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

  headers = ['Name', 'Id', 'State', 'Status', 'Age', 'Action']
  
  opened = false;

  @ViewChild('inspect') public sidenav: MatSidenav | undefined;

  constructor(private containerSvc: ContainerService) { }

  ngOnInit(): void {

    this.containerSvc.getContainers()
    .subscribe((response: Container[])=> {     
      this.containers = response;
    })
  }


  contsinerInfo(id: string) {
    this.containerSvc.getContainerInfo(id)
    .subscribe((response: Container)=> {   
      this.containerInfo = response;      
      this.sidenav?.open()
    })
  }

}
