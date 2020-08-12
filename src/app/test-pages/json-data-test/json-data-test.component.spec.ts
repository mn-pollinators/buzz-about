import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonDataTestComponent } from './json-data-test.component';

describe('JsonDataTestComponent', () => {
  let component: JsonDataTestComponent;
  let fixture: ComponentFixture<JsonDataTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonDataTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonDataTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
