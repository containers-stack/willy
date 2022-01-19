import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { interval, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor(private http: HttpClient,
              private notifierService: NotifierService) { }



  public events: [] = [];

  private apiURL = environment.apiURL;

  public inProgress = false;

  ngOnInit(): void {
    const source = interval(5000);
    this.inProgress = true;
    source.pipe()
      .subscribe(() => {
        this.getevents()
          .subscribe((events: any) => {
            this.events = events
            this.inProgress = false;
          })
      })
  }

  getevents() {
    return this.http.get<any>(this.apiURL + '/info/events')
      .pipe(
        catchError((error: any) => {
          console.log(error)
          this.notifierService.notify('error', `Failed to get events: ${error.error}`)
          return throwError(error)
        })
      )
  }

  localDateTime(dateNumber: string): string {
    return new Date(dateNumber).toLocaleString()
	  }

}
