import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { buzzAbout as buzzAboutInfo, assets as assetsInfo } from '../../project-info.json';
import { environment } from '../environments/environment';
import { GITHUB_ICON } from './app-icon-svgs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    // Setup the GitHub icon so its available for use anywhere in the app.
    iconRegistry.addSvgIconLiteral('github', sanitizer.bypassSecurityTrustHtml(GITHUB_ICON));
  }

  ngOnInit() {
    console.log(`Buzz About v${buzzAboutInfo.version} (Assets v${assetsInfo.version}) loaded.`);
    console.log(`Commit hash: ${buzzAboutInfo.git.hash}`);
    console.log(`This is a ${environment.production ? 'production' : 'development'} build.`);
  }

}
