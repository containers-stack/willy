import { I } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';

export interface Container {

  id: string;
  name: string;
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
  headers = ['Name', 'Id', 'Status', 'Age', 'Action']
  opened = false;
  constructor() { }

  ngOnInit(): void {

    for (let index = 0; index < 30; index++) {
      
      const container: Container = {
        id: index.toString(),
        name: `contaner-${index}`,
        status: 'Running',
        age: 'Up to 5 Minutes'
      }
      this.containers.push(container)
    }
  }

}
