import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainersPieComponent } from './containers-pie.component';

describe('ContainersPieComponent', () => {
  let component: ContainersPieComponent;
  let fixture: ComponentFixture<ContainersPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainersPieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainersPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
