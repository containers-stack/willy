import { Component, Input, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import Chart from 'chart.js/auto'
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private socket: Socket) { }

  private sessionid: string = ''

  @Input() containerid!: string;

  public activeStats: string = 'ram';

  public ramData: number[] = [];

  public ramLabels: string[] = [];

  ngOnInit(): void {
    
    const ctxMemory = 'memoryChart';
    const ctxCpu = 'cpuChart';

    const memoryChart = new Chart(ctxMemory, {
      type: 'line',
      data: {
        labels: this.ramLabels,
        datasets: [{
          label: 'RAM',
          data: [0],
          borderColor: '#1e88e5',
          fill: true,
          backgroundColor: '#96c6f09e',
          borderWidth: 2,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title:{
              display:true,
              text:'MB'
            }
          },
          
        
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    const cpuChart = new Chart(ctxCpu, {
      type: 'line',
      data: {
        labels: this.ramLabels,
        datasets: [{
          label: 'CPU',
          data: [0],
          borderColor: '#e59f1e',
          fill: true,
          backgroundColor: '#e59f1ead',
          borderWidth: 2,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title:{
              display:true,
              text:'MB'
            }
          },
          
        
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    this.sessionid = UUID.UUID();
    this.socket.emit('join_stats_request', this.containerid, this.sessionid);
    this.socket.on('stream_stats_response', (response: any) => {
      if (response.containerid == this.containerid) {
        memoryChart.data.labels?.push((Math.floor(Math.random() * 100).toString()))
        memoryChart.data.datasets.forEach((datasets) =>{
          datasets.data.push(JSON.parse(response.stats).memory_stats.usage / 1024 / 1024)
        })
        memoryChart.update();
        
        cpuChart.data.labels?.push(Math.floor(Math.random() * 100).toString())
        cpuChart.data.datasets.forEach((datasets) =>{
          datasets.data.push(JSON.parse(response.stats).cpu_stats.cpu_usage.total_usage)
        })
        cpuChart.update();
      }
    })
  }

  onItemChange(event: any):void{
    console.log('Change to: ' + event.value)
    this.activeStats = event.value;
  }
}