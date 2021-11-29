import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-text',
  templateUrl: './search-text.component.html',
  styleUrls: ['./search-text.component.css']
})
export class SearchTextComponent implements OnInit {

  @Output() searched = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  public onSearch(searchTerm: string): void {
    this.searched.emit(searchTerm);
  }

}
