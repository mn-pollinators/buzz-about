import { Component, OnInit } from '@angular/core';
import { allBeeSpecies, allBeeSpeciesArray } from 'src/app/bees';
import { BeeLayoutItem } from 'src/app/components/flower-layout-with-bees/flower-layout-with-bees.component';
import { FlowerLayoutItem } from 'src/app/components/flower-layout/flower-layout.component';
import { FlowerSpecies, allFlowerSpecies } from '../../flowers';

@Component({
  selector: 'app-flower-test',
  templateUrl: './flower-test.component.html',
  styleUrls: ['./flower-test.component.scss']
})
export class FlowerTestComponent implements OnInit {
  numFlowers = '16';

  parseInt = parseInt;

  bees: {species: string, currentFlower: number}[] = allBeeSpeciesArray.map((v, i) => ({
    species: v.id,
    currentFlower: (i % 8) + 1
  }));

  flowers: {species: string, blooming: boolean}[] = [
    {
      species: allFlowerSpecies.asclepias_syriaca.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.cirsium_discolor.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.echinacea_angustifolia.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.helianthus_maximiliani.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.monarda_fistulosa.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.prunus_americana.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.rubus_occidentalis.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.rudbeckia_hirta.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.solidago_rigida.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.taraxacum_officinale.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.trifolium_repens.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.vaccinium_angustifolium.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.asclepias_syriaca.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.cirsium_discolor.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.echinacea_angustifolia.id,
      blooming: true
    },
    {
      species: allFlowerSpecies.helianthus_maximiliani.id,
      blooming: true
    },
  ];

  allFlowerSpeciesArray = Object.values(allFlowerSpecies);
  allBeeSpeciesArray = Object.values(allBeeSpecies);

  interval: number;
  showBees = true;

  constructor() { }

  ngOnInit() {
  }

  getFlowers(inputs: {species: string, blooming: boolean}[]): FlowerLayoutItem[] {
    return inputs.slice(0, parseInt(this.numFlowers, 10)).map(({species, blooming}) => {
      const speciesObj = allFlowerSpecies[species];
      return {
        imgSrc: speciesObj.asset_urls.art_500_wide,
        alt: speciesObj.name,
        active: blooming,
        scale: speciesObj.relative_size
      };
    });
  }

  getBees(inputs: {species: string, currentFlower: number}[]): BeeLayoutItem[] {
    return inputs.map(({species, currentFlower}, index) => {
      const speciesObj = allBeeSpecies[species];
      return {
        id: index.toString(),
        imgSrc: speciesObj.asset_urls.art_500_wide,
        alt: speciesObj.name,
        currentFlower,
        scale: speciesObj.relative_size
      };
    });
  }

  clearMoveBees() {
    if (this.interval) {
      window.clearTimeout(this.interval);
      this.interval = null;
    }
  }

  moveBeesAutomatically() {
    this.clearMoveBees();
    this.interval = window.setInterval(() => {
      console.log(this.numFlowers);
      for (const bee of this.bees) {
        if (Math.random() < 0.1) {
          bee.currentFlower = Math.floor(Math.random() * (parseInt(this.numFlowers, 10) + 1));
        }
      }
    }, 500);
  }


}
