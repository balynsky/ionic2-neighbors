import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {ErrorHandler, NgModule} from "@angular/core";

import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";

import {InAppBrowser} from "@ionic-native/in-app-browser";
import {SplashScreen} from "@ionic-native/splash-screen";

import {IonicStorageModule} from "@ionic/storage";

import {MyApp} from "./app.component";

import {StartPage} from "../pages/start/start.page";
import {UtilitiesService} from "../services/utilities.service";
import {PushService} from "../services/push.service";
import {GroupsService} from "../services/groups.service";
import {LogService} from "../services/log.service";
import {EventsService} from "../services/events.service";
import {UserService} from "../services/user.service";
import {FirebaseService} from "../services/firebase.service";
import {ChatService} from "../services/chat.service";
import {NeighborsService} from "../services/neighbors.service";
import {AvatarComponent} from "../component/avatar.component";
import {LoadingModal} from "../component/loading.component";
import {Keyboard} from "@ionic-native/keyboard";
import {StatusBar} from "@ionic-native/status-bar";
import {ProfilePage} from "../pages/profile/profile.page";
import {TabsPage} from "../pages/apptabs/apptabs";
import {ModalContentPage} from "../component/message.modal";
import {AddBoardPage} from "../pages/board/add_room/add_room.page";
import {BoardItemPage} from "../pages/board/item/board_item.page";
import {BoardPage} from "../pages/board/board.page";
import {PrivateItemPage} from "../pages/chat/private_item/private_item.page";
import {RoomItemPage} from "../pages/chat/room_item/room_item.page";
import {AddRoomPage} from "../pages/chat/room_item/add_room/add_room.page";
import {ChatPage} from "../pages/chat/chat.page";
import {AddEventPage} from "../pages/events/add_event/add_event.page";
import {EventsPage} from "../pages/events/events.page";
import {GroupsPage} from "../pages/groups/groups.page";
import {InvitesPage} from "../pages/neighbors/invites/invites.page";
import {NeighborItemPage} from "../pages/neighbors/neighbor_item/neighbor_item.page";
import {NeighborsPage} from "../pages/neighbors/neighbors.page";
import {SignupPage} from "../pages/signup/signup.page";
import {UtilitiesPage} from "../pages/utilities/utilities.page";
import {KeyboardAttachDirective} from "../component/keyboard-attach.directive";
import {LoginPage} from "../pages/login/login.page";
import {CallNumber} from "@ionic-native/call-number";


@NgModule({
  declarations: [
    MyApp,
    ModalContentPage,
    TabsPage,
    AddBoardPage,
    BoardItemPage,
    BoardPage,
    PrivateItemPage,
    AddRoomPage,
    RoomItemPage,
    ChatPage,
    AddEventPage,
    EventsPage,
    GroupsPage,
    LoginPage,
    InvitesPage,
    NeighborItemPage,
    NeighborsPage,
    ProfilePage,
    SignupPage,
    StartPage,
    UtilitiesPage,
    AvatarComponent,
    LoadingModal,
    KeyboardAttachDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: UtilitiesPage, name: 'UtilitiesPage', segment: 'utilities' },
        { component: TabsPage, name: 'TabsPage', segment: 'tabs' },
        { component: NeighborsPage, name: 'NeighborsPage', segment: 'neighbors' },
        { component: BoardPage, name: 'BoardPage', segment: 'boards' }
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ModalContentPage,
    TabsPage,
    AddBoardPage,
    BoardItemPage,
    BoardPage,
    PrivateItemPage,
    AddRoomPage,
    RoomItemPage,
    ChatPage,
    AddEventPage,
    EventsPage,
    GroupsPage,
    LoginPage,
    InvitesPage,
    NeighborItemPage,
    NeighborsPage,
    ProfilePage,
    SignupPage,
    StartPage,
    UtilitiesPage,
    AvatarComponent,
    LoadingModal
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Keyboard,
    StatusBar,
    InAppBrowser,
    SplashScreen,
    CallNumber,
    NeighborsService, ChatService, FirebaseService, UserService, EventsService, LogService, GroupsService, PushService, UtilitiesService
  ]
})
export class AppModule { }
