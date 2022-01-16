import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { interval, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  constructor(private http: HttpClient,
              private notifierService: NotifierService,
              private router: Router) { }

  public systemInfo: any;

  private apiURL = environment.apiURL;

  public inProgress = true;

  ngOnInit(): void {

    const source = interval(5000);
    source.pipe()
      .subscribe(() => {
        this.getSummary()
          .subscribe((summary: any) => {
            this.systemInfo = summary
            this.inProgress = false;
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

  navigate(path: string){

    this.router.navigateByUrl(`/${path}`)

  }

}
