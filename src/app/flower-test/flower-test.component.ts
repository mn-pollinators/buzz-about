import { Component, OnInit } from '@angular/core';
import { FlowerLayoutItem } from '../flower-layout-item/flower-layout-item.component';

@Component({
  selector: 'app-flower-test',
  templateUrl: './flower-test.component.html',
  styleUrls: ['./flower-test.component.scss']
})
export class FlowerTestComponent implements OnInit {


  images = [
    {
      name: 'rudbekia hirta',
      imgSrc: 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png'
    },
    {
      name: 'taraxacum officinale',
      imgSrc: 'assets/images/1000w-8bit/flowers/taraxacum officinale.png'
    },
    {
      name: 'solidago rigida',
      imgSrc: 'assets/images/1000w-8bit/flowers/solidago rigida.png'
    },
    {
      name: 'sunflower',
      imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png'
    },
    {
      name: 'black raspberry',
      imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png'
    },
    {
      name: 'vaccinium angustifolium',
      imgSrc: 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png'
    },
    {
      name: 'trifolium repens',
      imgSrc: 'assets/images/1000w-8bit/flowers/trifolium repens.png'
    }
  ]


  flowers: FlowerLayoutItem[] = [
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
      alt: 'test',
      active: true,
      scale: 1.9
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
      alt: 'test',
      active: true,
      scale: 1.1
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/solidago rigida.png',
      alt: 'test',
      active: true,
      scale: 1.3
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png',
      alt: 'test',
      active: true,
      scale: 1.5
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png',
      alt: 'test',
      active: true,
      scale: 1
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/trifolium repens.png',
      alt: 'test',
      active: true,
      scale: 1.1
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
      alt: 'test',
      active: true,
      scale: 1.5
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/rudbeckia hirta.png',
      alt: 'test',
      active: true,
      scale: 2.1
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/taraxacum officinale.png',
      alt: 'test',
      active: true,
      scale: 1.1
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/solidago rigida.png',
      alt: 'test',
      active: true,
      scale: 1.3
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png',
      alt: 'test',
      active: true,
      scale: 1.5
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png',
      alt: 'test',
      active: true,
      scale: 0.9
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/trifolium repens.png',
      alt: 'test',
      active: true,
      scale: 1.1
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/vaccinium angustifolium.png',
      alt: 'test',
      active: true,
      scale: 1.5
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/sunflower.png',
      alt: 'test',
      active: true,
      scale: 1.5
    },
    {
      imgSrc: 'assets/images/1000w-8bit/flowers/black raspberry.png',
      alt: 'test',
      active: true,
      scale: 0.9
    }
  ]

  constructor() { }

  ngOnInit() {
  }


}
