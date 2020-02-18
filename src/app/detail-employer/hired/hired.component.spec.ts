import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiredComponent } from './hired.component';

describe('HiredComponent', () => {
  let component: HiredComponent;
  let fixture: ComponentFixture<HiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiredComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
