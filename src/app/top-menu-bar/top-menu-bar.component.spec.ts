import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TopMenuBarComponent } from './top-menu-bar.component';
import { MdcTopAppBarModule, MdcIconModule } from '@angular-mdc/web';
import { FullscreenButtonComponent } from '../fullscreen-button/fullscreen-button.component';

describe('TopMenuBarComponent', () => {
  let component: TopMenuBarComponent;
  let fixture: ComponentFixture<TopMenuBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdcIconModule,
        MdcTopAppBarModule,
      ],
      declarations: [
        TopMenuBarComponent,
        FullscreenButtonComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
