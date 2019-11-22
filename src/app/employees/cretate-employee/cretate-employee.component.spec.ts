import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CretateEmployeeComponent } from './cretate-employee.component';

describe('CretateEmployeeComponent', () => {
  let component: CretateEmployeeComponent;
  let fixture: ComponentFixture<CretateEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CretateEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CretateEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
