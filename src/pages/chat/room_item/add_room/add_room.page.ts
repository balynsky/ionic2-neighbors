import {Component} from "@angular/core";
import {ViewController, ToastController} from "ionic-angular";
import {FormControl, FormGroup, Validators, AbstractControl} from "@angular/forms";
import {BasePage} from "../../../base.page";
import {ChatService} from "../../../../services/chat.service";
import {LogService} from "../../../../services/log.service";


@Component({
  templateUrl: 'add_room.page.html'
})
export class AddRoomPage extends BasePage {
  name: AbstractControl;
  form = new FormGroup({
    name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]))
  });

  constructor(public data: ChatService, public viewCtrl: ViewController, toastCtrl: ToastController) {
    super(toastCtrl);
    this.name = this.form.controls['name'];
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  addRoom($event: any) {
    LogService.logMessage("addRoom " + this.name.value);
    this.data.addPublicRoom(this.name.value, (error: any) => {
      if (error) {
        this.presentToast("Error: " + error);
      } else {
        this.dismiss();
      }
    });
  }

}
