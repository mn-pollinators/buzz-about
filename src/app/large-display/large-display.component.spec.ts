import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeDisplayComponent } from './large-display.component';
import { MdcIconButtonModule, MdcLinearProgressModule, MdcSliderModule } from '@angular-mdc/web';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { TimerTestComponent } from '../timer-test/timer-test.component';
import { TimerProgressBarComponent } from '../timer-progress-bar/timer-progress-bar.component';
import { TimerProgressSpinnerComponent } from '../timer-progress-spinner/timer-progress-spinner.component';
import { TimerControlComponent } from '../timer-control/timer-control.component';
import { FlowerLayoutComponent } from '../flower-layout/flower-layout.component';
import { FlowerLayoutItemComponent } from '../flower-layout-item/flower-layout-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimerService } from '../timer.service';

describe('LargeDisplayComponent', () => {
  let component: LargeDisplayComponent;
  let fixture: ComponentFixture<LargeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdcIconButtonModule,
        MdcLinearProgressModule,
        MdcSliderModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
        FormsModule,
      ],
      declarations: [
        LargeDisplayComponent,
        TimerTestComponent,
        TimerProgressBarComponent,
        TimerProgressSpinnerComponent,
        TimerControlComponent,
        FlowerLayoutComponent,
        FlowerLayoutItemComponent,
      ],
      providers: [
        TimerService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
