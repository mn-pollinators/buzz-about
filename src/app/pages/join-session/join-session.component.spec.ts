import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinSessionComponent } from './join-session.component';
import { AuthService } from '../../services/auth.service';

xdescribe('JoinSessionComponent', () => {
  let component: JoinSessionComponent;
  let fixture: ComponentFixture<JoinSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
