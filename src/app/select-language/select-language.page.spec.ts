import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLanguagePage } from './select-language.page';

describe('SelectLanguagePage', () => {
  let component: SelectLanguagePage;
  let fixture: ComponentFixture<SelectLanguagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLanguagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLanguagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
