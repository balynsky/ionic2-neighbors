import {Component, ViewChild} from "@angular/core";

import {Events, MenuController, Nav, Platform, ToastController} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";

import {Storage} from "@ionic/storage";

import {LoginPage} from "../pages/login/login.page";
import {UtilitiesPage} from "../pages/utilities/utilities.page";
import {BoardPage} from "../pages/board/board.page";
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
import {TabsPage} from "../pages/apptabs/apptabs";

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.component.html'
})
export class MyApp extends BasePage {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(LoadingModal) loadingModal: LoadingModal;

  loggedInPages: PageInterface[] = [
    {title: 'Соседи', name: "TabsPage", component: TabsPage, icon: 'md-people', index: 3},
    {title: 'Коммунальные услуги', name: "UtilitiesPage", component: UtilitiesPage, icon: 'calculator'},
    {title: 'Доска объявлений', name: "BoardPage", component: BoardPage, icon: 'calendar', index: 1},
    {title: 'Выход', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true}

  ];
  loggedOutPages: PageInterface[] = [
    {title: 'Login', name: "LoginPage", component: LoginPage, icon: 'log-in'}
  ];
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
              protected toastCtrl: ToastController,) {
    super(toastCtrl);
    this.platformReady();
    this.listenToLoginEvents();
  }

  openPage(page: PageInterface) {
    let params = {};
    if (page.logsOut) {
      console.log("logout press in menu");
      this.db.logout();
    }

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = {tabIndex: page.index};
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.nav.getActiveChildNav().select(page.index);
      // Set the root of the nav with params if it's a tab index
    } else {
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }
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
        this.rootPage = TabsPage;
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
      this.rootPage = LoginPage;
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
      if (this.db.isLogged()) {
        this.rootPage = TabsPage;
        this.enableMenu(true);
      } else {
        this.rootPage = LoginPage;
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

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }
}
