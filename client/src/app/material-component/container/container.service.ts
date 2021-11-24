import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map'
import { Container } from './container.component';
import { environment } from 'src/environments/environment';
import { NotifierService } from 'angular-notifier';
import { catchError } from 'rxjs/operators';

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
    return this.http.get<Container[]>(this.apiURL + '/containers/')
    .pipe(
      catchError((err) =>{
        console.log(err)
        return throwError(err)
      })
    )
  }

  // HttpClient API get() method => Fetch container
  inspect(id: string): Observable<Container> {
    return this.http.get<Container>(this.apiURL + '/containers/inspect?id=' + id)
    .pipe(
      catchError((err) =>{
        console.log(err)
        return throwError(err)
      })
    )
  }

  // HttpClient API get() method => Fetch container
  restart(id: string): Observable<boolean> {
    return this.http.get<boolean>(this.apiURL + '/containers/restart?id=' + id)
    .pipe(
      catchError((err) =>{
        console.log(err)
        return throwError(err)
      })
    )
  }

  // HttpClient API post() method => pause container
  pause(id: string): Observable<any> {
    return this.http.put<any>(this.apiURL + '/containers/pause?id=' + id, this.httpOptions)
    .pipe(
      catchError((err) =>{
        console.log(err)
        return throwError(err)
      })
    )
  }

  unpause(id: string): Observable<any> {
    return this.http.put<any>(this.apiURL + '/containers/unpause?id=' + id, this.httpOptions)
    .pipe(
      catchError((err) =>{
        console.log(err)
        return throwError(err)
      })
    )
  }

  // HttpClient API delete() method => Delete Container
  delete(id: string) {
    return this.http.delete<any>(this.apiURL + '/containers/remove?id=' + id, this.httpOptions)
    .pipe(
      catchError((err) =>{
        console.log(err)
        return throwError(err)
      })
    )
  }

  // HttpClient API stats() method => get container stats
  stats(id: string) {
    return this.http.get<any>(this.apiURL + '/stats?id=' + id)
    .pipe(
      catchError((err) =>{
        console.log(err)
        return throwError(err)
      })
    )
  }
}