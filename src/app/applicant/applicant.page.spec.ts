import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantPage } from './applicant.page';

describe('ApplicantPage', () => {
  let component: ApplicantPage;
  let fixture: ComponentFixture<ApplicantPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
