import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerControlComponent } from './timer-control.component';
import { MdcIconButtonModule, MdcLinearProgressModule, MdcSliderModule } from '@angular-mdc/web';
import { TimerService } from '../timer.service';

describe('TimerControlComponent', () => {
  let component: TimerControlComponent;
  let fixture: ComponentFixture<TimerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdcIconButtonModule,
        MdcLinearProgressModule,
        MdcSliderModule,
      ],
      declarations: [
        TimerControlComponent,
      ],
      providers: [
        TimerService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
