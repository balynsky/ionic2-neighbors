import {Component, ViewChild} from "@angular/core";
import {NavParams, Nav, NavController} from "ionic-angular";
import {EventsPage} from "../events/events.page";
import {ChatPage} from "../chat/chat.page";
import {NeighborsPage} from "../neighbors/neighbors.page";
import {StartPage} from "../start/start.page";

@Component({
  templateUrl: 'apptabs.html',
  selector:'apptabs-page'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab0Root: any = StartPage;
  tab1Root: any = EventsPage;
  tab2Root: any = ChatPage;
  tab3Root: any = NeighborsPage;

  tabIndex: number;

  constructor(params: NavParams, public nav: NavController) {
    this.tabIndex = params.data.tabIndex || 0;
  }

  returnToDash(){
    this.nav.setRoot(StartPage)
  }

}
