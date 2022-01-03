import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunImageComponent } from './run-image.component';

describe('RunImageComponent', () => {
  let component: RunImageComponent;
  let fixture: ComponentFixture<RunImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
