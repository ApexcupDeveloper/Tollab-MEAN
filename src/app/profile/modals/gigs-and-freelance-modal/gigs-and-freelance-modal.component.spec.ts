import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GigsAndFreelanceModalComponent } from './gigs-and-freelance-modal.component';

describe('GigsAndFreelanceModalComponent', () => {
  let component: GigsAndFreelanceModalComponent;
  let fixture: ComponentFixture<GigsAndFreelanceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GigsAndFreelanceModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GigsAndFreelanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
