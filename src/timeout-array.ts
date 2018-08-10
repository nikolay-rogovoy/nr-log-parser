/***/
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {filter} from "rxjs/operators";

export class TimeoutArray<T> extends Array<T> {

    get timeOutElement(): Observable<T> {
        return this.timeOutElementBehaviorSubject.pipe(filter(x => x != null));
    }

    /***/
    private timeOutElementBehaviorSubject = new BehaviorSubject<T>(null);

    /***/
    constructor(public timeOut: number) {
        super();
    }

    /***/
    push(...items: T[]): number {
        for (let item of items) {
            setTimeout(() => {
                const index = this.indexOf(item);
                if (index !== -1) {
                    this.splice(index, 1);
                    this.timeOutElementBehaviorSubject.next(item);
                }
            }, this.timeOut);
        }
        return super.push(...items);
    }
}
