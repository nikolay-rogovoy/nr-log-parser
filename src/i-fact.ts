import {IFacttype} from "./i-facttype";
import {IFactattrib} from "./i-factattrib";

/***/
export interface IFact {
    /***/
    start: Date;
    /***/
    end: Date;
    /***/
    facttype: IFacttype,
    /***/
    factattrib: IFactattrib[]
}
