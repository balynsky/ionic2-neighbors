import {Page, Platform, NavController} from 'ionic-angular';
import {RoomItemPage} from  '../chat/room_item/room_item.page';
import {PrivateItemPage} from  '../chat/private_item/private_item.page';
import {ChatService} from "../../services/chat.service";
import {IRoom} from "../../model/room";
import {Observable} from "rxjs/Observable";
import {UserService} from "../../services/user.service";
import {LogService} from "../../services/log.service";
import {IUser} from "../../model/user";

@Page({
    templateUrl: 'build/pages/chat/chat.page.html',
})
export class ChatPage {
    user:IUser;
    type:string = "rooms";
    isAndroid:boolean = false;
    nav:NavController;
    rooms:Observable<IRoom[]>;
    privateRooms:Observable<IRoom[]>;

    constructor(platform:Platform, nav:NavController, cs:ChatService) {
        this.isAndroid = platform.is('android');
        this.nav = nav;
        this.user = UserService.getCurrentUser();
        this.rooms = cs.getRooms("public_rooms/", "public_messages/");
        this.privateRooms = cs.getRooms("private_rooms/", "private_messages/");
    }

    openChatRoom(id) {
        this.nav.push(RoomItemPage, {chatId: id});
    }

    openPrivateRoom(id) {
        this.nav.push(PrivateItemPage, {chatId: id});
    }

    createPrivateTopic() {
        LogService.logMessage("createPrivateTopic");
    }

    createPublicTopic() {
        LogService.logMessage("createPublicTopic");
    }

}
