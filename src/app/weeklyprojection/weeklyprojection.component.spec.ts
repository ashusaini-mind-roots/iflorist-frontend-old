import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyProjectionComponent } from './weeklyprojection.component';
import {TableModule} from 'primeng/table';

describe('WeeklyProjectionComponent', () => {
  let component: WeeklyProjectionComponent;
  let fixture: ComponentFixture<WeeklyProjectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyProjectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyProjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
