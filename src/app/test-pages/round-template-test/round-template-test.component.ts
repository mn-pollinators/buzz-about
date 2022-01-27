import { Component, OnInit } from '@angular/core';
import { FlowerSpecies } from '../../flowers';
import { defaultRoundSets } from 'src/app/round-templates/round-templates';
import { FlowerLayoutItem } from 'src/app/components/flower-layout/flower-layout.component';

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
        imgSrc: species.asset_urls.art_500_wide,
        alt: species.name,
        active: true,
        scale: species.relative_size
      };
    });
  }

}
