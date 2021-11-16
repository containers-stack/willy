import { Component, Input, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
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


  ngOnInit(): void {
    
    const ctxMemory = 'memoryChart';
    const ctxCpu = 'cpuChart';
    const ctxNet = 'netChart';

    const memoryChart = new Chart(ctxMemory, {
      type: 'line',
      data: {
        labels: [''],
        datasets: [{
          label: 'MB',
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
        labels: [''],
        datasets: [{
          label: 'CPU',
          data: [''],
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
              text:'CPU%',
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

    const netChart = new Chart(ctxNet, {
      type: 'line',
      data: {
        labels: [''],
        datasets: [{
          label: 'NET I/O',
          data: [0],
          borderColor: '#7bc08c',
          fill: true,
          backgroundColor: '#7bc08c96',
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
      
        debugger
        memoryChart.data.labels?.push('')
        memoryChart.data.datasets.forEach((datasets) =>{
          datasets.data.push(JSON.parse(response.stats).memory_stats.usage / 1024 / 1024)
        })
        
        cpuChart.data.labels?.push('')
        cpuChart.data.datasets.forEach((datasets) =>{
          
          var core_capacity = JSON.parse(response.stats).cpu_stats.system_cpu_usage / JSON.parse(response.stats).cpu_stats.online_cpus
          var cpu_usage = JSON.parse(response.stats).cpu_stats.cpu_usage.total_usage / core_capacity
          datasets.data.push(cpu_usage.toString())
        })

        netChart.data.labels?.push('')
        netChart.data.datasets.forEach((datasets) =>{
          datasets.data.push(JSON.parse(response.stats).networks.eth0.rx_bytes / 1024 / 1024)
        })
        
        memoryChart.update();
        cpuChart.update();
        netChart.update();
      }
    })
  }

  onItemChange(event: any):void{
    console.log('Change to: ' + event.value)
    this.activeStats = event.value;
  }
}