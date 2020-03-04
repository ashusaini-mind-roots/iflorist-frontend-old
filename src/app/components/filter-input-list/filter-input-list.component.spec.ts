import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterInputListComponent } from './filter-input-list.component';

describe('FilterInputListComponent', () => {
  let component: FilterInputListComponent;
  let fixture: ComponentFixture<FilterInputListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterInputListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterInputListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
