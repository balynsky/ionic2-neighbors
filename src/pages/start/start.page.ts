import {Component} from "@angular/core";
import {CallNumber} from "@ionic-native/call-number";
import {BasePage} from "../base.page";
import {ToastController} from "ionic-angular";

@Component({
    templateUrl: 'start.page.html',
})
export class StartPage extends BasePage {

    constructor(protected toastCtrl: ToastController, private call: CallNumber ) {
        super(toastCtrl);

    }

    public test(): void {
        this.call.callNumber('380630000000', true)
            .then(() => this.presentToast('Launched dialer!'))

    }

}
