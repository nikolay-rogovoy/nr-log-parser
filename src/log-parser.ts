import {IStorage} from "./i-storage";
import * as fs from "fs";
import * as readline from "readline";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {filter, map} from "rxjs/operators";
import {Observable} from "rxjs/Observable";
import {IFacttype} from "./i-facttype";
import {IFact} from "./i-fact";
import {IFactattribtype} from "./i-factattribtype";

/***/
export class LogParser {

    /***/
    activeFacts: IFact[] = [];

    /***/
    constructor(public facttypes: IFacttype[],
                public fileName: string,
                public storages: IStorage[]) {
    }

    /***/
    parse(): Observable<any> {
        return this.getLineReader()
            .pipe(
                map((line) => {
                    for (let facttype of this.facttypes) {
                        this.checkNewFact(facttype, line);
                        this.checkActiveFacts(facttype, line);
                    }
                    return true;
                })
            );
    }

    /***/
    checkActiveFacts(facttype: IFacttype, line: string) {
        for (let fact of this.activeFacts) {
            this.checkAttribs(facttype, fact, line);
            let endFact = facttype.checkEnd(line);
            if (endFact) {
                this.compliteFact(fact, endFact);
            }
        }
    }

    /***/
    checkAttribs(facttype: IFacttype, fact: IFact, line: string) {
        for (let factattribtype of facttype.factattribtypes) {
            this.checkAttrib(factattribtype, fact, line);
        }
    }

    /***/
    checkAttrib(factattribtype: IFactattribtype, fact: IFact, line: string) {
        let attrib = factattribtype.check(line);
        if (attrib) {
            fact.factattrib.push(attrib);
        }
    }

    /***/
    checkNewFact(facttype: IFacttype, line: string) {
        let newFact = facttype.check(line);
        if (newFact) {
            this.activeFacts.push(newFact);
        }
    }

    /***/
    compliteFact(fact: IFact, endFact: Date) {
        fact.end = endFact;
        this.saveFactInStoreges(fact);
        this.removeComplitedFact(fact);
    }

    /***/
    saveFactInStoreges(fact: IFact) {
        for (let storage of this.storages) {
            storage.write(fact);
        }
    }

    /***/
    removeComplitedFact(fact: IFact) {
        let index = this.activeFacts.indexOf(fact);
        if (index !== -1)
            this.activeFacts.splice(index, 1);
    }

    /***/
    getLineReader(): Observable<string> {
        let bs = new BehaviorSubject(null);
        let lineReader = readline.createInterface({
            input: fs.createReadStream(this.fileName)
        });
        lineReader.on('line', (input: any) => {
            bs.next(input);
        });
        return bs.pipe(filter(x => x != null));
    }
}
