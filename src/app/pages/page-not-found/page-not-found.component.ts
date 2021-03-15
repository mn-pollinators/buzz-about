import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent implements OnInit {
  path: string;

  constructor(private route: ActivatedRoute) {
    this.path = '"/' + this.route.snapshot.url.join('/') + '"';
  }

  ngOnInit(): void { }

}
