import {NavController, ToastController} from "ionic-angular";
import {Component} from "@angular/core";
import {IUser} from "../../../model/user";
import {UserService} from "../../../services/user.service";
import {LogService} from "../../../services/log.service";
import {GroupsService} from "../../../services/groups.service";
import {BasePage} from "../../base.page";
import {Group} from "../../../model/group";

@Component({
  templateUrl: 'invites.page.html',
  selector: 'invites-page'
})
export class InvitesPage extends BasePage {
  sourceUsers: IUser[];
  users: IUser[];
  searchQuery: string;

  constructor(private nav: NavController, private us: UserService, private gs: GroupsService, toastCtrl: ToastController) {
    super(toastCtrl);
    this.searchQuery = '';
    us.getInvites().subscribe(data => {
      LogService.logMessage("InvitesPage getInvites", data);
      this.sourceUsers = this.users = data;
      this.getItems();
    });

  }

  getItems() {
    let q = this.searchQuery;
    this.users = this.sourceUsers.filter((v) => {
      return (v.displayName.split(' ').join('').toLowerCase().indexOf(q.split(' ').join('').toLowerCase()) > -1);

    })
  }

  acceptInvite(user: any) {
    LogService.logMessage("acceptInvite user: ", user);
    this.us.updateUserGroup(user, UserService.getCurrentUser().memberOf, (error: any) => {
      if (error) {
        this.presentToast(error);
      } else {
        let gr = new Group(null);
        gr.$key = UserService.getCurrentUser().memberOf;
        LogService.logMessage("acceptInvite [removeInvite} ");
        this.gs.removeInvite(gr, user, () => {
          //success
          LogService.logMessage("acceptInvite success");
        });
      }
    })
  }

}
