import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostProfilePage } from './post-profile.page';

describe('PostProfilePage', () => {
  let component: PostProfilePage;
  let fixture: ComponentFixture<PostProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
