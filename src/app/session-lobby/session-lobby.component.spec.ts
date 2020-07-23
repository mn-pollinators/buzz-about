import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionLobbyComponent } from './session-lobby.component';

xdescribe('SessionLobbyComponent', () => {
  let component: SessionLobbyComponent;
  let fixture: ComponentFixture<SessionLobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionLobbyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
