import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent implements OnInit {


  containerInfo: any;
  
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
               @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { 
  }
  
  ngOnInit(): void {
    if(this.data.containerInfo != null){
      debugger
      this.containerInfo = this.data.containerInfo;
      return
    }
    
  }

  show(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
