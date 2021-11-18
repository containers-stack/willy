import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto'
import { ContainerService } from '../container.service';
import { interval } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private _containerSvc: ContainerService,
              private notifierService: NotifierService) { }

  @Input() containerid!: string;

  public activeStats: string = 'ram';

  private ctxMemory = 'memoryChart';

  private ctxCpu = 'cpuChart';

  private ctxNet = 'netChart';

  public memoryChart: Chart | undefined;

  public cpuChart: Chart | undefined;
  
  public netChart: Chart | undefined;

  private isOpen = true;

  ngOnInit(): void {
   
    const source = interval(5000);
    source
    .pipe()
    .takeWhile(()=> this.isOpen)
    .subscribe(()=> {
      console.log('STATE:' + this.isOpen)
      this.stats()
    })

    this.memoryChart = new Chart(this.ctxMemory, {
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

    this.cpuChart = new Chart(this.ctxCpu, {
      type: 'line',
      data: {
        labels: [''],
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

    this.netChart = new Chart(this.ctxNet, {
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
  }

  stats():void{

    this._containerSvc.stats(this.containerid)
    .subscribe(
      (response: any)=>{      
      if (response.id == this.containerid) {
        this.memoryChart?.data.labels?.push('')
        this.memoryChart?.data.datasets.forEach((datasets) =>{
          datasets.data.push(response.memory_stats.usage / 1024 / 1024)
        })

        this.cpuChart?.data.labels?.push('')
        this.cpuChart?.data.datasets.forEach((datasets) =>{
          var cpu_count = response.cpu_stats.cpu_usage.percpu_usage.length;
          var cpu_percent = 0.0
          var cpu_delta = response.cpu_stats.cpu_usage.total_usage - response.precpu_stats.cpu_usage.total_usage
          var system_delta = response.cpu_stats.system_cpu_usage - response.precpu_stats.system_cpu_usage
          cpu_percent = cpu_delta / system_delta * 100.0 * cpu_count                    
          datasets.data.push(cpu_percent)
        })
        
        this.netChart?.data.labels?.push('')
        this.netChart?.data.datasets.forEach((datasets) =>{
          datasets.data.push(response.networks.eth0.rx_bytes / 1024 / 1024)
        })

        this.memoryChart?.update();
        this.cpuChart?.update();
        this.netChart?.update();
      }
    },
      (error: any) => {
        this.notifierService.notify('error', `Failed to get container stats: ${error.message}`)  
      })
  }

  onItemChange(event: any):void{
    console.log('Change to: ' + event.value)
    this.activeStats = event.value;
  }

  ngOnDestroy(){
    this.isOpen = false;
  }
}