import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPagesComponent } from './test-pages.component';

describe('TestPagesComponent', () => {
  let component: TestPagesComponent;
  let fixture: ComponentFixture<TestPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
