import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { ImageService } from 'src/app/material-component/image/image.service';

@Component({
  selector: 'app-search-image',
  templateUrl: './search-image.component.html',
  styleUrls: ['./search-image.component.css']
})
export class SearchImageComponent {
  
  searchControl = new FormControl();
   
  options = [];
  
  filteredOptions: Observable<any> | undefined;
  
  imgToSearch: any[] = []
  
  constructor(private _imageSvc: ImageService,
    private notifierService: NotifierService) { 
      this.filteredOptions = this.searchControl.valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          if(value == '' || value === undefined){
            return []
          }
          return this.filter(value || '')
        })
        );
    }

  private filter(value: string): Observable<any> {
    return this._imageSvc.search(value)
      .pipe(
        map(response => response.filter((option: any) => {
          return option.name.toLowerCase().indexOf(value.toLowerCase()) === 0

        }))
      )}

  pull(){
    this._imageSvc.pull(this.searchControl.value, '')
      .subscribe((response: any) => {
        this.notifierService.notify('success', `Image ${this.searchControl.value} pull.`)
      },
        (error: any) => {

          this.notifierService.notify('error', `Failed to pull image ${this.searchControl.value} ${error.error}`)
        })
  }
}
