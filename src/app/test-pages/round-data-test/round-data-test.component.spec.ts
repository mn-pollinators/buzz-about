import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundDataTestComponent } from './round-data-test.component';

xdescribe('RoundDataTestComponent', () => {
  let component: RoundDataTestComponent;
  let fixture: ComponentFixture<RoundDataTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundDataTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundDataTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
