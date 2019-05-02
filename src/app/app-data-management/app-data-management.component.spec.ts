import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDataManagementComponent } from './app-data-management.component';

describe('AppDataManagementComponent', () => {
  let component: AppDataManagementComponent;
  let fixture: ComponentFixture<AppDataManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDataManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDataManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
