import {Component, ViewChild} from "@angular/core";

import {Events, MenuController, Nav, Platform, ToastController} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";

import {Storage} from "@ionic/storage";

import {LoginPage} from "../pages/login/login.page";
import {IUser} from "../model/user";
import {UserService} from "../services/user.service";
import {LogService} from "../services/log.service";
import {ProfilePage} from "../pages/profile/profile.page";
import {GroupsPage} from "../pages/groups/groups.page";
import {BasePage} from "../pages/base.page";
import {LoadingModal} from "../component/loading.component";
import {StatusBar} from "@ionic-native/status-bar";
import {Keyboard} from "@ionic-native/keyboard";
import {FirebaseService} from "../services/firebase.service";
import {PageInterface, PagesModule} from "./pages.module";

@Component({
  templateUrl: 'app.component.html'
})
export class MyApp extends BasePage {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(LoadingModal) loadingModal: LoadingModal;

  loggedInPages: PageInterface[] = PagesModule.loggedInPages;
  loggedOutPages: PageInterface[] = PagesModule.loggedOutPages;

  rootPage: any;
  currentUser: IUser;

  constructor(public events: Events,
              public menu: MenuController,
              public platform: Platform,
              public db: FirebaseService,
              public userService: UserService,
              public storage: Storage,
              public splashScreen: SplashScreen,
              private keyboard: Keyboard,
              private statusBar: StatusBar,
              protected toastCtrl: ToastController) {
    super(toastCtrl);
    this.platformReady();
    this.listenToLoginEvents();
  }

  openPage(page: PageInterface) {
    LogService.logMessage("Page ", page);
    let params = {};
    if (page.logsOut) {
      console.log("logout press in menu");
      this.db.logout();
      return;
    }
    if (page.index) {
      params = {tabIndex: page.index};
    }
    this.nav.setRoot(page.component, params).catch((err: any) => {
      console.log(`Didn't set nav root: ${err}`);
    });

  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:login', () => {
      this.showCustomLoading("Загрузка данных о пользователе");
      this.userService.loadUserData();
    });

    this.events.subscribe('user:loaded', () => {
      LogService.logMessage(" listenToLoginEvents user:loaded");
      this.currentUser = UserService.getCurrentUser();
      if (this.currentUser.memberOf == null || typeof this.currentUser.memberOf === 'undefined') {
        LogService.logMessage("this.currentUser.memberOf is undefined");
        this.rootPage = GroupsPage;
      } else {
        //if user in group - show interface
        this.enableMenu(true);
        //this.rootPage = StartPage;
        PagesModule.openPage(0, this.nav);
        this.hideCustomLoading();
      }
    });

    this.events.subscribe('user:new', () => {
      LogService.logMessage(" listenToLoginEvents user:new");
      this.enableMenu(true);
      this.rootPage = ProfilePage;
    });


    this.events.subscribe('user:logout', () => {
      LogService.logMessage(" listenToLoginEvents user:logout");
      this.enableMenu(false);
      //this.rootPage = LoginPage;
      PagesModule.openPage(7, this.nav);
      UserService.user = null;
    });

    this.events.subscribe('loader:start', (content: string) => {
      this.showCustomLoading(content);
    });

    this.events.subscribe('loader:stop', () => {
      this.hideCustomLoading();
    });

    this.events.subscribe('toast:show', (text: string) => {
      this.presentToast(text);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();

      this.keyboard.disableScroll(true);
      this.keyboard.hideKeyboardAccessoryBar(true);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.hide();
      this.statusBar.overlaysWebView(false);
      if (this.db.isLogged()) {
        PagesModule.openPage(0, this.nav);
        this.enableMenu(true);
      } else {
        PagesModule.openPage(7, this.nav);
        this.enableMenu(false);
      }
    });
  }

  showCustomLoading(content: any) {
    this.loadingModal.show(content);
  }

  hideCustomLoading() {
    this.loadingModal.hide();
  }
}
