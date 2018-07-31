/***/
import {IFactattrib} from "./i-factattrib";

export interface IFactattribtype {
    /***/
    name: string;
    /***/
    check: (line: string) => IFactattrib;
}
