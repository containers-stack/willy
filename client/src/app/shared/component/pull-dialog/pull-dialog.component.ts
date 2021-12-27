import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ImageService } from 'src/app/material-component/image/image.service';

@Component({
  selector: 'app-pull-dialog',
  templateUrl: './pull-dialog.component.html',
  styleUrls: ['./pull-dialog.component.css']
})
export class PullDialogComponent {

  constructor(private _imageSvc: ImageService,
    private notifierService: NotifierService,) { }

  public repo: any;

  public tag: any;

  public inProgress =  false;

  pull(){
    this.inProgress = true;
    this._imageSvc.pull(this.repo, this.tag)
      .subscribe((response: any) => {
        this.notifierService.notify('success', `Image ${this.repo}:${this.tag} pull.`)
        this.inProgress = false;
      },
        (error: any) => {
          this.inProgress = false;
          this.notifierService.notify('error', `Failed to pull image ${this.repo}:${this.tag}: ${error.error}`)
        })
  }

}
