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

  public ramData: number[] = [];

  public ramLabels: string[] = [];

  ngOnInit(): void {
    const ctxMemory = 'memoryChart';
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
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
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
        memoryChart.data.labels?.push('08:12')
        memoryChart.data.datasets.forEach((datasets) =>{
          var meUsaage = JSON.parse(response.stats).memory_stats.usage - JSON.parse(response.stats).memory_stats.stats.cache + JSON.parse(response.stats).memory_stats.stats.active_file
          datasets.data.push(meUsaage)
        })

        memoryChart.update();
      }
    })
  }
}