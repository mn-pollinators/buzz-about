import { Component, OnInit } from '@angular/core';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';
import { FlowerSpecies, allFlowerSpecies } from '../flowers';

@Component({
  selector: 'app-flower-test',
  templateUrl: './flower-test.component.html',
  styleUrls: ['./flower-test.component.scss']
})
export class FlowerTestComponent implements OnInit {



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

  constructor() { }

  ngOnInit() {
  }

  getFlowers(inputs: {species: string, blooming: boolean}[]): FlowerLayoutItem[] {
    return inputs.map(({species, blooming}) => {
      const speciesObj = allFlowerSpecies[species];
      return {
        imgSrc: `assets/art/500w/flowers/${speciesObj.art_file}`,
        alt: speciesObj.name,
        active: blooming,
        scale: speciesObj.relative_size
    }
    });
  }


}
