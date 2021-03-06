import {ToastController, NavController, Events} from "ionic-angular";
import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators, AbstractControl} from "@angular/forms";
import {ValidationService} from "../../services/validator.service";
import {BasePage} from "../base.page";
import {UserService} from "../../services/user.service";
import {IUser, User} from "../../model/user";
import {LogService} from "../../services/log.service";
import {FirebaseService} from "../../services/firebase.service";


@Component({
  templateUrl: 'profile.page.html',
  selector: 'profile-page'
})
export class ProfilePage extends BasePage {
  form: FormGroup;

  displayName: AbstractControl;
  auto: AbstractControl;
  auto2: AbstractControl;
  houseNumber: AbstractControl;
  flatNumber: AbstractControl;
  mail: AbstractControl;
  mobile1: AbstractControl;
  mobile2: AbstractControl;
  photoURL: AbstractControl;

  user: IUser;

  constructor(private nav: NavController, private us: UserService, private events: Events, private fs: FirebaseService, toastCtrl: ToastController) {
    super(toastCtrl);
    this.user = UserService.getCurrentUser();
    if (this.user == null) {
      this.user = new User(null, null, null);
      this.user.photoURL = fs.auth.currentUser.photoURL;
      this.user.mail = fs.auth.currentUser.email;
      this.user.displayName = fs.auth.currentUser.displayName;
    }

    LogService.logMessage("ProfilePage constructor ", this.user);
    this.form = new FormGroup({
      mail: new FormControl(this.user.mail, Validators.compose([ValidationService.emailValidator])),
      displayName: new FormControl(this.user.displayName, Validators.compose([Validators.required, Validators.minLength(8)])),
      auto: new FormControl(this.user.auto),
      auto2: new FormControl(this.user.auto2),
      houseNumber: new FormControl(this.user.houseNumber),
      flatNumber: new FormControl(this.user.flatNumber, Validators.compose([Validators.required, ValidationService.digitalValidator])),
      mobile1: new FormControl(this.user.mobile1, Validators.compose([Validators.required, Validators.minLength(8)])),
      mobile2: new FormControl(this.user.mobile2),
      photoURL: new FormControl(this.user.photoURL)
    });

    this.displayName = this.form.controls['displayName'];
    this.auto = this.form.controls['auto'];
    this.auto2 = this.form.controls['auto2'];
    this.houseNumber = this.form.controls['houseNumber'];
    this.flatNumber = this.form.controls['flatNumber'];
    this.mail = this.form.controls['mail'];
    this.mobile1 = this.form.controls['mobile1'];
    this.mobile2 = this.form.controls['mobile2'];
    this.photoURL = this.form.controls['photoURL'];

  }

  updateProfile() {
    this.user.displayName = this.displayName.value;
    this.user.auto = this.auto.value;
    this.user.auto2 = this.auto2.value;
    this.user.houseNumber = this.houseNumber.value;
    this.user.flatNumber = this.flatNumber.value;
    this.user.mail = this.mail.value;
    this.user.mobile1 = this.mobile1.value;
    this.user.mobile2 = this.mobile2.value;
    this.user.photoURL = this.photoURL.value;

    this.us.updateUser(this.user, (error: any) => {
      if (error) {
        this.presentToast(error);
      } else {
        this.events.publish("user:login");
      }
    });
  }

  changePhoto() {
    this.presentToast("changePhoto ");
  }

}
