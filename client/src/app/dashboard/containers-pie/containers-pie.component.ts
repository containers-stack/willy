import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-containers-pie',
  templateUrl: './containers-pie.component.html',
  styleUrls: ['./containers-pie.component.css']
})
export class ContainersPieComponent implements OnInit {

  private apiURL = environment.apiURL;
	
	private ctxContainersInfo = 'containersInfo';
	
	public containersInfoChart: Chart | undefined;
  
  constructor(private http: HttpClient,
              private notifierService: NotifierService) { }

  ngOnInit(): void {
  }


  getevents() {
    return this.http.get<any>(this.apiURL + '/info/containers')
      .pipe(
        catchError((error: any) => {
          console.log(error)
          this.notifierService.notify('error', `Failed to get events: ${error.error}`)
          return throwError(error)
        })
      )
  }
  

}
