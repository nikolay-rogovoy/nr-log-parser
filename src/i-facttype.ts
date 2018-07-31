/***/
import {IFact} from "./i-fact";
import {IFactattribtype} from "./i-factattribtype";

export interface IFacttype {
    /***/
    name: string,
    /***/
    check: (line: string) => IFact,
    /***/
    checkEnd: (line: string) => Date,
    /***/
    factattribtypes: IFactattribtype[]
}
