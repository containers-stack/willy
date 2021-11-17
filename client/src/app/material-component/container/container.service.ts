import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map'
import { Container } from './container.component';
import { environment } from 'src/environments/environment';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})

export class ContainerService {

  // Define API
  apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

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
    return this.http.get<Container[]>(this.apiURL + '/containers/');
  }

  // HttpClient API get() method => Fetch container
  inspect(id: string): Observable<Container> {
    return this.http.get<Container>(this.apiURL + '/containers/inspect?id=' + id);
  }

  // HttpClient API get() method => Fetch container
  restart(id: string): Observable<boolean> {
    return this.http.get<boolean>(this.apiURL + '/containers/restart?id=' + id);
  }

  // HttpClient API post() method => Stop container
  stop(id: string): Observable<any> {
    return this.http.put<any>(this.apiURL + '/containers/stop?id=' + id, this.httpOptions)
      .map((response: any) => {
        debugger
        if (response) {

          return response;
        }
        else {
          return null;
        }
      });
  }

  start(id: string): Observable<any> {
    return this.http.put<any>(this.apiURL + '/containers/start?id=' + id, this.httpOptions);
  }

  // HttpClient API delete() method => Delete Container
  delete(id: string) {
    return this.http.delete<any>(this.apiURL + '/containers/remove?id=' + id, this.httpOptions);
  }

  // HttpClient API stats() method => get container stats
  stats(id: string) {
    return this.http.get<any>(this.apiURL + '/stats?id=' + id);
  }
  
}