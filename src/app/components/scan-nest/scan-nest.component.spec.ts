import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanNestComponent } from './scan-nest.component';

xdescribe('ScanNestComponent', () => {
  let component: ScanNestComponent;
  let fixture: ComponentFixture<ScanNestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanNestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanNestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
