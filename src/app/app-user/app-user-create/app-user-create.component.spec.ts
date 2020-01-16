import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserCreateComponent } from './app-user-create.component';

describe('AppUserCreateComponent', () => {
  let component: AppUserCreateComponent;
  let fixture: ComponentFixture<AppUserCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUserCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
