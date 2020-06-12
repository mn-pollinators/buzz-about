import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MdcTopAppBarModule, MdcIconModule } from '@angular-mdc/web';
import { FullscreenButtonComponent } from './fullscreen-button/fullscreen-button.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FullscreenButtonComponent,
      ],
      imports: [
        RouterTestingModule,
        MdcTopAppBarModule,
        MdcIconModule,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
