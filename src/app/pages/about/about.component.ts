import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SwUpdate } from '@angular/service-worker';
import { buzzAbout as buzzAboutInfo, assets as assetsInfo } from '../../../../project-info.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  buzzAboutInfo = buzzAboutInfo;
  assetsInfo = assetsInfo;

  buzzAboutContributors = buzzAboutInfo.contributors.filter(c => c.type !== 'Bot');
  assetsContributors = assetsInfo.contributors.filter(c => c.type !== 'Bot');

  allContributors = this.buzzAboutContributors.concat(
    // Only add assets contributors who aren't already in the list of Buzz
    // About contributors.
    this.assetsContributors.filter(x => !this.buzzAboutContributors.some(y => x.username === y.username))
  );

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, public updates: SwUpdate) {
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl('assets/github.svg')
    );
  }

  ngOnInit(): void {
  }

  applyUpdateAndRefresh() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }

}
