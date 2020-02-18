import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupEmployerPage } from './signup-employer.page';

describe('SignupEmployerPage', () => {
  let component: SignupEmployerPage;
  let fixture: ComponentFixture<SignupEmployerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupEmployerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupEmployerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
