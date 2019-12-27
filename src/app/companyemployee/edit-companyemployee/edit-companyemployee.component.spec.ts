import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyemployeeComponent } from './edit-companyemployee.component';

describe('EditCompanyemployeeComponent', () => {
  let component: EditCompanyemployeeComponent;
  let fixture: ComponentFixture<EditCompanyemployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCompanyemployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
