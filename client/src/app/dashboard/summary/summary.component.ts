import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { interval, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  constructor(private http: HttpClient,
              private notifierService: NotifierService) { }

  public systemInfo: any;

  private apiURL = environment.apiURL;

  ngOnInit(): void {

    const source = interval(5000);
    source.pipe()
      .subscribe(() => {
        this.getSummary()
          .subscribe((summary: any) => {
            this.systemInfo = summary
          })
      })
  }

  getSummary() {
    return this.http.get<any>(this.apiURL + '/info/summary')
      .pipe(
        catchError((error: any) => {
          console.log(error)
          this.notifierService.notify('error', `Failed to get system summary: ${error.error}`)
          return throwError(error)
        })
      )
  }

}
