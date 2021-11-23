import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto'
import { plugins } from 'chartist';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	private ctxRuningContainers = 'runingContainers';
	private ctxContainersInfo = 'containersInfo';
	
	public containersChart: Chart | undefined;
	public containersInfoChart: Chart | undefined;


	
	ngAfterViewInit() { 

		
		this.containersChart = new Chart(this.ctxRuningContainers, {
			type: 'line',
			data: {
			  labels: [''],
			  datasets: [{
				data: [0],
				borderColor: '#63de9f',
				fill: true,
				backgroundColor: '#63de9491',
				borderWidth: 2,
			  }]
			},
			options: {
			  scales: {
				y: {
				  beginAtZero: true,
				},
			  },
			  plugins: {
				legend: {
				  display: false
				}
			  }
			}
		  });

		  for (let index = 0; index < 20; index++) {
			this.containersChart?.data.labels?.push('')
			this.containersChart?.data.datasets.forEach((datasets) =>{
			  datasets.data.push(Math.random() * 100)
			})
			
		}

		this.containersInfoChart = new Chart(this.ctxContainersInfo, {
			type: 'pie',
			data: {
			  labels: ['Running', 'Exited', 'Puses'],
			  datasets: [{
				data: [30, 15, 20],
				backgroundColor: [
					'rgb(255, 99, 132)',
					'rgb(54, 162, 235)',
					'rgb(255, 205, 86)'
				  ],
			  }],

			  
			},
			options:{
				responsive:true,
				plugins:{
					legend:{
						position:"bottom"
					}
				}
			}
			
		  });

		
		this.containersChart.update();

		}


}
