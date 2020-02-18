import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEmployerPage } from './detail-employer.page';

describe('DetailEmployerPage', () => {
  let component: DetailEmployerPage;
  let fixture: ComponentFixture<DetailEmployerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailEmployerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEmployerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
