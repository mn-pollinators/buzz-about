import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { RoundChooserDialogComponent } from './round-chooser-dialog.component';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButton, MatButtonModule } from '@angular/material/button';

describe('RoundChooserDialogComponent', () => {
  let component: RoundChooserDialogComponent;
  let fixture: ComponentFixture<RoundChooserDialogComponent>;

  beforeEach(async(() => {
    const mockDialogRef: Partial<MatDialogRef<RoundChooserDialogComponent>> = {
      close() {},
    };

    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatDialogModule,
        MatListModule,
      ],
      declarations: [
        RoundChooserDialogComponent,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundChooserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
