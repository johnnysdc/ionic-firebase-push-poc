import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  subs: any;
  pushMessage: 'Push message will be displayed here';

  constructor(
    public route: ActivatedRoute
  ) {
    this.subs = this.route.data
      .subscribe(v => {
        console.log(v);
        this.pushMessage = v.message;
      });
    // if (params.data.message) {
    //   this.pushMessage = params.data.message;
    // }
  }

}
