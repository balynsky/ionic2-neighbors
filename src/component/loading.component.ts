import {Component} from "@angular/core";

@Component({
    selector: 'loading-modal',
    template: `
        <div class="container" [ngClass]="{'busy': isBusy}">
            <div class="backdrop"></div>
            <ion-spinner></ion-spinner>
            <div class="content" style="visibility: hidden">{{content}}</div>
        </div>
`
})
export class LoadingModal {
    private isBusy:boolean;
    private content:any;

    constructor() {
        this.isBusy = false;
    }

    show(content:any) {
        this.isBusy = true;
        this.content = content;
    }

    hide() {
        this.isBusy = false;
        this.content = '';
    }

}