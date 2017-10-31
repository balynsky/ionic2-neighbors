import {Injectable} from "@angular/core";

@Injectable()
export class LogService {

  static logMessage(str: any, obj?: any) {
    let buff = str;
    if (typeof obj !== "undefined") {
      buff = buff + LogService.simpleStringify(obj);
    }
    console.log(buff)
  }

  static simpleStringify(object: any) {
    let simpleObject = {};
    for (let prop in object) {
      if (!object.hasOwnProperty(prop)) {
        continue;
      }
      if (typeof(object[prop]) == 'object') {
        continue;
      }
      if (typeof(object[prop]) == 'function') {
        continue;
      }
      simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
  };

}
