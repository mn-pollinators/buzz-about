import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerTestComponent } from './flower-test.component';
import { FlowerLayoutComponent } from '../../components/flower-layout/flower-layout.component';
import { FlowerLayoutItemComponent } from '../../components/flower-layout-item/flower-layout-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FullscreenButtonComponent } from '../../components/fullscreen-button/fullscreen-button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SentenceCasePipe } from 'src/app/utils/string-utils';

describe('FlowerTestComponent', () => {
  let component: FlowerTestComponent;
  let fixture: ComponentFixture<FlowerTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule,
        FormsModule,
      ],
      declarations: [
        FlowerTestComponent,
        FlowerLayoutComponent,
        FlowerLayoutItemComponent,
        FullscreenButtonComponent,
        SentenceCasePipe
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
