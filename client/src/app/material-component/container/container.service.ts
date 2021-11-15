import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Container } from './container.component';
import { environment } from 'src/environments/environment';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})

export class ContainerService {
  
  // Define API
  apiURL = environment.apiURL;

  constructor(private http: HttpClient,
             private notifierService: NotifierService) { }

  /*===========================================
    CRUD Methods for consuming containers API
  =============================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  // HttpClient API get() method => Fetch container list
  list(): Observable<Container[]> {
    return this.http.get<Container[]>(this.apiURL + '/containers/')
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API get() method => Fetch container
  getContainerInfo(id: string): Observable<Container> {
    return this.http.get<Container>(this.apiURL + '/containers/inspect?id=' + id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  // HttpClient API get() method => Fetch container
  restart(id: string): Observable<boolean> {
    return this.http.get<boolean>(this.apiURL + '/containers/restart?id=' + id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  // HttpClient API post() method => Stop container
  stop(id: string): Observable<any> {
        return this.http.put<any>(this.apiURL + '/containers/stop?id=' + id, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.handleError)
        )
      }  

  start(id: string): Observable<any> {
        return this.http.put<any>(this.apiURL + '/containers/start?id=' + id, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.handleError)
        )
      }  

  // HttpClient API delete() method => Delete Container
  delete(id: string){
    return this.http.delete<any>(this.apiURL + '/containers/remove?id=' + id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // Error handling 
  handleError(error: any) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     this.notifierService.notify('error', errorMessage);
     return throwError(errorMessage);
  }

}