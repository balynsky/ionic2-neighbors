import {ViewController} from "ionic-angular";
import {Component} from "@angular/core";

@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Сообщение
        </ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <span ion-text color="primary" showWhen="ios">Закрыть</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
<!--
        <ion-buttons end>
          <button ion-button (click)="send()">
            <span ion-text color="primary" showWhen="ios">Отправить</span>
            <ion-icon name="md-send" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
-->
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label stacked>Введите сообщение</ion-label>
          <ion-textarea rows="5" autosize clearInput [(ngModel)]="message"></ion-textarea>
        </ion-item>
      </ion-list>
      <div padding>
        <button ion-button block (click)="send()">
          <ion-icon name="add"></ion-icon>
          &nbsp;Отправить
        </button>
      </div>

    </ion-content>
  `
})
export class ModalContentPage {
  message: string;

  constructor(public viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }

  send() {
    if (this.message !== '') {
      this.viewCtrl.dismiss(this.message);
    } else {
      this.dismiss();
    }
  }
}
