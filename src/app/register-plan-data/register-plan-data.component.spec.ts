import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPlanDataComponent } from './register-plan-data.component';

describe('RegisterPlanDataComponent', () => {
  let component: RegisterPlanDataComponent;
  let fixture: ComponentFixture<RegisterPlanDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPlanDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPlanDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
