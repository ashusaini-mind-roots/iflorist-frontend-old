import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterGeneralDataComponent } from './register-general-data.component';

describe('RegisterGeneralDataComponent', () => {
  let component: RegisterGeneralDataComponent;
  let fixture: ComponentFixture<RegisterGeneralDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterGeneralDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterGeneralDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
