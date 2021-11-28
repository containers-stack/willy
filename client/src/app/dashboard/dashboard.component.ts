import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import Chart from 'chart.js/auto'
import { plugins } from 'chartist';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnDestroy {

	private apiURL = environment.apiURL;

	private ctxMemoryUsage = 'memoryUsage';
	
	private ctxContainersInfo = 'containersInfo';

	public memoryUsageChart: Chart | undefined;
	
	public containersInfoChart: Chart | undefined;

	public dashboard: any;

	public refreshInterval = 5;

	private isActive = true;

	constructor(private http: HttpClient,
		private notifierService: NotifierService) { }


	ngAfterViewInit() {
		this.isActive = true;
		this.memoryUsageChart = new Chart(this.ctxMemoryUsage, {
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

		this.getDashboard()
			.subscribe((response: any) => {
				this.dashboard = response;
				this.updateChart()
			})

		const refreshContainer$ = Observable.of(null)
			.switchMap(e => this.refreshObs())
			.map(() => {
				if(this.isActive){
					this.getDashboard()
					.subscribe(
						(response: any) => {
							this.dashboard = response;
							this.updateChart()
						},
						(error: any) => {
							this.notifierService.notify('error', `Failed to list containers: ${error.message}`)
						})
				}
			})
			.repeat();

		refreshContainer$.subscribe(t => {
			const currentTime = t;
			console.log('refresh interval = ' + this.refreshInterval);
		});

	}

	// HttpClient API get() method => Fetch dashboard
	getDashboard(): Observable<any> {
		return this.http.get<any>(this.apiURL + '/dashboard/')
			.pipe(
				catchError((err) => {
					console.log(err)
					return throwError(err)
				})
			)
	}

	updateChart() {

		this.memoryUsageChart?.data.labels?.push('')
		this.memoryUsageChart?.data.datasets.forEach((datasets) => {
			
			datasets.data.push(this.dashboard.memoryUsage)
		})

		this.memoryUsageChart?.update()

		this.containersInfoChart?.destroy()

		const backgroundColor: any[] = [];

		if(this.dashboard?.running > 0){
			
			backgroundColor.push('rgb(54, 162, 235)')
		}

		if(this.dashboard?.paused > 0){
			
			backgroundColor.push('rgb(255, 205, 86)')
		}

		if(this.dashboard?.stopped > 0){
			
			backgroundColor.push('rgb(255, 99, 132')
		}

		this.containersInfoChart = new Chart(this.ctxContainersInfo, {
			type: 'doughnut',
			data: {
				labels: [],
				datasets: [{
					data: [],
					backgroundColor: backgroundColor,
				}],

			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: "bottom"
					}
				},
				animation:false

			}

		});
		
		if(this.dashboard?.running > 0){
			this.containersInfoChart?.data.labels?.push('Running')	
			this.containersInfoChart?.data.datasets[0].data.push(this.dashboard?.running)
		}

		if(this.dashboard?.paused > 0){
			this.containersInfoChart?.data.labels?.push('Paused')	
			this.containersInfoChart?.data.datasets[0].data.push(this.dashboard?.paused)
		}
		if(this.dashboard?.stopped > 0){
			this.containersInfoChart?.data.labels?.push('Stopped')	
			this.containersInfoChart?.data.datasets[0].data.push(this.dashboard?.stopped)
		}

		this.containersInfoChart?.update()
	}

	refreshObs() { return Observable.timer(this.refreshInterval * 1000) 
	}

	localDateTime(dateNumber: string): string {
		return new Date(dateNumber).toLocaleString()
	  }

	ngOnDestroy(): void {
		this.isActive = false;
	}

}
