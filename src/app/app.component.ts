import { Component } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ar-simulation';

  collapseBar: boolean = false;

  atts = {
    'height': 3
  }

}



