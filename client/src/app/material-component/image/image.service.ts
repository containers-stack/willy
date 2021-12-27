import { Component, OnInit } from '@angular/core';


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map'
import { environment } from 'src/environments/environment';
import { NotifierService } from 'angular-notifier';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ImageService{

  // Define API
  apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  /*===========================================
    CRUD Methods for consuming Images API
  =============================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // HttpClient API get() method => Fetch images list
  list(): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL + '/images/')
    .pipe(
      catchError((err) =>{
        console.log(err)
        return throwError(err)
      })
    )
  }

  // HttpClient API get() method => Fetch image
  inspect(id: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/images/inspect?id=' + id)
    .pipe(
      catchError((err) =>{
        console.log(err)
        return throwError(err)
      })
    )
  }

  // HttpClient API get() method => Fetch image history
  history(id: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/images/history?id=' + id)
    .pipe(
      catchError((err) =>{
        console.log(err)
        return throwError(err)
      })
    )
  }

  // HttpClient API delete() method => Delete Image
  delete(id: string) {
    return this.http.delete<any>(this.apiURL + '/images/remove?id=' + id, this.httpOptions)
    .pipe(
      catchError((err) =>{
        console.log(err)
        return throwError(err)
      })
    )
  }
}