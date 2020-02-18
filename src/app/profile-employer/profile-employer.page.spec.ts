import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEmployerPage } from './profile-employer.page';

describe('ProfileEmployerPage', () => {
  let component: ProfileEmployerPage;
  let fixture: ComponentFixture<ProfileEmployerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEmployerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEmployerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
