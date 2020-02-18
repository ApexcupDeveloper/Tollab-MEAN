import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Selectlist2Component } from './selectlist2.component';

describe('Selectlist2Component', () => {
  let component: Selectlist2Component;
  let fixture: ComponentFixture<Selectlist2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Selectlist2Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Selectlist2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
