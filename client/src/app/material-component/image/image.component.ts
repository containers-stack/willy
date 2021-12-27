import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { PullDialogComponent } from 'src/app/shared/component/pull-dialog/pull-dialog.component';
import { ImageService } from './image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  headers = ['Id', 'Repository', 'Tag', 'Created', 'Size (MB)']

  public images: any;

  refreshSeconds = [5, 10, 30, 60];

  public refreshInterval = 10;

  private isActive = false;

  public inProgress = false

  public imageInfo: any;

  public imageHistory: any;

  @ViewChild('inspect') public sidenav_inspect: MatSidenav | undefined;

  constructor(private _imageSvc: ImageService,
    private notifierService: NotifierService,
    private _router: Router,
    public dialog: MatDialog) { }


  ngOnDestroy(): void {
      this.isActive = false;
  }

    
  ngOnInit(): void {

    this.isActive = true;

    this.getImages()

    const refreshContainer$ = Observable.of(null)
      .switchMap(e => this.refreshObs())
      .map(() => {
        if (this.isActive) {

          this._imageSvc.list()
            .subscribe(
              (response) => {
                this.images = response;
              },
              (error: any) => {
                this.notifierService.notify('error', `Failed to list images: ${error.error}`)
              })
        }
      })
      .repeat();

    refreshContainer$.subscribe(t => {
      const currentTime = t;
      console.log('refresh interval = ' + this.refreshInterval);
    });

  }

  refreshObs() {
    return Observable.timer(this.refreshInterval * 1000)
  }

  getImages(): void {
    this.inProgress = true;
    this._imageSvc.list()
      .subscribe(
        (response) => {
          this.images = response;
          this.inProgress = false;
        },
        (error: any) => {
          this.notifierService.notify('error', `Failed to list images: ${error.error}`)
          this.inProgress = false;
        })
  }

  imageInspect(id: string): void {
    this.inProgress = true;
    this._imageSvc.inspect(id)
      .subscribe(
        (response: any) => {
          this.imageInfo = response;
          this.inProgress = false;
        },
        (error: any) => {
          this.notifierService.notify('error', `Failed to inspect image: ${error.error}`)
          this.inProgress = false;
        })
    
        this._imageSvc.history(id)
        .subscribe(
          (response: any) => {
            this.imageHistory = response;
            this.inProgress = false;
            this.sidenav_inspect?.open()
          },
          (error: any) => {
            this.notifierService.notify('error', `Failed to get image history: ${error.error}`)
            this.inProgress = false;
          })
  }

  delete(id: string): void {
    this.inProgress = true;
    this._imageSvc.delete(id)
      .subscribe((response: any) => {
        
        this.notifierService.notify('success', 'Image deleted')
        this.inProgress = false;
        this.RemoveElementFromContainers(id);
      },
        (error: any) => {
          this.notifierService.notify('error', `Failed to delete image: ${error.error}`)
          this.inProgress = false;
        })
  }

  RemoveElementFromContainers(imageId: string) {
    this.images.forEach((value: any, index: any) => {
      if (value.id == imageId) this.images.splice(index, 1);
    });
  }

  localDateTime(dateNumber: string): string {
    return new Date(dateNumber).toLocaleString()
  }

  onrefreshSecondsChange(event: any): void {
    this.refreshInterval = event.value;
  }

  OpenPullDialog() {
    this.dialog.open(PullDialogComponent, {disableClose: true});
  }

}
