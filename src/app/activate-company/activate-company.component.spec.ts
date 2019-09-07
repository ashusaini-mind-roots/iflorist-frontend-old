import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateCompanyComponent } from './activate-company.component';

describe('ActivateCompanyComponent', () => {
  let component: ActivateCompanyComponent;
  let fixture: ComponentFixture<ActivateCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
