import { Component, OnInit } from '@angular/core';
import { FlowerSpecies } from '../../flowers';
import { FlowerLayoutItem } from '../../components/flower-layout-item/flower-layout-item.component';
import { defaultRoundSets } from 'src/app/round-templates/round-templates';

@Component({
  selector: 'app-round-template-test',
  templateUrl: './round-template-test.component.html',
  styleUrls: ['./round-template-test.component.scss']
})
export class RoundTemplateTestComponent implements OnInit {

  constructor() { }

  roundSets = defaultRoundSets;

  ngOnInit(): void {
  }

  getFlowers(flowers: FlowerSpecies[]): FlowerLayoutItem[] {
    return flowers.map((species) => {
      return {
        imgSrc: `assets/art/500w/flowers/${species.art_file}`,
        alt: species.name,
        active: true,
        scale: species.relative_size
      };
    });
  }

}
