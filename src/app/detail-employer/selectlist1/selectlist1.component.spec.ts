import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Selectlist1Component } from './selectlist1.component';

describe('Selectlist1Component', () => {
  let component: Selectlist1Component;
  let fixture: ComponentFixture<Selectlist1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Selectlist1Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Selectlist1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
