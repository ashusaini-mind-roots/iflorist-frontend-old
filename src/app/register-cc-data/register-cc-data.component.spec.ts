import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCcDataComponent } from './register-cc-data.component';

describe('RegisterCcDataComponent', () => {
  let component: RegisterCcDataComponent;
  let fixture: ComponentFixture<RegisterCcDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterCcDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCcDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
