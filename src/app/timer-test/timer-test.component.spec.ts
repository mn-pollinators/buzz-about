import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerTestComponent } from './timer-test.component';
import { TimerProgressBarComponent } from '../timer-progress-bar/timer-progress-bar.component';
import { TimerProgressSpinnerComponent } from '../timer-progress-spinner/timer-progress-spinner.component';
import { TimerControlComponent } from '../timer-control/timer-control.component';
import { FormsModule } from '@angular/forms';
import { MdcLinearProgressModule, MdcIconButtonModule, MdcSliderModule, MdcIconModule, MdcTopAppBarModule } from '@angular-mdc/web';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TopMenuBarComponent } from '../top-menu-bar/top-menu-bar.component';
import { FullscreenButtonComponent } from '../fullscreen-button/fullscreen-button.component';

describe('TimerTestComponent', () => {
  let component: TimerTestComponent;
  let fixture: ComponentFixture<TimerTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdcIconButtonModule,
        MdcIconModule,
        MdcLinearProgressModule,
        MdcSliderModule,
        MdcTopAppBarModule,
        MatProgressSpinnerModule,
        FormsModule,
      ],
      declarations: [
        TimerTestComponent,
        TimerProgressBarComponent,
        TimerProgressSpinnerComponent,
        TimerControlComponent,
        TopMenuBarComponent,
        FullscreenButtonComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
