import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddPage } from './company-add.page';

describe('CompanyAddPage', () => {
  let component: CompanyAddPage;
  let fixture: ComponentFixture<CompanyAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
