import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Platform, Events} from "ionic-angular";
import {LogService} from "./log.service";
import {UserService} from "./user.service";
import {GroupsService} from "./groups.service";

var gapi: any;

@Injectable()
export class PushService {
  static CLIENT_ID = '6d5f7534f7e4251bb16edce579ffda89';
  static token: string = null;
  static host = "https://neighbors-dev-747bb.appspot.com";
  //private static host = "http://localhost:8080";
  static deviceUrl = PushService.host + "/neighbors/device";
  static messageUrl = PushService.host + "/neighbors/message";

  constructor(private platform: Platform, private http: Http, private events: Events, private gs: GroupsService) {
  }

  /*gapi.client.load('helloworld', 'v1', callback, apiRoot);

  this.events.subscribe('user:loaded', () => {
    LogService.logMessage(" listenToLoginEvents on PushService user:loaded");
    gs.getPushClientId((id: any) => {
      PushService.CLIENT_ID = id;
    });
    //this.init();
  });

  this.events.subscribe('user:logout', () => {
    LogService.logMessage(" listenToLoginEvents on PushService user:logout");
    if (PushService.token != null) {
      this.unregisterDevice();
    }
  });

  this.events.subscribe('device:register', () => {
    let currentUser = UserService.getCurrentUser();
    if (currentUser.memberOf != null) {
      this.registerDevice(PushService.token, currentUser.$key, currentUser.memberOf);
    } else {
      this.unregisterDevice();
    }
  });
}*/

  /* init(): void {
      if (this.platform.is("ios") || this.platform.is("android")) {
          LogService.logMessage("current platfom is mobile ios/android 2");
          this.push = PushNotification.init({
              android: {
                  senderID: "182008884806"
              },
              ios: {
                  alert: "true",
                  badge: false,
                  sound: "true"
              },
              windows: {}
          });
          LogService.logMessage("push init ", this.push);
          if (this.push.error !== 'cordova_not_available') {
              this.push.on('registration', (data) => {
                  LogService.logMessage("device token ->", data.registrationId);
                  PushService.token = data.registrationId;
                  this.events.publish("device:register");
              });

              this.push.on('notification', (data) => {
                  LogService.logMessage('message', data.message);
                  let self = this;
                  //if user using app and push notification comes
                  if (data.additionalData.foreground) {
                      // if application open, show popup
                      /!*let confirmAlert = Alert.create({
                       title: 'New Notification',
                       message: data.message,
                       buttons: [{
                       text: 'Ignore',
                       role: 'cancel'
                       }, {
                       text: 'View',
                       handler: () => {
                       //TODO: Your logic here
                       //self.nav.push(DetailsPage, {message: data.message});
                       }
                       }]
                       });*!/
                      //self.nav.present(confirmAlert);
                  } else {
                      //if user NOT using app and push notification comes
                      //TODO: Your logic on click of push notification directly
                      //self.nav.push(DetailsPage, {message: data.message});
                      LogService.logMessage("Push notification clicked");
                  }
              });
              this.push.on('error', (e) => {
                  LogService.logMessage(e.message);
              });
          }
      }
  }*/

  registerDevice(token: string, userId: string, groupId: string): void {
    if (this.platform.is("ios") || this.platform.is("android")) {
      let device_type = this.platform.is("ios") ? 'ios' : 'android';
      PushService.token = token;
      let body = 'token=' + token + '&user_id=' + userId + '&group_id=' + groupId + '&device_type=' + device_type;
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('CLIENT_ID', PushService.CLIENT_ID);
      this.http.post(PushService.deviceUrl, body, {
        headers: headers
      })
        .subscribe(data => {
          LogService.logMessage("success registered device")
        }, error => {
          this.events.publish("toast:show", error);
        });
    } else {
      LogService.logMessage("Platform is other");
    }
  }

  unregisterDevice(): void {
    if (this.platform.is("ios") || this.platform.is("android")) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('CLIENT_ID', PushService.CLIENT_ID);
      this.http.delete(PushService.deviceUrl + "?token=" + PushService.token, {
        headers: headers
      }).subscribe(data => {
        LogService.logMessage("success unregistered device")
      }, error => {
        this.events.publish("toast:show", error);
      });
    } else {
      LogService.logMessage("Platform is other");
    }
  }

  sendMessageToUser(message: string, userId: string): void {
    if (this.platform.is("ios") || this.platform.is("android")) {
      let body = 'message=' + message + '&user_id=' + userId;
      this.sendMessage(body);
    } else {
      LogService.logMessage("Platform is other");
    }
  }

  sendMessageToGroup(message: string, groupId: string): void {
    if (this.platform.is("ios") || this.platform.is("android")) {
      let body = 'message=' + message + '&group_id=' + groupId;
      this.sendMessage(body);
    } else {
      LogService.logMessage("Platform is other");
    }
  }

  sendMessage(body: any): void {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('CLIENT_ID', PushService.CLIENT_ID);
    this.http.post(PushService.messageUrl, body, {
      headers: headers
    })
      .subscribe(data => {
        LogService.logMessage("success sending message")
      }, error => {
        this.events.publish("toast:show", error);
      });
  }
}
