import {Injectable} from "@angular/core";
import {Events} from "ionic-angular";
import {FirebaseService} from "./firebase.service";
import {Observable} from "rxjs/Observable";
import {IUser, User} from "../model/user";
import {BaseService} from "./base.service";

//https://webcake.co/using-firebase-3-in-angular-2-and-ionic-2/
@Injectable()
export class UserService extends BaseService {
  public static user: IUser = null;

  constructor(public events: Events, public fs: FirebaseService) {
    super(events);
  }

  public loadUserData(): void {
    this.fs.db.ref("users/" + this.fs.auth.currentUser.uid).once('value').then((snapshot: any) => {
        if (snapshot.exists()) {
          UserService.user = UserService.mapUser(snapshot.val());
          UserService.user.$key = snapshot.key;
          for (let key in this.fs.auth.currentUser) {
            if (this.fs.auth.currentUser[key] != null) {
              UserService.user[key] = this.fs.auth.currentUser[key];
            }
          }
          //check admin rights
          this.fs.db.ref("admins/" + UserService.user.memberOf + "/" + this.fs.auth.currentUser.uid).once('value').then((snapshot3: any) => {
            if (snapshot3.exists()) {
              UserService.user.isAdmin = true;
            }
          });
          this.events.publish("user:loaded");
        } else {
          this.events.publish("user:new");
        }
      }
    )
  }

  static getCurrentUser(): IUser {
    return UserService.user;
  }

  getUser(user_id: any): Observable<any> {
    return this.observableFirebaseObject(this.fs.db.ref("users/" + user_id));
  }

  static mapUser(snapshot: any): IUser {
    let user = new User(snapshot.auto, snapshot.memberOf, snapshot.displayName);
    if (typeof snapshot.auto2 !== 'undefined')
      user.auto2 = snapshot.auto2;
    if (typeof snapshot.photoURL !== 'undefined')
      user.photoURL = snapshot.photoURL;
    if (typeof snapshot.flatNumber !== 'undefined')
      user.flatNumber = snapshot.flatNumber;
    if (typeof snapshot.houseNumber !== 'undefined')
      user.houseNumber = snapshot.houseNumber;
    if (typeof snapshot.mobile1 !== 'undefined')
      user.mobile1 = snapshot.mobile1;
    if (typeof snapshot.mobile2 !== 'undefined')
      user.mobile2 = snapshot.mobile2;
    if (typeof snapshot.mail !== 'undefined')
      user.mail = snapshot.mail;
    return user;
  }

  updatePhoto(token: string, url: string) {
    this.fs.db.ref("users/" + token).update({
      'photoURL': url
    });
  }

  updateUser(user: IUser, callback: any) {
    //LogService.logMessage("updateUser " + user.$key);
    this.fs.db.ref("users/" + this.fs.auth.currentUser.uid).update({
        'displayName': user.displayName,
        'auto': user.auto,
        'auto2': user.auto2,
        'flatNumber': user.flatNumber,
        'houseNumber': user.houseNumber,
        'mail': user.mail,
        'mobile1': user.mobile1,
        'photoURL': user.photoURL,
        'mobile2': user.mobile2
      },
      callback);
  }

  getInvites(): Observable<IUser[]> {
    let fs = this.fs;
    return Observable.create(function (observer: any) {
      // Looking for how to type this well.
      let arr: any[] = [];
      const keyFieldName = "$key";
      // Start out empty, until data arrives
      observer.next(arr.slice()); // Safe copy

      function child_added(skey: any, snapshot: any) {
        //LogService.logMessage("Events child_added");
        let child = snapshot;
        child[keyFieldName] = skey;
        arr.push(child);
        observer.next(arr.slice());
      }


      fs.db.ref("invite/" + UserService.getCurrentUser().memberOf).on('value', (snapshot: any) => {
        //LogService.logMessage("value", snapshot.val());
        arr = [];
        if (snapshot.exists()) {
          Object.keys(snapshot.val()).forEach(function (userSnap) {
            let userId = userSnap;
            //LogService.logMessage("getInvites ", userId);
            fs.db.ref("users/" + userId).once("value").then((snapshot2: any) => {
              let user = UserService.mapUser(snapshot2.val());
              //LogService.logMessage("getInvites loadedUser ", user);
              child_added(userId, user);
            });
          });
        } else {
          observer.next(arr.slice());
        }
      });
    });
  }

  updateUserGroup(user: IUser, group: string, callback: any) {
    //LogService.logMessage("updateUserGroup " + user.$key);
    this.fs.db.ref("users/" + user.$key).update({'memberOf': group}, callback);
    this.fs.db.ref("groups/" + group + "/members/" + user.$key).set('true', callback);

  }

}
