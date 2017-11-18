import {Component} from "@angular/core";
import {CallNumber} from "@ionic-native/call-number";
import {BasePage} from "../base.page";
import {NavController, ToastController} from "ionic-angular";
import {PagesModule} from "../../app/pages.module";

@Component({
  selector: 'start-page',
  templateUrl: 'start.page.html',
})
export class StartPage extends BasePage {

  constructor(protected toastCtrl: ToastController, private call: CallNumber, private nav: NavController) {
    super(toastCtrl);

  }

  openDoor(): void {
    this.call.callNumber('380630000000', true)
      .then(() => this.presentToast('Launched dialer!'))

  }

  openPage (index:number, is_push=false){
    PagesModule.openPage(index, this.nav, is_push);
  }

}
