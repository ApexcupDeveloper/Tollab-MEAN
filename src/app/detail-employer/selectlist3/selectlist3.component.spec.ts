import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Selectlist3Component } from './selectlist3.component';

describe('Selectlist3Component', () => {
  let component: Selectlist3Component;
  let fixture: ComponentFixture<Selectlist3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Selectlist3Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Selectlist3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
