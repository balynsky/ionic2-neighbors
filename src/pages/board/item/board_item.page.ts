import {NavParams, NavController, ModalController} from "ionic-angular";
import {Component} from "@angular/core";
import {ChatService} from "../../../services/chat.service";
import {IRoom} from "../../../model/room";
import {Observable} from "rxjs/Observable";
import {IMessage} from "../../../model/message";
import {UserService} from "../../../services/user.service";
import {IUser} from "../../../model/user";
import {LogService} from "../../../services/log.service";
import {NeighborItemPage} from "../../neighbors/neighbor_item/neighbor_item.page";
import {Keyboard} from "@ionic-native/keyboard";
import {ModalContentPage} from "../../../component/message.modal";

@Component({
  selector: 'board-item-page',
  templateUrl: 'board_item.page.html',
})
export class BoardItemPage {
  chat: IRoom;
  messages: Observable<IMessage[]>;
  user: IUser;
  message: string;

  constructor(private data: ChatService, params: NavParams, public modalCtrl: ModalController, private nav: NavController, private us: UserService,
              private keyboard: Keyboard) {
    this.chat = params.get("chatId");
    this.user = UserService.getCurrentUser();
    this.messages = data.getMessages("board_messages", this.chat.$key);
  }

  sendMessage(message: string) {
    LogService.logMessage("BoardItemPage sendMessage " + this.chat.$key + " ", message);
    this.data.saveMessage("board_messages", this.chat.$key, message, null, () => {
      LogService.logMessage("BoardItemPage sendMessage success saved");
      this.message = '';
    }, false);
    this.keyboard.close();

  }

  openUser(message: IMessage) {
    LogService.logMessage("openUser ", message.user.$key);
    this.nav.push(NeighborItemPage, {"item": message.user});
  }

  presentModal() {
    let modal = this.modalCtrl.create(ModalContentPage);
    modal.onDidDismiss(data => {
      if (data !== null) {
        this.sendMessage(data);
      }
    });
    modal.present();
  }

}
