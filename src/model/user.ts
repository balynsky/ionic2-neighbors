export interface IUser {
    $key?:string;
    uid:string;
    auto:string;
    auto2:string;
    flatNumber:string;
    houseNumber?:string;
    memberOf:string;
    photoURL?:string;
    mobile1:string;
    mobile2:string;
    mail:string;
    isAdmin:boolean;
    displayName:string;
}

export class User implements IUser {
    auto:string = "";
    auto2:string = "";
    uid:string="";
    flatNumber = "";
    mobile1 = "";
    mobile2 = "";
    mail = "";
    houseNumber = "";
    memberOf:string = "";
    displayName:string = "";
    isAdmin:boolean = false;
    photoURL:string = "assets/img/avatar.png";


    constructor(auto:string, memberOf:string, displayName:string) {
        this.auto = auto;
        this.memberOf = memberOf;
        this.displayName = displayName;
    }
}
