import {Injectable} from "@angular/core";
import {Events} from "ionic-angular";
import {FirebaseService} from "./firebase.service";
import {LogService} from "./log.service";
import {UserService} from "./user.service";
import {Observable} from "rxjs/Observable";
import {Event} from "../model/event";
import {BaseService} from "./base.service";

@Injectable()
export class EventsService extends BaseService {

  constructor(public fs: FirebaseService, public us: UserService, events: Events) {
    super(events);
  }

  getEvents(): Observable<any> {
    //this.showLoading("Загрузка объявлений");
    //let flag = true;
    let fs = this.fs;
    return Observable.create((observer: any) => {
      // Looking for how to type this well.
      let arr: any[] = [];
      const keyFieldName = "$key";
      // Start out empty, until data arrives
      observer.next(arr.slice()); // Safe copy

      function findInArray<T>(list: T[], predicate: Function) {
        for (var i = 0; i < list.length; i++) {
          const value: T = list[i];
          if (predicate.call(this, value, i, list)) {
            return value;
          }
        }
      }

      function child_added(skey: any, snapshot: any, prevChildKey: string) {
        LogService.logMessage("Events child_added");
        let child = snapshot;
        child[keyFieldName] = skey;
        let prevEntry = findInArray(arr, (y: any) => y[keyFieldName] === prevChildKey);
        arr.splice(arr.indexOf(prevEntry) + 1, 0, child);
        observer.next(arr.slice()); // Safe copy
      }

      function child_changed(skey: any, snapshot: any) {
        LogService.logMessage("Events child_changed");
        let key = skey;
        let child = snapshot;
        // TODO replace object rather than mutate it?
        let x = findInArray(arr, (y: any) => y[keyFieldName] === key);
        if (x) {
          for (var k in child) x[k] = child[k];
        }
        observer.next(arr.slice()); // Safe copy
      }

      function child_removed(skey: any, snapshot: any) {
        LogService.logMessage("Events child_removed");
        let key = skey;
        let x = findInArray(arr, (y: any) => y[keyFieldName] === key);
        if (x) {
          arr.splice(arr.indexOf(x), 1);
        }
        observer.next(arr.slice()); // Safe copy
      }

      fs.db.ref("events/" + UserService.getCurrentUser().memberOf).limitToLast(10).on('child_added', (snapshot: any, prevChildKey: any) => {
        fs.db.ref("users/" + snapshot.val().user_id).once("value").then((snapshot2: any) => {
          let event = new Event(snapshot.val().name, snapshot.val().text, snapshot.val().img);
          event.user_id = snapshot.val().user_id;
          event.user = UserService.mapUser(snapshot2.val());
          child_added(snapshot.key, event, prevChildKey);
        });
      });


      fs.db.ref("events/" + UserService.getCurrentUser().memberOf).limitToLast(10).on('child_changed', (snapshot: any) => {
        fs.db.ref("users/" + snapshot.val().user_id).once("value").then((snapshot2: any) => {
          let event = new Event(snapshot.val().name, snapshot.val().text, snapshot.val().img);
          event.user_id = snapshot.val().user_id;
          event.user = UserService.mapUser(snapshot2.val());
          child_changed(snapshot.key, event);
        });
      });

      fs.db.ref("events/" + UserService.getCurrentUser().memberOf).limitToLast(10).on('child_removed', (snapshot: any) => {
        child_removed(snapshot.key, event);
      })
    })
  }

  addEvent(name: string, text: string, img: string, callback: any) {
    let event = new Event(name, text, img);
    event.user = null;
    event.user_id = UserService.getCurrentUser().uid;
    this.fs.db.ref("events/" + UserService.getCurrentUser().memberOf).push().set(event, callback);
  }

}
