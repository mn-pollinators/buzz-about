import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { RoundChooserDialogComponent } from './round-chooser-dialog.component';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FlowerSpecies, allFlowerSpecies } from 'src/app/flowers';

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
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundChooserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  describe('The onCancel() method', () => {
    it('Closes the dialog', () => {
      const closeSpy = spyOn(TestBed.inject(MatDialogRef), 'close');

      component.onCancel();
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('The getFlowers() method', () => {
    it('Should return an empty array if given an empty array', () => {
      expect(component.getFlowers([])).toEqual([]);
    });

    it('Should turn FlowerSpecies objects into FlowerLayoutItem objects', () => {
      const fakeFlowerSpecies: FlowerSpecies[] = [
        allFlowerSpecies.zizia_aurea,
        allFlowerSpecies.helianthus_maximiliani,
        allFlowerSpecies.asclepias_syriaca
      ];
      const expectedFlowerLayoutItems = [
        {
          imgSrc: `assets/art/500w/flowers/${fakeFlowerSpecies[0].art_file}`,
          alt: fakeFlowerSpecies[0].name,
          active: true,
          scale: fakeFlowerSpecies[0].relative_size
        },
        {
          imgSrc: `assets/art/500w/flowers/${fakeFlowerSpecies[1].art_file}`,
          alt: fakeFlowerSpecies[1].name,
          active: true,
          scale: fakeFlowerSpecies[1].relative_size
        },
        {
            imgSrc: `assets/art/500w/flowers/${fakeFlowerSpecies[2].art_file}`,
            alt: fakeFlowerSpecies[2].name,
            active: true,
            scale: fakeFlowerSpecies[2].relative_size
        }
      ];
      expect(component.getFlowers(fakeFlowerSpecies)).toEqual(expectedFlowerLayoutItems);
    });
  });
});
