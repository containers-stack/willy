import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Container } from './container.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ContainerService {
  
  // Define API
  apiURL = environment.apiURL;

  constructor(private http: HttpClient) { }

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
  getContainers(): Observable<Container[]> {
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
  getContainer(id: string): Observable<Container> {
    return this.http.get<Container>(this.apiURL + '/container/' + id)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  // HttpClient API post() method => Start container
  createContainer(id: string): Observable<Container> {
    return this.http.post<Container>(this.apiURL + '/Containers' + id + '/start', JSON.stringify(id), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  // HttpClient API post() method => Stop container
  stopContainer(id: string): Observable<Container> {
        return this.http.post<Container>(this.apiURL + '/Containers' + id + '/start', JSON.stringify(id), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.handleError)
        )
      }  

  // HttpClient API put() method => Update Container
  updateContainer(container: Container): Observable<Container> {
    return this.http.put<Container>(this.apiURL + '/Containers/', JSON.stringify(container), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API delete() method => Delete Container
  deleteContainer(id: string){
    return this.http.delete<Container>(this.apiURL + '/Containers/' + id, this.httpOptions)
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
     window.alert(errorMessage);
     return throwError(errorMessage);
  }

}