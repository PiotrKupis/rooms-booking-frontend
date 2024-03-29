import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Prime Room';

  constructor(public translate: TranslateService) {
    translate.addLangs(['pl']);
    translate.setDefaultLang('pl');
    translate.use('pl');
  }

}
