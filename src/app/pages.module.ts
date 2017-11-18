import {TabsPage} from "../pages/apptabs/apptabs";
import {StartPage} from "../pages/start/start.page";
import {UtilitiesPage} from "../pages/utilities/utilities.page";
import {BoardPage} from "../pages/board/board.page";
import {LoginPage} from "../pages/login/login.page";
import {NavController} from "ionic-angular";
import {ProfilePage} from "../pages/profile/profile.page";

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


export class PagesModule {
  static all_pages: PageInterface[] = [
    {title: "Главная", name: "StartPage", icon: 'apps', component: StartPage},
    {title: "Соседи", name: "TabsPage", component: TabsPage, icon: 'md-people', index: 3},
    {title: "Коммунальные услуги", name: "UtilitiesPage", component: UtilitiesPage, icon: 'calculator'},
    {title: "Доска объявлений", name: "BoardPage", component: BoardPage, icon: 'calendar'},
    {title: "Выход", name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true},
    {title: "События", name: "TabsPage", component: TabsPage, icon: 'md-people', index: 1},
    {title: "Общение", name: "TabsPage", component: TabsPage, icon: 'md-people', index: 2},
    {title: "Вход", name: "LoginPage", component: LoginPage, icon: 'log-in'},
    {title: "Профайл", name: 'ProfilePage', component: ProfilePage, icon: 'profile', logsOut: true},
  ];

  static getPage(index: number) {
    return PagesModule.all_pages[index];
  }

  static openPage(index: number, nav: NavController, is_push: boolean = false) {
    let params = {};
    let page: PageInterface = PagesModule.all_pages[index];
    if (!page) {
      return;
    }
    if (page.index) {
      params = {tabIndex: page.index};
    }
    if (is_push) {
      nav.push(page.component, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    } else {
      nav.setRoot(page.component, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }
  }

  static loggedInPages: PageInterface[] = [
    PagesModule.all_pages[0],
    PagesModule.all_pages[1],
    PagesModule.all_pages[2],
    PagesModule.all_pages[3],
    PagesModule.all_pages[4]
  ];

  static loggedOutPages: PageInterface[] = [
    PagesModule.all_pages[7]
  ];

}
