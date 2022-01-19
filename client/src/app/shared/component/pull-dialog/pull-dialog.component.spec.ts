import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullDialogComponent } from './pull-dialog.component';

describe('PullDialogComponent', () => {
  let component: PullDialogComponent;
  let fixture: ComponentFixture<PullDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PullDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
