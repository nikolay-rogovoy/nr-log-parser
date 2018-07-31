/***/
import {IFact} from "./i-fact";

export interface IStorage {
    /***/
    write(fact: IFact);
}
